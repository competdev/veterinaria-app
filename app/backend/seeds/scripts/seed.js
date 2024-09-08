const createConnection = require('typeorm').createConnection;
const dotenv = require('dotenv');
const UserSeed = require('./user.seed');
const IndicatorTypeSeed = require('./indicatorType.seed');
const IndicatorSeed = require('./indicator.seed');

dotenv.config();

createConnection({
    type: 'mariadb',
    host: process.env.DB_HOST,
    port: Number(process.env.DB_PORT),
    username: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    logging: JSON.parse(process.env.DB_LOG),
}).then(async connection => {
    await new IndicatorTypeSeed(connection).execSeeds();
    await new IndicatorSeed(connection).execSeeds();
    await new UserSeed(connection).execSeeds(); 
    process.exit(0);
}).catch(err => {
    console.log(err)
    process.exit(1);
})