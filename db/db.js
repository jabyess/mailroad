import pg from 'pg';
import process from 'process';
import sequelize from 'sequelize';

let seq = new Sequelize(process.env.PGDATABASE, process.env.PGUSER, process.env.PGPASSWORD, {
	host: 'localhost',
	pool: {
		max: 10,
		min: 0,
		idle: 10000
	}
})


// 	let dbConfig = {
// 		user: process.env.PGUSER, //env var: PGUSER
// 		database: process.env.PGDATABASE, //env var: PGDATABASE
// 		password: process.env.PGPASSWORD, //env var: PGPASSWORD
// 		host: 'localhost', // Server hosting the postgres database
// 		port: 5432, //env var: PGPORT
// 		max: 10, // max number of clients in the pool
// 		idleTimeoutMillis: 6000
// 	}

// export default db = () => {

// 	let client = new pg.Client();
// 	let pool = new pg.Pool(dbConfig);

// 	pool.connect((err, client, done) => {
// 		if(err) { return console.error('error fetching client from pool', err) }
// 		client.query('select * from ')



// 	});

// }