const dotenv = require('dotenv');
dotenv.config();

module.exports = {
    type: 'mariadb',
    host: process.env.DB_HOST,
    port: Number(process.env.DB_PORT),
    username: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    logging: JSON.parse(process.env.DB_LOG),
    entities: [
        "src/**/*entity.ts"
    ],
    migrations: ["migrations/files/*.ts"],
    cli: {
        migrationsDir: 'migrations/files'
    }
}
