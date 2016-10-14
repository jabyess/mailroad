"use strict";

export default (sequelize, DataTypes) => {
	let Email = sequelize.define('email', {
		emailContent: {
			type: DataTypes.JSON,
			field: "email_content"
		},
		title: {
			type: DataTypes.STRING,
			field: "title"
		},
		id: {
			unique: true,
			type: DataTypes.INTEGER,
			primaryKey: true,
			autoIncrement: true
		}
	},
	{
		freezeTableName: true
	}
	);
	return Email;
};