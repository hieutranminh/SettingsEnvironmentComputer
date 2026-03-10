<template>
  <div>
    <h1>Estimated Time</h1>
  </div>
</template>

<script>
export default {
  computed: {
    estimatedTimeOptions() {
      return [
        { text: '30 Mins', value: 30 },
        { text: '60 Mins', value: 60 },
        { text: '90 Mins', value: 90 },
        { text: '120 Mins', value: 120 },
        { text: '150 Mins', value: 150 },
        { text: '180 Mins', value: 180 },
        { text: '3 hours 30 mins', value: 210 },
        { text: '4 hours', value: 240 },
        { text: '4 hours 30 mins', value: 270 },
        { text: '5 hours', value: 300 },
        { text: '6 hours', value: 360 },
        { text: '7 hours', value: 420 },
        { text: '8 hours', value: 480 },
        { text: '9 hours', value: 540 },
        { text: '10 hours', value: 600 },
      ]
    },
  },
}
</script>
