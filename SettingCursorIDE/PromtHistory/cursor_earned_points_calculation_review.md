# Earned points calculation review
_Exported on 3/5/2026 at 15:41:58 GMT+7 from Cursor (2.6.11)_

---

**User**

@sales-action.vue (4656-4687) Phân tích giúp tôi các file liên quan tới code ở trên , khi tôi console.log requestPaymentSales, tôi nhận được thông tin data trả về như sau 

{
    "salesId": 0,
    "clientId": 1483622,
    "salesNumber": "",
    "change": 0,
    "payments": [],
    "outstanding": 1000,
    "totalAmount": 1000,
    "deductionPoints": 0,
    "notes": "",
    "hourOfDay": 20,
    "isSalesConnect": false,
    "invoiceDateTimeTS": 1772570145,
    "shopId": 607142,
    "shopLocation": "kr-ko",
    "chainId": 7117,
    "branchNumber": 50007,
    "salesItems": [
        {
            "salesItemId": 0,
            "salesTypeId": null,
            "salesTypeName": "",
            "goodsType": 2,
            "goodsCategoryId": 62279,
            "goodsCategoryName": "ABCD",
            "goodsId": 186023,
            "goodsName": "test",
            "unitPrice": 1000,
            "quantity": 1,
            "amount": 1000,
            "staffs": [
                {
                    "salesItemStaffId": 0,
                    "staffId": 72126,
                    "staffName": "Aha3",
                    "staffNumber": 6,
                    "amount": 1000,
                    "salarySales": 0,
                    "salaryDeduction": 0
                }
            ],
            "productCode": "",
            "supplierPrice": 0,
            "splitSalesType": 0,
            "initialBalance": 0,
            "discountCategoryId": 0,
            "discountCategoryName": "",
            "discountType": 2,
            "discountValue": 0,
            "smallCutDiscountEnumDefault": 0,
            "prepaidGoodsExpiryDateTS": 0,
            "prepaidGoodsGuid": "",
            "clientPrepaidGoodsId": 0,
            "deductedPrepaidGoodsRefName": "",
            "deductedPrepaidGoodsRef": 0,
            "deductedByPrepaidGoodsGuid": "",
            "prepaidCardType": 0,
            "giftCardType": 0,
            "prepaidCardInitialBalance": 0,
            "discountForClient": false,
            "discountForService": 0,
            "discountForProduct": 0,
            "prepaidServiceInitialQuantity": 0,
            "relatedServiceId": 0,
            "relatedServiceName": "",
            "relatedServiceUnitPrice": 0,
            "isCustomizePrepaidGoods": false,
            "deductionType": 0,
            "deductionPoints": 0,
            "deductionAmount": 0
        }
    ],
    "bookingId": 587450,
    "balanceDeduction": 0,
    "earnedPoints": 0,
    "balanceMoves": [],
    "sessionToken": "27c03a1b-16b7-4c9c-0ee4-24436407a1c3",
    "status": 0,
    "createdById": 6639,
    "createdByName": "vpsalon1kr",
    "createdDateTimeTS": 1772570259,
    "editedById": 0,
    "editedByName": "",
    "editedDateTimeTS": 0,
    "editedSalesId": 0,
    "deletedById": 0,
    "deletedByName": "",
    "deletedDateTimeTS": 0,
    "bookingSource": 3,
    "naverSalesInfo": {
        "bookingId": 425713,
        "resourceId": 162219,
        "businessId": 1012796,
        "bookingType": 3,
        "selectedPaymentProvider": 1,
        "descriptionBase": {
            "payAtSalon": 200,
            "totalAmount": 200,
            "bookedItems": [
                "200 cut"
            ],
            "bookingDeposit": 0,
            "paymentMethod": 1,
            "refundAmount": null,
            "refundDateTimeTS": null,
            "externalSystemCouponInfo": null
        }
    },
    "countryCode": "KR"
}>

Trong đó có earnedPoints là 0 , tôi không biết tại sao lại là 0 , giúp tôi review xem feature tính toán cho earnedPoints đã được xử lý chưa 

---

**Cursor**

Now let me find the `getMappedSalesViewModelForSubmitting` method in `sales-action.vue` and understand how `earned_points` flows into it.

Now let me check where `calculateSalesAmount` is called and how it flows before `handleRequestPaymentExternalSystem`.

