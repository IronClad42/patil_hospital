const mysql = require("mysql");
const util = require("util");

const conn = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "",
    database: "patil_hospital"
});

// कनेक्शन तपासण्यासाठी एरर हँडलिंग
// conn.connect((err) => {
//     if (err) {
//         console.error("MySQL कनेक्शन फेल!", err);
//         return;
//     }
//     console.log("MySQL कनेक्टेड!");
// });

// Promisified query function
const exe = util.promisify(conn.query).bind(conn);

module.exports = exe;
