import mysql, { PoolConnection } from "mysql2";

const pool = mysql.createPool({
    connectionLimit: 10,
    host: "localhost",
    user: "root",
    password: "DDegasi[545]?",
    database: "mi_historia"
});

type Callback = (error: Error | null, connection: PoolConnection | null) => void;

export const getConnection = (callback: Callback) => {
    pool.getConnection((error, connection) => {
        if (error) return callback(error, null)
        callback(null, connection)
    });
}

export const db = pool;