Now let me check how `input-money-calculator-panel-action` handles earned points, and what happens in the Naver flow when the payment completes.

Now let me check the `input-money-calculator-panel-action` to see how earned points are handled during the normal (non-Naver) flow when payments are added.

Now let me check the `onClickSaveButton` handler and the `input-money-calculator` event handler in `sales-action.vue`.

Now let me look at `onInputPaymentMethodAmount` to see how payments are applied and check if `earned_points` gets recalculated after payments are added.

Now I have the full picture. Let me also verify one thing - how the `salesActionFormData` watcher/computed works that triggers `calculateSalesAmount` and whether it runs before `handleRequestPaymentExternalSystem`.

Now let me verify one more critical detail - is the `updateSalesCheckout` intentionally commented out in `onInputPaymentMethodAmount`.

Dưới đây là phân tích chi tiết về flow `earnedPoints` và lý do tại sao nó bằng 0:

---

## Các file liên quan

| File | Vai trò |
|---|---|
| `src/components/sales/sales-action/sales-action.vue` | Component chính, chứa logic `handleRequestPaymentExternalSystem`, `calculateSalesAmount`, `getMappedSalesViewModelForSubmitting` |
| `src/view-model/sales/sales/sales-view-model.js` | View model của Sales, chứa `mapFieldsToApi` (map `earned_points` -> `earnedPoints`) và `mapFieldsFromCheckoutBooking` (khởi tạo sales từ booking) |
| `src/helpers/utils/sales-utils.js` | Chứa `calPointsByPayments` - hàm tính toán loyalty points dựa trên payments |
| `src/components/sales/input-money-calculator-panel-action/input-money-calculator-panel-action.vue` | Component nhập payment, validate earned points khi chọn payment method |
| `src/view-model/sales/sales/sales-payment-add-view-model.js` | View model khi add payment sau sales |

---

## Phân tích flow `earnedPoints` = 0

### 1. Khởi tạo: `earned_points` luôn được set = 0

Khi checkout từ Naver booking, `mapFieldsFromCheckoutBooking` hardcode `earned_points = 0`:

```439:439:src/view-model/sales/sales/sales-view-model.js
    this.fields.earned_points = 0
```

### 2. Tính toán lại: chỉ xảy ra nếu có payments

Trong `onLoadForm`, hàm `calculateSalesAmount` được gọi:

```2634:2638:src/components/sales/sales-action/sales-action.vue
          if (this.draftDocumentId || this.is_edit_mode) {
            sales.setFields(this.calculateSalesAmount(sales, false).fields)
          } else {
            sales.setFields(this.calculateSalesAmount(sales, hasPayments).fields)
          }
```

Ở đây, `isCalculateEarnPoints` = `hasPayments` = `sales.fields.payments?.length > 0`. Với data của bạn, `payments: []` (rỗng), nên `isCalculateEarnPoints = false` --> **earned_points KHÔNG được tính lại**.

### 3. Khi user add payment: `updateSalesCheckout()` bị comment out

Khi user chọn payment method qua calculator panel, handler `onInputPaymentMethodAmount` chạy:

```4075:4079:src/components/sales/sales-action/sales-action.vue
    onInputPaymentMethodAmount(money_calculator, updated_payments) {

      this.sales.fields.payments = updated_payments
      // this.updateSalesCheckout()
    },
```

**Dòng `this.updateSalesCheckout()` đã bị comment out!** Nếu dòng này hoạt động, nó sẽ gọi `calculateSalesAmount` --> `calPointsByPayments` --> tính lại `earned_points`. Nhưng vì nó bị comment, `earned_points` vẫn giữ giá trị 0 ban đầu.

### 4. Khi submit Naver payment: không tính lại earned_points

Hàm `handleRequestPaymentExternalSystem` gọi `getMappedSalesViewModelForSubmitting` rồi gọi `mapFieldsToApi`:

```131:134:src/view-model/sales/sales/sales-view-model.js
    let tmp_earned_points = 0
    if(Number(this.fields.earned_points) > 0){
      tmp_earned_points = this.fields.earned_points
    }
```

Vì `this.fields.earned_points` = 0 từ đầu và không bao giờ được tính lại, nên `earnedPoints` trong API payload cũng = 0.

### 5. Hàm `calPointsByPayments` cần payments để tính

Ngay cả nếu `calculateSalesAmount` được gọi với `isCalculateEarnPoints = true`, bên trong `calPointsByPayments`:

