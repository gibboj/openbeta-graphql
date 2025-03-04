import mongoose from 'mongoose'
import { createAreaModel } from './AreaSchema.js'
import { createClimbModel } from './ClimbSchema.js'

import { config } from 'dotenv'

config()

const checkVar = (name: string): string => {
  const value = process.env[name] ?? ''
  if (value === '') {
    console.log('Missing env ', name)
    process.exit(1)
  }
  return value
}

const defaultFn = console.log.bind(console, 'DB connected successfully')

export const connectDB = (onConnected: () => any = defaultFn): any => {
  const user = checkVar('MONGO_INITDB_ROOT_USERNAME')
  const pass = checkVar('MONGO_INITDB_ROOT_PASSWORD')
  const server = checkVar('MONGO_SERVICE')

  console.log(
    `Connecting to database 'mongodb://${user}:****@${server}'...`
  )
  try {
    /* eslint-disable @typescript-eslint/no-floating-promises */
    mongoose.connect(
    `mongodb://${user}:${pass}@${server}:27017/opentacos?authSource=admin`
    )

    mongoose.connection.on('open', onConnected)

    mongoose.connection.on(
      'error', (e) => {
        console.error('MongoDB connection error', e)
        process.exit(1)
      }
    )
  } catch (e) {
    console.error("Can't connect to db")
    process.exit(1)
  }
}

export const gracefulExit = (): any => {
  mongoose.connection.close(function () {
    console.log('Gracefully exiting.')
    process.exit(0)
  })
}

process.on('SIGINT', gracefulExit).on('SIGTERM', gracefulExit)

export { createAreaModel, createClimbModel }
