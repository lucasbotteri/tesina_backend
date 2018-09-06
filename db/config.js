const path = require('path')
const config = require(path.resolve('config', 'default'))
module.exports = () => {
	return {
	    username: config.DB_USERNAME,
	    password: config.DB_PASSWORD,
	    database: config.DB_NAME,
	    host: config.DB_HOST,
	    dialect: config.DB_DIALECT
  }
}
