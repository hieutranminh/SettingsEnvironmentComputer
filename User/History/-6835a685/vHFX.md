# Fix Proposal: Critical Issues trong Bookings Module

## 🔴 Issue #1: Async forEach Anti-pattern

### Current Code (bookings.js:308)
```javascript
async addBooking({ commit, dispatch }, { booking }) {
  commit('setBookingSet', booking)
  
  const bookingDateTS = convertTimestampToMomentUTC(booking.bookingDateTS).startOf('day').unix()
  
  booking.bookedResources.forEach(async bookedResource => {
    const bookingItemModuleName = `${bookingDateTS}_${bookedResource.bookingResourceSetupId}`
    
    await dispatch('setBookingResourceAvailable', {
      bookingDateTS,
      bookedResource,
    })
    
    // ... rest of logic
  })
}
```

### Proposed Fix
```javascript
async addBooking({ commit, dispatch }, { booking }) {
  commit('setBookingSet', booking)
  
  const bookingDateTS = convertTimestampToMomentUTC(booking.bookingDateTS).startOf('day').unix()
  
  // Option 1: Sequential (giữ nguyên thứ tự)
  for (const bookedResource of booking.bookedResources) {
    const bookingItemModuleName = `${bookingDateTS}_${bookedResource.bookingResourceSetupId}`
    
    await dispatch('setBookingResourceAvailable', {
      bookingDateTS,
      bookedResource,
    })
    
    // ... rest of logic
  }
  
  // Option 2: Parallel (nhanh hơn nếu không cần thứ tự)
  await Promise.all(booking.bookedResources.map(async bookedResource => {
    const bookingItemModuleName = `${bookingDateTS}_${bookedResource.bookingResourceSetupId}`
    
    await dispatch('setBookingResourceAvailable', {
      bookingDateTS,
      bookedResource,
    })
    
    // ... rest of logic
  }))
}
```

**Recommend:** Option 2 (Parallel) vì các bookedResources độc lập nhau

---

## 🔴 Issue #2: Logic Bug trong Anti-Duplicate Check

### Current Code (bookings.js:316-321)
```javascript
// Avoid adding duplicate booking - especially through signalR
const existedBooking = state.bookingSet[booking.bookingId]
const hasSingleResource = bookedResource && typeof bookedResource === 'object'
if (existedBooking?.bookingSource === BOOKING_SOURCE.NAVER || 
    (existedBooking && hasSingleResource) && bookedResource.length <= 1) {
  dispatch('removeBookingById', { bookingId: booking.bookingId })
}
```

### Issues:
1. `bookedResource.length` sai vì bookedResource là Object, không phải Array
2. Logic này chạy SAU khi đã `setBookingSet` → `existedBooking` luôn true
3. `removeBookingById` rồi lại `addOrUpdateItem` → không có ý nghĩa

### Proposed Fix: Remove hoàn toàn logic này

```javascript
// Option 1: REMOVE COMPLETELY
// Logic này không còn cần thiết vì addOrUpdateItem đã handle duplicate
// Chỉ cần đảm bảo addOrUpdateItem được gọi

// Option 2: Nếu muốn giữ special logic cho Naver bookings
const existedBooking = state.bookingSet[booking.bookingId]
if (existedBooking && existedBooking.bookingSource === BOOKING_SOURCE.NAVER) {
  // Special handling for Naver bookings
  // Có thể cần check version hoặc timestamp để quyết định update hay skip
  if (existedBooking.editedDateTimeTS > booking.editedDateTimeTS) {
    return // Skip if existing booking is newer
  }
}
```

**Recommend:** Option 1 - Remove hoàn toàn

---

## 🔴 Issue #3: Race Condition Flow

### Current Flow Problem
```
Step 1: commit('setBookingSet', booking)              // Add vào global set
Step 2: const existedBooking = state.bookingSet[...]  // Check exist = true (vừa add)
Step 3: dispatch('removeBookingById', ...)            // Remove booking
Step 4: commit('addOrUpdateItem', ...)                // Add lại vào items
```

