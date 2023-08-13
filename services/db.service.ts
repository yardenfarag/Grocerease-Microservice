import { MongoClient, Db, Collection, Document } from 'mongodb'
import dotenv from 'dotenv'

dotenv.config()

const dbURL = process.env.MONGO_URL || 'mongodb://127.0.0.1:27017'
const dbName = process.env.DB_NAME

let dbConn: Db | null = null

export async function getCollection<T extends Document>(collectionName: string): Promise<Collection<T>> {
  try {
    const db = await connect();
    const collection = db.collection<T>(collectionName)
    return collection
  } catch (err) {
    console.error('Failed to get Mongo collection', err)
    throw err
  }
}

async function connect(): Promise<Db> {
  if (dbConn) {
    return dbConn
  }
  try {
    const client = new MongoClient(dbURL)
    await client.connect()
    const db = client.db(dbName)
    dbConn = db
    return db
  } catch (err) {
    console.error('Cannot connect to DB', err)
    throw err
  }
}
