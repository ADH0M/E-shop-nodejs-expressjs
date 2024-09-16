require('dotenv').config();
const {Sequelize}  = require('sequelize');
exports.connectMysql = new Sequelize ( process.env.DATABASE ,'root' ,process.env.PASSWORD ,
    {
        host    :  process.env.HOST ,
        dialect : process.env.DIALECT   
    } )


