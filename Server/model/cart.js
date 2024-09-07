// Alden Chia Yu Xiang
// 2205584
// DISM/FT/2A/01

var db = require("./databaseConfig.js");
var jwt = require("jsonwebtoken");
var config = require("../config.js");

var cart = {
  addToCart: (userid, title, platformname, callback) => {
    var dbconn = db.getConnection();
    dbconn.connect(function (err) {
      if (err) {
        console.log(err);
        return callback(err, null);
      } else {
        var sql =
          "SELECT g.gameid, p.platformid FROM games AS g, platform AS p, gamesByPlatform AS gp WHERE g.title = ? AND p.platformname = ? AND gp.gameid = g.gameid AND p.platformid = gp.platformid;";
        dbconn.query(sql, [title, platformname], (err, result) => {
          if (err) {
            console.log(err);
            return callback(err, null);
          }

          if (result.length == 0) {
            return callback('nosuchgame', null)
          }

          var sql =
            "INSERT INTO cart (userid, gameid, platformid) VALUES (?, ?, ?);";
          dbconn.query(
            sql,
            [userid, result[0].gameid, result[0].platformid],
            (err, result) => {
              dbconn.end();
              if (err) {
                console.log(err);
                return callback(err, null);
              }

              return callback(null, result);
            }
          );
        });
      }
    });
  },

  deleteFromCart: (userid, title, platformname, callback) => {
    var dbconn = db.getConnection();
    dbconn.connect(function (err) {
      if (err) {
        console.log(err);
        return callback(err, null);
      } else {
        var sql =
          "SELECT gameid, platformid FROM games AS g, platform AS p WHERE g.title = ? AND p.platformname = ?;";
        dbconn.query(sql, [title, platformname], (err, result) => {
          if (err) {
            console.log(err);
            return callback(err, null);
          }

          if (result.length == 0) {
            return callback('nosuchgame', null)
          }

          var sql =
            "DELETE FROM cart WHERE userid = ? AND gameid = ? AND platformid = ?;";
          dbconn.query(
            sql,
            [userid, result[0].gameid, result[0].platformid],
            (err, result) => {
              dbconn.end();
              if (err) {
                console.log(err);
                return callback(err, null);
              }

              return callback(null, result);
            }
          );
        });
      }
    });
  },

  checkCart: (userid, title, platformname, callback) => {
    var dbconn = db.getConnection();
    dbconn.connect(function (err) {
      if (err) {
        console.log(err);
        return callback(err, null);
      } else {
        var sql = "SELECT gameid FROM games AS g WHERE g.title = ?;";
        dbconn.query(sql, [title, platformname], (err, result1) => {
          if (err) {
            console.log(err);
            return callback(err, null);
          }
          if (result1.length == 0) {
            return callback('nosuchgame', null)
          }

          var sql = "SELECT platformid FROM platform WHERE platformname = ?;";
          dbconn.query(sql, [platformname], (err, result2) => {
            if (err) {
              console.log(err);
              return callback(err, null);
            }

            if (result2.length == 0) {
              return callback('nosuchplatform', null)
            }

            var sql =
              "SELECT * FROM cart WHERE userid = ? AND gameid = ? AND platformid = ?;";
            dbconn.query(
              sql,
              [userid, result1[0].gameid, result2[0].platformid],
              (err, check) => {
                dbconn.end();
                if (err) {
                  console.log(err);
                  return callback(err, null);
                }
                
                if (check.length != 0) {
                  return callback(null, check);
                } else {
                  return callback(null, check);
                }
              }
            );
          });
        });
      }
    });
  },

  viewCart: (userid, callback) => {
    var dbconn = db.getConnection();
    dbconn.connect(function (err) {
      if (err) {
        console.log(err);
        return callback(err, null);
      } else {
        var sql =
          "SELECT g.title, p.platformname, gp.price, c.created_at FROM cart AS c, games AS g, platform AS p, gamesByPlatform AS gp WHERE c.userid = ? AND c.platformid = p.platformid AND c.gameid = g.gameid AND c.platformid = gp.platformid AND g.gameid = gp.gameid;";
        dbconn.query(sql, [userid], (err, result) => {
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

module.exports = cart;
