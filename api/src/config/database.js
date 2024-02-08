const mysql = require('mysql');
const dotenv = require('dotenv').config();

const pool = mysql.createPool({
   connectionLimit: 20,
   host: process.env.DB_HOST,
   user: process.env.DB_USER,
   password: process.env.DB_PASSWORD,
   database: "kagencia_dibuja_y_colorea",
})

exports.query_database = async (sentencia, params) => {

   return await new Promise((resolve, reject) => {

      pool.getConnection((err, connection) => {
         if (err) reject(err);

         connection.query(sentencia, params, (err, row, fields) => {
            if (err) reject(err);

            resolve(row);

            connection.release();
         })
      })
   })

}