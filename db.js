const mysql = require("mysql");
const util = require("util");

const conn = mysql.createConnection({
    host: "bmwsvhdcmsjyfk47siun-mysql.services.clever-cloud.com",
    user: "u1bd6eelwssjv5n6",
    password: "vueps8bQBR9AcKm4Ke6B",
    database: "bmwsvhdcmsjyfk47siun"
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