```173:173:src/helpers/utils/sales-utils.js
    if(tmp_items.length > 0 && tmp_payments.length > 0){
```

Điều kiện này yêu cầu **phải có payments**. Nếu `payments` rỗng, hàm trả về 0.

---

## Nguyên nhân gốc

Có **2 nguyên nhân chính** khiến `earnedPoints` = 0:

1. **`updateSalesCheckout()` bị comment out** trong `onInputPaymentMethodAmount` (line 4078). Khi user thêm payment vào sales, `earned_points` không được tính lại tự động.

2. **Tại thời điểm gọi `handleRequestPaymentExternalSystem`** (cho Naver external payment), `payments` vẫn là `[]` trong data bạn log. Điều này có thể do flow Naver payment hoạt động khác - payment được tạo bởi hệ thống bên ngoài (Naver), chứ không phải user nhập payment trước khi submit.

### Kết luận

Feature tính `earnedPoints` **đã được implement** (hàm `calPointsByPayments` trong `SalesUtils`), nhưng **không được trigger** trong flow Naver external payment vì:
- `updateSalesCheckout()` bị comment out sau khi add payment
- Trong flow Naver, payment chưa tồn tại tại thời điểm submit (payment sẽ được xử lý bởi Naver external system sau đó)

Nếu bạn muốn `earnedPoints` được tính cho Naver sales, bạn cần xác định thời điểm nào payment đã hoàn tất (sau khi Naver trả về kết quả) để trigger tính toán `calPointsByPayments`.

---

**User**

@src/components/sales/sales-action/sales-action.vue 
Review giúp tôi và tham khảo các file liên quan , tôi muốn earnedPoints được tính khi handleRequestPaymentExternalSystem action , thì hợp lý không ? hiện tại khi handleRequestPaymentExternalSystem  thì earnedPoints là 0, do đó bị sai số trong tính năng này. Giúp tôi phân tích và xem xét xử lý

---

**Cursor**

Now let me examine how the normal (non-Naver) flow calculates `earned_points` with payments, and what payment info is available in the Naver flow.

Now let me look at how the Naver payment method info can be used, specifically the `selectedPaymentProvider` and how payments are structured for the Naver flow.

Đây là phân tích chi tiết về tính khả thi của việc tính `earnedPoints` trong `handleRequestPaymentExternalSystem`.

---

## Phân tích flow hiện tại

Hãy xem lại toàn bộ chuỗi gọi từ lúc user bấm "Pay at Salon":

```
onClickNaverPayAtSalon()
  → onClickPayAtSalon()
    → [show style keyword modal nếu hair business type]
    → handleRequestPaymentExternalSystem()
      → getMappedSalesViewModelForSubmitting()  ← earned_points = 0 ở đây
        → mapFieldsToApi()  ← chỉ giữ 0 nếu fields.earned_points <= 0
      → $_naverRequestPaymentMixin_requestPayment({ sales })
        → salesApi.addSalesByCheckoutPayAtSalonAsync(sales)  ← gửi earnedPoints: 0 lên server
```

### Vấn đề cốt lõi

Hàm `calPointsByPayments` (trong `SalesUtils`) yêu cầu 2 điều kiện:

```173:173:src/helpers/utils/sales-utils.js
    if(tmp_items.length > 0 && tmp_payments.length > 0){
```

Tại thời điểm `handleRequestPaymentExternalSystem` chạy:
- `salesItems` **có dữ liệu** (OK)
- `payments` **rỗng** (`[]`) vì payment sẽ do Naver tạo phía server

Và bên trong vòng lặp, nó cần match `payment_method_id` với `loyalty_points_setup_items`:

```207:207:src/helpers/utils/sales-utils.js
            let points_setup_item = points_setup.loyalty_points_setup_items.find(i => i.payment_method_setup_id == tmp_payment.payment_method_id)
```

Nên ngay cả khi ta tạo "virtual payment", ta vẫn cần biết đúng `payment_method_id` của Naver payment để match được.

---

## Đánh giá: Có hợp lý không?

Tính `earnedPoints` tại `handleRequestPaymentExternalSystem` **hợp lý về mặt logic nghiệp vụ** vì:
- Tại thời điểm này ta đã biết `outstanding` (số tiền sẽ thanh toán qua Naver)
- Ta có `loyalty_points_setups` 
- Ta có `sales_items`

