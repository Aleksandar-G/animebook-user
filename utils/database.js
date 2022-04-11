const { Sequelize } = require('sequelize');

const databaseUrl = process.env.DATABASE_URL
const databaseUser = process.env.DATABASE_USER
const databasePassword = process.env.DATABASE_PASSWORD
const databasePort = process.env.DATABASE_PORT
//Connect to databse
const database = new Sequelize('userdb', databaseUser, databasePassword, {
    host: databaseUrl,
    port: databasePort,
    dialect: 'postgres'
});
database.authenticate().then(() => {
    console.log("connected to db");
}).catch((err) => { console.error(err); })

module.exports = database