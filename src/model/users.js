const { connectMysql } = require("../database/connectMysql");
const { DataTypes ,fn } = require("sequelize");

const User = connectMysql.define(
  "User",
  {
    name    : { type:DataTypes.STRING(100), allowNull: false },
    password: { type:DataTypes.STRING(100), allowNull: false },
    email   : { type:DataTypes.STRING(100), allowNull: false },
    role    : { type:DataTypes.ENUM("admin", "cunsumer"), defaultValue: "cunsumre" },
    passwordUpdate:{ type:DataTypes.DATE , defaultValue: fn('NOW'), onUpdate: fn('NOW')},
  
  },
  { timestamps: false }
);

module.exports = User;