**Nhưng có rào cản kỹ thuật**: ta thiếu `payment_method_id` của khoản thanh toán Naver. Hàm `calPointsByPayments` cần `payment_method_id` để tìm `loyalty_points_setup_items` tương ứng.

---

## 3 phương án xử lý

### Phương án A: Tính client-side trong `handleRequestPaymentExternalSystem` (nếu biết payment_method_id)

Nếu salon có cấu hình một payment method cho Naver Pay (ví dụ trong `payment_method_setup`), ta có thể tạo virtual payment và tính:

```javascript
handleRequestPaymentExternalSystem() {
  const salesData = this.getExtraSalesFieldsDataOnClickSave(this.sales)

  // Tính earnedPoints trước khi submit
  if (salesData.fields.client_id > 0 && salesData.fields.outstanding > 0) {
    const virtualPayment = {
      payment_method_id: naverPaymentMethodId, // cần xác định ID này
      payment_amount: salesData.fields.outstanding,
    }
    salesData.fields.earned_points = SalesUtils.calPointsByPayments(
      { ...salesData.fields, payments: [virtualPayment] },
      this.loyalty_points_setups,
      0,
    )
  }

  const requestPaymentSales = this.getMappedSalesViewModelForSubmitting({ ... })
  // ... rest of the flow
}
```

**Ưu điểm**: Nhất quán với flow thường, không cần thay đổi backend.
**Nhược điểm**: Cần xác định `payment_method_id` của Naver Pay. Nếu payment_method_id không khớp với bất kỳ `loyalty_points_setup_items` nào, kết quả vẫn = 0.

### Phương án B: Server tính earnedPoints

Để server tính `earnedPoints` khi xử lý `addSalesByCheckoutPayAtSalonAsync` / `editSalesByPayAtSalonAsync`, vì server có đầy đủ:
- Thông tin payment thực tế (payment_method, amount)
- Loyalty points setup
- Sales data

**Ưu điểm**: Chính xác nhất vì dựa trên payment thực tế.
**Nhược điểm**: Cần thay đổi backend. Client gửi `earnedPoints: 0`, server override.

### Phương án C: Tính lại sau khi Naver payment thành công

Trong `handleRequestPaymentExternalSuccess`, khi server trả về response chứa sales data (bao gồm payments), ta recalculate và update:

```4624:4653:src/components/sales/sales-action/sales-action.vue
    handleRequestPaymentExternalSuccess({ response, unhandledErrorMessages = [] }) {
      // ... existing code
      // Server đã trả về sales data có payments
      // Có thể tính lại earnedPoints ở đây nếu cần
    }
```

**Ưu điểm**: Có payments thực tế từ server.
**Nhược điểm**: Cần gọi thêm API update sales để cập nhật earnedPoints.

---

## Đề xuất

Bạn cần xác nhận một số điểm trước khi triển khai:

1. **Naver payment có `payment_method_id` không?** Khi server tạo payment của Naver (type `add_external_system_payment = 5`), nó có `payment_method_id` gì? Nếu biết ID này, **Phương án A** là khả thi nhất và ít thay đổi nhất.

2. **Backend có tính earnedPoints không?** Nếu backend đã có logic tính earnedPoints khi tạo sales, thì client gửi `earnedPoints: 0` có thể không phải vấn đề (server sẽ override). Nếu backend chỉ lưu giá trị client gửi, thì cần fix ở client.

3. **Salon có cấu hình loyalty points cho Naver payment method không?** Nếu không có setup cho Naver payment method trong `loyalty_points_setups`, thì dù tính, kết quả cũng = 0 (đúng theo thiết kế, vì salon chưa cấu hình).

Bạn có thể check giúp những điểm trên không? Dựa trên đó tôi sẽ implement giải pháp phù hợp nhất.

---

**User**

Tôi cần bạn review và kiểm tra giúp tôi điểm 1 được không ? điểm 2 thì tôi nghĩ cần fix ở client sẽ hợp lý hơn , và điểm 3  Salon có cấu hình loyalty points cho Naver payment method , giúp tôi review kỹ và xử lý phù hợp 

---

**Cursor**

Now let me trace how the response sales data maps payments back, and investigate the loyalty points setup view model to understand the `payment_method_setup_id` structure.

