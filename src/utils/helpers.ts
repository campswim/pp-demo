const splitCamelCase = (string: string): string => {
  const match = string.match(/^[a-z]+|[A-Z][a-z]*/g)
  const formatted = match ? match.map(value => value[0].toUpperCase() + value.slice(1)) : null
  return formatted ? formatted.join(' ') : string
}

export const formatHeaders = (headers: string[]) => {
  const formattedHeaders = headers.map(header => {
    if (header === 'id') return 'ID'
    return splitCamelCase(header)
  })

  return formattedHeaders
}
