"use strict";

export default (sequelize, DataTypes) => {
	let Email = sequelize.define('email', {
		emailContent: {
			type: DataTypes.STRING,
			field: "email_content"
		},
		id: {
			unique: true,
			type: DataTypes.INTEGER,
			primaryKey: true
		}
	},
	{
		freezeTableName: true
	}
	);
	return Email;
};