### Proposed Fix: Restructure Logic Flow

```javascript
async addBooking({ commit, dispatch, state }, { booking }) {
  // 1. Check if booking already exists FIRST
  const existedBooking = state.bookingSet[booking.bookingId]
  
  // 2. Handle special cases
  if (existedBooking) {
    // Nếu đã tồn tại, có thể muốn skip hoặc update
    // Tùy business logic
    if (existedBooking.bookingSource === BOOKING_SOURCE.NAVER) {
      // Special handling for Naver
    }
  }
  
  // 3. Update global bookingSet
  commit('setBookingSet', booking)
  
  const bookingDateTS = convertTimestampToMomentUTC(booking.bookingDateTS).startOf('day').unix()
  
  // 4. Process each resource
  await Promise.all(booking.bookedResources.map(async bookedResource => {
    const bookingItemModuleName = `${bookingDateTS}_${bookedResource.bookingResourceSetupId}`
    
    await dispatch('setBookingResourceAvailable', {
      bookingDateTS,
      bookedResource,
    })
    
    if (!excludeBookingStatuses.includes(booking.status)) {
      commit(`_calendar/bookings/${bookingItemModuleName}/addOrUpdateItem`, {
        ...booking,
        bookedResources: [bookedResource],
      }, { root: true })
    }
  }))
}
```

---

## 🔴 Issue #4: Same Problem trong parseBookingsToObj

### Current Code (bookings.js:280-300)
```javascript
bookings.forEach(booking => {
  const bookingDateTS = convertTimestampToMomentUTC(booking.bookingDateTS).startOf('day').unix()
  
  booking.bookedResources.forEach(async bookedResource => {
    await dispatch('setBookingResourceAvailable', {...})
    // ...
  })
})
```

### Proposed Fix
```javascript
// Parallel processing cho better performance
await Promise.all(bookings.map(async booking => {
  const bookingDateTS = convertTimestampToMomentUTC(booking.bookingDateTS).startOf('day').unix()
  
  await Promise.all(booking.bookedResources.map(async bookedResource => {
    const bookingItemModuleName = `${bookingDateTS}_${bookedResource.bookingResourceSetupId}`
    
    await dispatch('setBookingResourceAvailable', {
      bookingDateTS,
      bookedResource,
    })
    
    if (!excludeBookingStatuses.includes(booking.status)) {
      commit(`_calendar/bookings/${bookingItemModuleName}/addOrUpdateItem`, {
        ...booking,
        bookedResources: [bookedResource],
      }, { root: true })
    } else {
      await dispatch('removeBookingById', { bookingId: booking.bookingId })
    }
  }))
}))
```

---

## 🎯 Implementation Order

### Step 1: Fix addBooking (Highest Priority)
- Remove dead anti-duplicate code
- Fix async forEach → Promise.all
- Add error handling

### Step 2: Fix parseBookingsToObj
- Fix async forEach → Promise.all
- Ensure consistency với addBooking

### Step 3: Same fix cho các methods tương tự
- updateBooking (line 609-638)
- removeBooking (line 467-476)
- changeBooking (line 486-520)

---

## ⚠️ Testing Checklist

Sau khi fix, cần test các scenarios:

1. ✅ Add booking mới (normal case)
2. ✅ Add booking duplicate (same bookingId)
3. ✅ Add booking với multiple resources
4. ✅ Add booking qua SignalR (realtime)
5. ✅ Add Naver booking
6. ✅ Move booking giữa các resources
7. ✅ Update booking status
8. ✅ Cancel booking
9. ✅ Load bookings khi change date range
10. ✅ Drag & drop booking

---

## 📌 Breaking Changes Warning

Các changes này có thể affect:
- SignalR real-time updates
- Booking notification system
- Naver booking sync
- Multi-resource bookings

⚠️ **Nên test kỹ trên staging trước khi deploy production**

