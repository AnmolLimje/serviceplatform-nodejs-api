const mysql = require('mysql2/promise');
require('dotenv').config();

const dbHost = process.env.DB_HOST || 'localhost';
const [host, port] = dbHost.includes(':') ? dbHost.split(':') : [dbHost, process.env.DB_PORT || 3306];

const pool = mysql.createPool({
    host: host,
    port: parseInt(port),
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'service_booking',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
    enableKeepAlive: true,
    keepAliveInitialDelay: 0
});

module.exports = pool;
