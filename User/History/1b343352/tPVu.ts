// Test file để kiểm tra các rule TypeScript mới
// File này sẽ có nhiều lỗi để test ESLint rules

// ❌ Lỗi: Missing return type
const addNumbers = (a: number, b: number) => {
  return a + b
}

// ❌ Lỗi: Missing return type cho arrow function
const multiply = (x: number, y: number) => x * y

// ❌ Lỗi: Sử dụng any type
const processData = (data: any): any => {
  return data
}

// ❌ Lỗi: Missing return type cho function declaration
function divide(a: number, b: number) {
  return a / b
}

// ❌ Lỗi: Missing type cho variable
const result = addNumbers(1, 2)

// ❌ Lỗi: Missing type cho parameter
const greet = (name) => {
  return `Hello, ${name}!`
}

// ❌ Lỗi: Sử dụng any trong array methods
const numbers = [1, 2, 3, 4, 5]
const doubled = numbers.map((n: any) => n * 2)

// ❌ Lỗi: Missing return type cho async function
const fetchData = async (url: string) => {
  const response = await fetch(url)
  return response.json()
}

// ❌ Lỗi: Sử dụng any trong catch block
try {
  // some code
} catch (error: any) {
  console.error(error.message)
}

// ✅ Correct examples (không có lỗi)
const addNumbersCorrect = (a: number, b: number): number => {
  return a + b
}

const multiplyCorrect = (x: number, y: number): number => x * y

const processDataCorrect = (data: string): string => {
  return data.toUpperCase()
}

function divideCorrect(a: number, b: number): number {
  return a / b
}

const resultCorrect: number = addNumbersCorrect(1, 2)

const greetCorrect = (name: string): string => {
  return `Hello, ${name}!`
}

const numbersCorrect: number[] = [1, 2, 3, 4, 5]
const doubledCorrect: number[] = numbersCorrect.map((n: number): number => n * 2)

const fetchDataCorrect = async (url: string): Promise<any> => {
  const response = await fetch(url)
  return response.json()
}

try {
  // some code
} catch (error: unknown) {
  console.error((error as Error).message)
}
