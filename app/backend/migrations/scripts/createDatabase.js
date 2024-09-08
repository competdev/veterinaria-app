const createConnection = require('typeorm').createConnection;
const dotenv = require('dotenv');
dotenv.config();

createConnection({
    type: 'mariadb',
    host: process.env.DB_HOST,
    port: Number(process.env.DB_PORT),
    username: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    logging: JSON.parse(process.env.DB_LOG),
}).then(async connection => {
    await connection.query(`
        CREATE DATABASE IF NOT EXISTS ${process.env.DB_NAME};
    `)
    process.exit(0);
}).catch(err => {
    console.log(err)
    process.exit(1);
})