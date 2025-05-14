// Helper of the format-headers function.
const splitCamelCase = (string: string): string => {
  const match = string.match(/^[a-z]+|[A-Z][a-z]*/g)
  const formatted = match ? match.map(value => value[0].toUpperCase() + value.slice(1)) : null
  return formatted ? formatted.join(' ') : string
}

// Format table headers.
export const formatHeaders = (headers: string[], exclusions: string[] = []) => {
  // Exclude certain headers from formatting.
  const filteredHeaders = headers.filter(header => !exclusions.includes(header))
  const formattedHeaders = filteredHeaders.map(header => {
    if (header === 'id') return 'ID'
    return splitCamelCase(header)
  })
  return formattedHeaders
}

// Format a single header.
export const formatHeader = (header: string) => {
  if (header === 'id') return 'ID'
  return splitCamelCase(header)
}

// Determine input fields' placeholder text.
export const getPlaceholders = (caller: string) => ({
  username: 'Username',
  phone: caller === 'demo' ? 'Enter a real phone number.' : 'Phone',
  password: caller === 'demo' ? 'Enter anything as a password.' : 'Password',
})

// Format phone numbers to adhere to the E.164 standard, e.g., +14155552671.
export const formatToE164 =(raw: string): string => {
  const cleaned = raw.replace(/\D+/g, '') // Remove all non-digits.

  // If number starts with country code (assumed to be entered), return with plus.
  if (raw.trim().startsWith('+')) {
    return `+${cleaned}`
  }

  // Default to US country code if none provided
  return `+1${cleaned}`
}

// Format phone numbers to be readable.
export const formatPhoneDashed = (raw: string): string => {
  const digits = raw.replace(/\D/g, '') // strip non-numeric

  // Strip country code if present
  const local = digits.length === 11 && digits.startsWith('1')
    ? digits.slice(1)
    : digits

  if (local.length !== 10) return raw // fallback if not standard 10-digit

  return `${local.slice(0, 3)}-${local.slice(3, 6)}-${local.slice(6)}`
}

// Format the date to be more legible.
export const formatDate = (input: string | Date, timeZone: string = 'America/Los_Angeles'): string => {
  const date = new Date(input)
  if (isNaN(date.getTime())) return String(input)

  const options: Intl.DateTimeFormatOptions = {
    timeZone,
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false
  }

  const parts = new Intl.DateTimeFormat('en-US', options).formatToParts(date)

  const get = (type: string) => parts.find(p => p.type === type)?.value || ''
  const day = String(parseInt(get('day'), 10)) // strip leading zero.
  const month = get('month')
  const year = get('year')
  const hour = get('hour')
  const minute = get('minute')
  const second = get('second')

  return `${day} ${month} ${year} at ${hour}${minute}:${second}`
}