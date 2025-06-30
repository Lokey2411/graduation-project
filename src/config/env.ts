import dotenv from 'dotenv'

const envFile = process.env.NODE_ENV === 'production' ? '.env.production' : '.env.development'
dotenv.config({ path: envFile })

export const MYSQL_HOST = process.env.MYSQL_HOST || 'localhost'
export const MYSQL_PORT = +process.env.MYSQL_PORT || 3306
export const MYSQL_USER = process.env.MYSQL_USER || 'root'
export const MYSQL_PASSWORD = process.env.MYSQL_PASSWORD || ''
export const MYSQL_DATABASE = process.env.MYSQL_DATABASE || 'test'
export const CLOUDINARY_NAME = process.env.CLOUDINARY_NAME || ''
export const CLOUDINARY_API_KEY = process.env.CLOUDINARY_API_KEY || ''
export const CLOUDINARY_API_SECRET = process.env.CLOUDINARY_API_SECRET || ''
export const JWT_SECRET = process.env.JWT_SECRET || ''
export const CHATBOT_API_URL = process.env.CHATBOT_API_URL || ''
