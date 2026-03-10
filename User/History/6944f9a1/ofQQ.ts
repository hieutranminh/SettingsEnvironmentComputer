import { defineStore } from 'pinia'
import { ref } from 'vue'

// This should NOT trigger max-lines-custom error
export const useTestStore = defineStore('test', () => {
  const state = ref(0)
  
  // This function should trigger max-lines-custom error (over 30 lines)
  const longFunction = () => {
    console.log('line 1')
    console.log('line 2')
    console.log('line 3')
    console.log('line 4')
    console.log('line 5')
    console.log('line 6')
    console.log('line 7')
    console.log('line 8')
    console.log('line 9')
    console.log('line 10')
    console.log('line 11')
    console.log('line 12')
    console.log('line 13')
    console.log('line 14')
    console.log('line 15')
    console.log('line 16')
    console.log('line 17')
    console.log('line 18')
    console.log('line 19')
    console.log('line 20')
    console.log('line 21')
    console.log('line 22')
    console.log('line 23')
    console.log('line 24')
    console.log('line 25')
    console.log('line 26')
    console.log('line 27')
    console.log('line 28')
    console.log('line 29')
    console.log('line 30')
    console.log('line 31')
    console.log('line 32')
  }

  return {
    state,
    longFunction,
  }
})
