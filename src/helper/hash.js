const bcrypt = require('bcrypt');

exports.hashPassword = ( planePassword ) => bcrypt.hashSync( planePassword , Number(process.env.SALT) || 8 )
exports.isValidHash = ( planePassword  , password ) => bcrypt.compareSync(  planePassword , password)

