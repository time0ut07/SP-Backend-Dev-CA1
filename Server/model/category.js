// Alden Chia Yu Xiang
// 2205584
// DISM/FT/2A/01

var db = require("./databaseConfig.js");
var jwt = require("jsonwebtoken");
var config = require("../config.js");

var category = {
  allPCategories: (callback) => {
    var dbconn = db.getConnection();
    dbconn.connect(function (err) {
      if (err) {
        console.log(err);
        return callback(err, null);
      } else {
        var sql = "SELECT * FROM category";
        dbconn.query(sql, (err, result) => {
          dbconn.end();
          if (err) {
            console.log(err);
            return callback(err, null);
          }

          return callback(null, result);
        });
      }
    });
  },
};

module.exports = category;
