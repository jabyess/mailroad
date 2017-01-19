'use strict';

import fs from 'fs';
import path from 'path';
import Sequelize from 'sequelize';

let basename = path.basename(module.filename);
let env = process.env.NODE_ENV || 'development';
let db = {};
let sequelize = new Sequelize(process.env.PGDATABASE, process.env.PGUSER, process.env.PGPASSWORD, {
		host: 'localhost',
		dialect: 'postgres',
		pool: {
			max: 10,
			min: 0,
			idle: 10000
		}
	});



//reads each model.js file and imports them to sequelize namespace
//accessible throughout application as db.modelName 

fs.readdirSync(__dirname)
	.filter((file) => {
		return (file.indexOf('.') !== 0) && (file !== basename) && (file.slice(-3) === '.js');
	})
	.forEach((file) => {
		let model = sequelize['import'](path.join(__dirname, file));
		db[model.name] = model;
	});

Object.keys(db).forEach((modelName) => {
	if (db[modelName].associate) {
		db[modelName].associate(db);
	}
});

db.sequelize = sequelize;
db.Sequelize = Sequelize;

export default db; 
