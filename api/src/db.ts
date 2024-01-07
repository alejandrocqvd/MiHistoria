/**
 * MySQL Database Connection Pool
 *
 * This file configures and exports a MySQL database connection pool for the application. 
 * It uses mysql2 to create a connection pool and provides a utility function 
 * to obtain a connection from the pool.
 * 
 * Note: Ensure that the MySQL server is running and accessible with the provided credentials.
 * 
 * Author: Alejandro Cardona
 * Date: 2024-01-06
 */

import mysql, { PoolConnection } from "mysql2";

// MySQL Connection
const pool = mysql.createPool({
    connectionLimit: 10,
    host: "localhost",
    user: "root",
    password: "DDegasi[545]?",
    database: "mi_historia"
});

/**
 * A custom type representing a callback function. 
 * 
 * This function is called when a database connection is obtained or if an error occurs.
 * @param {Error} error - object if an error occurs, otherwise null.
 * @param {PoolConnection} connection - Object if the connection is successful, otherwise null.
 */
type Callback = (error: Error | null, connection: PoolConnection | null) => void;

export const getConnection = (callback: Callback) => {
    pool.getConnection((error, connection) => {
        if (error) return callback(error, null)
        callback(null, connection)
    });
}

export const db = pool;
