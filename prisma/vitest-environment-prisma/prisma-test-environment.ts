import 'dotenv/config'

import { randomUUID } from 'node:crypto'
import { execSync } from 'node:child_process'
import { Environment } from 'vitest'

import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

function generateDatabaseURL(schema: string) {
  const {
    DATABASE_HOST,
    DATABASE_USER,
    DATABASE_PASS,
    DATABASE_PORT,
    DATABASE_NAME,
  } = process.env

  const url = new URL(
    `postgresql://${DATABASE_USER}:${DATABASE_PASS}@${DATABASE_HOST}:${DATABASE_PORT}/${DATABASE_NAME}`,
  )

  url.searchParams.set('schema', schema)

  return url.toString()
}

export default <Environment>{
  name: 'prisma',
  async setup() {
    const schema = randomUUID()
    const databaseURL = generateDatabaseURL(schema)
    process.env.DATABASE_URL = databaseURL
    try {
      execSync('npx prisma migrate deploy')
    } catch {
      console.warn('⚠️ O comando npx prisma migrate será executado novamente.')
      execSync('npx prisma migrate deploy')
    }

    return {
      async teardown() {
        await prisma.$executeRawUnsafe(
          `DROP SCHEMA IF EXISTS "${schema}" CASCADE`,
        )

        await prisma.$disconnect()
      },
    }
  },
}
