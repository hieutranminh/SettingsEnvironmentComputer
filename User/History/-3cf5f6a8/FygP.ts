// Fake Data Generator Utilities
// Pure functions for generating various types of fake data

import type { FakeDataType, GeneratedData } from '../types'

// Data pools
const FIRST_NAMES: string[] = [
  'James', 'John', 'Robert', 'Michael', 'William', 'David', 'Richard', 'Joseph',
  'Thomas', 'Christopher', 'Mary', 'Patricia', 'Jennifer', 'Linda', 'Barbara',
  'Elizabeth', 'Susan', 'Jessica', 'Sarah', 'Karen', 'Emily', 'Emma', 'Olivia',
  'Ava', 'Isabella', 'Sophia', 'Mia', 'Charlotte', 'Amelia', 'Harper'
]

const LAST_NAMES: string[] = [
  'Smith', 'Johnson', 'Williams', 'Brown', 'Jones', 'Garcia', 'Miller', 'Davis',
  'Rodriguez', 'Martinez', 'Hernandez', 'Lopez', 'Gonzalez', 'Wilson', 'Anderson',
  'Thomas', 'Taylor', 'Moore', 'Jackson', 'Martin', 'Lee', 'Perez', 'Thompson',
  'White', 'Harris', 'Sanchez', 'Clark', 'Ramirez', 'Lewis', 'Robinson'
]

const DOMAINS: string[] = [
  'gmail.com', 'yahoo.com', 'hotmail.com', 'outlook.com', 'mail.com',
  'protonmail.com', 'icloud.com', 'aol.com', 'zoho.com', 'fastmail.com'
]

const CITIES: string[] = [
  'New York', 'Los Angeles', 'Chicago', 'Houston', 'Phoenix', 'Philadelphia',
  'San Antonio', 'San Diego', 'Dallas', 'San Jose', 'Austin', 'Jacksonville',
  'Fort Worth', 'Columbus', 'Charlotte', 'Seattle', 'Denver', 'Boston',
  'Portland', 'Las Vegas', 'Miami', 'Atlanta', 'Detroit', 'Minneapolis'
]

const COUNTRIES: string[] = [
  'United States', 'United Kingdom', 'Canada', 'Australia', 'Germany',
  'France', 'Japan', 'Italy', 'Spain', 'Netherlands', 'Sweden', 'Norway',
  'Denmark', 'Finland', 'Switzerland', 'Austria', 'Belgium', 'Ireland',
  'New Zealand', 'Singapore', 'South Korea', 'Brazil', 'Mexico', 'India'
]

const STREET_TYPES: string[] = [
  'Street', 'Avenue', 'Boulevard', 'Drive', 'Lane', 'Road', 'Way', 'Court',
  'Place', 'Circle', 'Trail', 'Parkway', 'Commons', 'Square', 'Terrace'
]

const STREET_NAMES: string[] = [
  'Main', 'Oak', 'Maple', 'Cedar', 'Pine', 'Elm', 'Washington', 'Lake',
  'Hill', 'Park', 'Forest', 'River', 'Spring', 'Valley', 'Sunset', 'Highland',
  'Meadow', 'Church', 'Mill', 'School', 'North', 'South', 'East', 'West'
]

const COMPANIES: string[] = [
  'Acme Corporation', 'GlobalTech Solutions', 'Innovate Industries', 'Prime Dynamics',
  'Vertex Systems', 'Quantum Enterprises', 'Nexus Digital', 'Apex Consulting',
  'Horizon Partners', 'Summit Group', 'Pioneer Labs', 'Catalyst Corp',
  'Synergy Solutions', 'Elevate Inc', 'Momentum Technologies', 'Fusion Works',
  'Stellar Ventures', 'Atlas Holdings', 'Zenith Industries', 'Omega Systems'
]

const JOB_TITLES: string[] = [
  'Software Engineer', 'Product Manager', 'Data Analyst', 'UX Designer',
  'Marketing Manager', 'Sales Representative', 'Project Manager', 'Business Analyst',
  'DevOps Engineer', 'Quality Assurance', 'Technical Writer', 'Graphic Designer',
  'Account Manager', 'HR Specialist', 'Financial Analyst', 'Operations Manager',
  'Customer Success', 'Content Strategist', 'Systems Administrator', 'Research Scientist'
]

const LOREM_WORDS: string[] = [
  'lorem', 'ipsum', 'dolor', 'sit', 'amet', 'consectetur', 'adipiscing', 'elit',
  'sed', 'do', 'eiusmod', 'tempor', 'incididunt', 'ut', 'labore', 'et', 'dolore',
  'magna', 'aliqua', 'enim', 'ad', 'minim', 'veniam', 'quis', 'nostrud',
  'exercitation', 'ullamco', 'laboris', 'nisi', 'aliquip', 'ex', 'ea', 'commodo'
]

// Helper functions
function getRandomElement<T>(array: T[]): T {
  return array[Math.floor(Math.random() * array.length)]
}

function getRandomNumber(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min
}

function generateRandomString(length: number, charset: string): string {
  let result = ''
  for (let i = 0; i < length; i++) {
    result += charset.charAt(Math.floor(Math.random() * charset.length))
  }
  return result
}

// Generator functions
function generateFirstName(): string {
  return getRandomElement(FIRST_NAMES)
}

function generateLastName(): string {
  return getRandomElement(LAST_NAMES)
}

function generateFullName(): string {
  return `${generateFirstName()} ${generateLastName()}`
}

