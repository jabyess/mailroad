"use strict";

export default (sequelize, DataTypes) => {
	let Email = sequelize.define('email', {
		content: {
			type: DataTypes.JSON,
			field: "content"
		},
		title: {
			type: DataTypes.STRING,
			field: "title"
		},
		template: {
			type: DataTypes.STRING,
			field: "template"
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