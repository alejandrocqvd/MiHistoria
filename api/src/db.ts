import { Pool, PoolClient, QueryResult } from 'pg';

// PostgreSQL Connection Pool
const pool = new Pool({
    host: process.env.SUPABASE_HOST,      // Supabase host
    user: process.env.SUPABASE_USER,      // Supabase user
    password: process.env.SUPABASE_PASSWORD, // Supabase password
    database: process.env.SUPABASE_DATABASE, // Database name
    port: Number(process.env.SUPABASE_PORT),   // Database port
    max: 10,  // Connection pool limit
});

/**
 * A custom type representing a callback function.
 *
 * This function is called when a database connection is obtained or if an error occurs.
 * @param {Error | null} error - object if an error occurs, otherwise null.
 * @param {PoolClient | null} client - Object if the connection is successful, otherwise null.
 */
type Callback = (error: Error | null, client: PoolClient | null) => void;

export const getConnection = (callback: Callback) => {
    pool.connect((error, client) => {
        if (error) return callback(error, null);

        // Ensure the client is not undefined before passing it to the callback
        callback(null, client ?? null);
    });
};

export const db = pool;
