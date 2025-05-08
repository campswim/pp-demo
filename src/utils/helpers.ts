// Helper of the format-headers function.
const splitCamelCase = (string: string): string => {
  const match = string.match(/^[a-z]+|[A-Z][a-z]*/g)
  const formatted = match ? match.map(value => value[0].toUpperCase() + value.slice(1)) : null
  return formatted ? formatted.join(' ') : string
}

// Format table headers.
export const formatHeaders = (headers: string[]) => {
  const formattedHeaders = headers.map(header => {
    if (header === 'id') return 'ID'
    return splitCamelCase(header)
  })

  return formattedHeaders
}

// Determine input fields' placeholder text.
export const getPlaceholders = (caller: string) => ({
  username: 'Username',
  phone: caller === 'demo' ? 'Enter a real phone number' : 'Phone',
  password: caller === 'demo' ? 'Enter anything as a password.' : 'Password',
})

// Format phone numbers to adhere to the E.164 standard, e.g., +14155552671.
export function formatToE164(raw: string): string {
  const cleaned = raw.replace(/\D+/g, '') // Remove all non-digits.

  // If number starts with country code (assumed to be entered), return with plus.
  if (raw.trim().startsWith('+')) {
    return `+${cleaned}`
  }

  // Default to US country code if none provided
  return `+1${cleaned}`
}