function generateEmail(): string {
  const firstName = generateFirstName().toLowerCase()
  const lastName = generateLastName().toLowerCase()
  const domain = getRandomElement(DOMAINS)
  const separator = getRandomElement(['.', '_', ''])
  const number = Math.random() > 0.5 ? getRandomNumber(1, 999).toString() : ''

  return `${firstName}${separator}${lastName}${number}@${domain}`
}

function generatePhone(): string {
  const areaCode = getRandomNumber(200, 999)
  const prefix = getRandomNumber(200, 999)
  const lineNumber = getRandomNumber(1000, 9999)

  return `(${areaCode}) ${prefix}-${lineNumber}`
}

function generateAddress(): string {
  const number = getRandomNumber(1, 9999)
  const streetName = getRandomElement(STREET_NAMES)
  const streetType = getRandomElement(STREET_TYPES)

  return `${number} ${streetName} ${streetType}`
}

function generateCity(): string {
  return getRandomElement(CITIES)
}

function generateCountry(): string {
  return getRandomElement(COUNTRIES)
}

function generateZipCode(): string {
  return getRandomNumber(10000, 99999).toString()
}

function generateCompany(): string {
  return getRandomElement(COMPANIES)
}

function generateJobTitle(): string {
  return getRandomElement(JOB_TITLES)
}

function generateUsername(): string {
  const firstName = generateFirstName().toLowerCase()
  const number = getRandomNumber(1, 9999)
  const suffix = getRandomElement(['', '_dev', '_pro', '_x', ''])

  return `${firstName}${number}${suffix}`
}

function generatePassword(): string {
  const lowercase = 'abcdefghijklmnopqrstuvwxyz'
  const uppercase = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'
  const numbers = '0123456789'
  const symbols = '!@#$%^&*'

  const length = getRandomNumber(12, 16)
  let password = ''

  // Ensure at least one of each type
  password += getRandomElement(uppercase.split(''))
  password += getRandomElement(lowercase.split(''))
  password += getRandomElement(numbers.split(''))
  password += getRandomElement(symbols.split(''))

  // Fill the rest
  const allChars = lowercase + uppercase + numbers + symbols
  password += generateRandomString(length - 4, allChars)

  // Shuffle the password
  return password
    .split('')
    .sort((): number => Math.random() - 0.5)
    .join('')
}

function generateCreditCard(): string {
  // Generate a fake credit card number (not valid for transactions)
  const prefixes = ['4', '5', '37', '6011']
  const prefix = getRandomElement(prefixes)
  const length = prefix === '37' ? 15 : 16

  let cardNumber = prefix
  while (cardNumber.length < length - 1) {
    cardNumber += getRandomNumber(0, 9).toString()
  }

  // Add check digit (Luhn algorithm)
  let sum = 0
  let isEven = false
  for (let i = cardNumber.length - 1; i >= 0; i--) {
    let digit = parseInt(cardNumber[i], 10)
    if (isEven) {
      digit *= 2
      if (digit > 9) digit -= 9
    }
    sum += digit
    isEven = !isEven
  }
  const checkDigit = (10 - (sum % 10)) % 10
  cardNumber += checkDigit.toString()

  // Format with spaces
  if (prefix === '37') {
    return `${cardNumber.slice(0, 4)} ${cardNumber.slice(4, 10)} ${cardNumber.slice(10)}`
  }
  return cardNumber.replace(/(.{4})/g, '$1 ').trim()
}

function generateDate(): string {
  const year = getRandomNumber(1970, 2005)
  const month = getRandomNumber(1, 12).toString().padStart(2, '0')
  const day = getRandomNumber(1, 28).toString().padStart(2, '0')

  return `${year}-${month}-${day}`
}

function generateUUID(): string {
  const hex = '0123456789abcdef'
  const segments = [8, 4, 4, 4, 12]

  return segments
    .map((length): string => generateRandomString(length, hex))
    .join('-')
}

function generateLorem(): string {
  const sentenceCount = getRandomNumber(2, 5)
  const sentences: string[] = []

  for (let i = 0; i < sentenceCount; i++) {
    const wordCount = getRandomNumber(5, 15)
    const words: string[] = []

    for (let j = 0; j < wordCount; j++) {
      words.push(getRandomElement(LOREM_WORDS))
    }

    // Capitalize first word and add period
    words[0] = words[0].charAt(0).toUpperCase() + words[0].slice(1)
    sentences.push(words.join(' ') + '.')
  }

  return sentences.join(' ')
}

// Main generator function
export function generateFakeData(type: FakeDataType): GeneratedData {
  const generators: Record<FakeDataType, () => GeneratedData> = {
    fullName: generateFullName,
    firstName: generateFirstName,
    lastName: generateLastName,
    email: generateEmail,
    phone: generatePhone,
    address: generateAddress,
    city: generateCity,
    country: generateCountry,
    zipCode: generateZipCode,
    company: generateCompany,
    jobTitle: generateJobTitle,
    username: generateUsername,
    password: generatePassword,
    creditCard: generateCreditCard,
    date: generateDate,
    uuid: generateUUID,
    lorem: generateLorem,
  }

  const generator = generators[type]
  if (!generator) {
    throw new Error(`Unknown data type: ${type}`)
  }

  return generator()
}

// Generate complete form data
export function generateFormData(): Record<string, string> {
  return {
    firstName: generateFirstName(),
    lastName: generateLastName(),
    fullName: generateFullName(),
    email: generateEmail(),
    phone: generatePhone(),
    address: generateAddress(),
    city: generateCity(),
    country: generateCountry(),
    zipCode: generateZipCode(),
    company: generateCompany(),
    username: generateUsername(),
    password: generatePassword(),
  }
}

