import mysql from 'mysql2/promise'
import { MYSQL_DATABASE, MYSQL_HOST, MYSQL_PORT, MYSQL_USER } from './env'

const connection = mysql.createConnection({
	host: MYSQL_HOST,
	port: Number(MYSQL_PORT),
	user: MYSQL_USER,
	database: MYSQL_DATABASE,
	waitForConnections: true,
	connectionLimit: 10,
	queueLimit: 0,
})

export default connection
export type Connection = mysql.Connection
