import fs from 'fs'
import path from 'path'

const schemaPath = path.join(process.cwd(), 'prisma', 'schema.prisma')

const getSchemaContent = (): string => {
  if (!fs.existsSync(schemaPath)) throw new Error('schema.prisma not found.')
  return fs.readFileSync(schemaPath, 'utf-8')
}

export const getPrismaSchemaFields = (schemaName: string, exclusions: string[] = []): string[] => {
  const contents = getSchemaContent()

  const schemaRegex = new RegExp(`model\\s+${schemaName}\\s+{([\\s\\S]*?)}`, 'm')
  const match = contents.match(schemaRegex)

  if (!match) throw new Error(`Schema "${schemaName}" not found in schema.prisma`)

  const body = match[1]
  const lines = body
    .split('\n')
    .map(line => line.trim())
    .filter(line =>
      line &&
      !line.startsWith('//') &&
      !line.startsWith('@') &&
      !line.startsWith('@@')
    )

  const fieldNames = lines.map(line => line.split(/\s+/)[0])

  return fieldNames.filter(field => !exclusions.includes(field))
}