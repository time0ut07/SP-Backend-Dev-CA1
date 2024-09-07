// Alden Chia Yu Xiang
// 2205584
// DISM/FT/2A/01

var mysql = require("mysql");

var dbConnect = {
  getConnection: function () {
    var conn = mysql.createConnection({
      host: "localhost",
      user: "root",
      password: "@cyx3690",
      database: "sp_games",
    });

    return conn;
  },
};
module.exports = dbConnect;
