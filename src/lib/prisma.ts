// Prisma Client Instance for ApplyMint AI
// This file provides a singleton Prisma Client instance
// Following best practices for Next.js and serverless environments

import { PrismaClient } from '@prisma/client'

// PrismaClient is attached to the `global` object in development to prevent
// exhausting your database connection limit.
// Learn more: https://pris.ly/d/help/next-js-best-practices

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
  })

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma

// Connection helper functions
export const connectPrisma = async () => {
  try {
    await prisma.$connect()
    console.log('Prisma Client connected successfully')
  } catch (error) {
    console.error('Failed to connect to database:', error)
    throw error
  }
}

export const disconnectPrisma = async () => {
  await prisma.$disconnect()
  console.log('Prisma Client disconnected')
}

// Health check function
export const checkPrismaConnection = async (): Promise<boolean> => {
  try {
    await prisma.$queryRaw`SELECT 1`
    return true
  } catch (error) {
    console.error('Prisma connection check failed:', error)
    return false
  }
}

// Export types from Prisma Client
export * from '@prisma/client'