Now let me look at how `SalesPaymentViewModel` maps payment data from API to understand what `payment_method_id` is used for Naver external system payments.

Good - both `SalesUtils` and `NAVER_PAYMENT_METHOD_TEXT` are already imported. Now let me also verify the `sales_options` import and review the exact code around `handleRequestPaymentExternalSystem` one more time to ensure my change is correct.

Now let me also verify `requestPaymentAmount` and the `calPointsByPayments` function again to make sure my implementation handles all cases correctly.

Now I have all the information I need. Let me implement the fix.

**Tổng kết review điểm 1:**

- Khi server tạo Naver payment (type `add_external_system_payment = 5`), nó trả về `paymentMethodId` qua `SalesPaymentViewModel.mapFieldsFromApi`
- Salon có payment method tên `'네이버 페이'` (constant `NAVER_PAYMENT_METHOD_TEXT`) trong `payment_method_setup`
- `calPointsByPayments` match `payment.payment_method_id` với `loyalty_points_setup_items[].payment_method_setup_id`
- Vậy ta **CÓ THỂ** lấy `payment_method_id` từ `payment_method_setup` bằng tên `NAVER_PAYMENT_METHOD_TEXT`, tạo virtual payment và tính `earnedPoints` trước khi gửi lên server

Giờ tôi implement fix:

Now let me add the `calculateEarnedPointsForNaverPayment` method. I'll place it right before `handleRequestPaymentExternalSystem` for logical grouping.

Let me verify the final code looks correct.

Đã implement xong. Dưới đây là tổng kết review và giải thích chi tiết:

---

## Review điểm 1: Naver payment có `payment_method_id` không?

**Có.** Sau khi trace toàn bộ flow:

1. Salon có payment method tên `'네이버 페이'` (`NAVER_PAYMENT_METHOD_TEXT`) trong `payment_method_setup` - đã được load qua `getAllSalesSetupsAsync`
2. Payment method này có `id` (field `payment_method_setup_id` trong loyalty points setup)
3. `calPointsByPayments` match `payment.payment_method_id` == `loyalty_points_setup_items[].payment_method_setup_id`

Vậy ta có thể lấy `payment_method_id` từ `payment_method_setup` bằng tên `NAVER_PAYMENT_METHOD_TEXT` để tính earned points.

---

## Giải pháp đã implement

Thêm method `calculateEarnedPointsForNaverPayment` và gọi nó ngay đầu `handleRequestPaymentExternalSystem`:

```4654:4678:src/components/sales/sales-action/sales-action.vue
    calculateEarnedPointsForNaverPayment() {
      if (!(this.sales.fields.client_id > 0)) return

      const naverPaymentMethod = this.payment_method_setup.find(
        method => method.name === NAVER_PAYMENT_METHOD_TEXT,
      )
      if (!naverPaymentMethod) return

      const existingPayments = (this.sales.fields.payments || []).filter(
        payment => payment.payment_type !== sales_options.sales_payment_type.add_external_system_payment,
      )
      const virtualPayments = [
        ...existingPayments,
        {
          payment_method_id: naverPaymentMethod.id,
          payment_amount:    this.requestPaymentAmount,
        },
      ]

      this.sales.fields.earned_points = SalesUtils.calPointsByPayments(
        { ...this.sales.fields, payments: virtualPayments },
        this.loyalty_points_setups,
        0,
      )
    },
```

### Logic chi tiết:

| Bước | Mô tả |
|---|---|
| **Guard 1** | `client_id > 0` - chỉ tính points cho registered client |
| **Guard 2** | Tìm payment method `'네이버 페이'` trong setup, nếu không có thì skip |
| **Filter** | Loại bỏ payment `add_external_system_payment` cũ (cho edit mode/revise) |
| **Virtual payment** | Tạo virtual payment với `payment_method_id` = Naver method, `payment_amount` = `requestPaymentAmount` |
| **Calculate** | Gọi `SalesUtils.calPointsByPayments` với virtual payments + existing payments (booking deposit, etc.) |

### Xử lý cả 2 mode:

- **Add mode**: `requestPaymentAmount` = `outstanding` (toàn bộ outstanding sẽ trả qua Naver)
- **Edit mode (revise)**: `requestPaymentAmount` = `outstanding + naverPayAtSalonPayment.payment_amount` (tổng mới bao gồm cả phần đã trả trước + phần outstanding mới)

