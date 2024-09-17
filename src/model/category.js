const { DataTypes } = require('sequelize');
const {connectMysql} = require('../database/connectMysql');
const { logger } = require('../helper/logger');
const ApiError = require('../../utils/apiError');

const Category = connectMysql.define('Categorie', {
    id: { type: DataTypes.INTEGER, allowNull: false, primaryKey: true,unique: true, autoIncrement: true },
    name: { type: DataTypes.STRING(255), allowNull: false },
    slug: { type: DataTypes.STRING(255) },
    
}, { timestamps: true });

(async () => {
    try {
        await connectMysql.sync(); // This will create the table in your MySQL database
        logger.info('Table created in MySQL database categories ');
    } catch (error) {
        logger.error('Unable to connect to the database:' , error)
        throw new Error ( new ApiError('Unable to connect to the database:' , 400 ));
    }
})();


module.exports = Category;
