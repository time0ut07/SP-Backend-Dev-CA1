// Alden Chia Yu Xiang
// 2205584
// DISM/FT/2A/01

var db = require("./databaseConfig.js");
var jwt = require("jsonwebtoken");
var config = require("../config.js");

var review = {
  getReviews: (gameid, callback) => {
    var dbconn = db.getConnection();
    dbconn.connect(function (err) {
      if (err) {
        console.log(err);
        return callback(err, null);
      } else {
        var sql =
          "SELECT u.username, r.content, r.rating FROM review AS r, users AS u WHERE r.gameid = ? AND r.userid = u.userid;";
        dbconn.query(sql, [gameid], (err, result) => {
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

  addReview: (userid, gameid, content, rating, callback) => {
    var dbconn = db.getConnection();
    dbconn.connect(function (err) {
      if (err) {
        console.log(err);
        return callback(err, null);
      } else {
        var sql =
          "INSERT INTO review (userid, gameid, content, rating) VALUES (?, ?, ?, ?);";
        dbconn.query(sql, [userid, gameid, content, rating], (err, result) => {
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

module.exports = review;
