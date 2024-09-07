// Alden Chia Yu Xiang
// 2205584
// DISM/FT/2A/01

var db = require("./databaseConfig.js");
var jwt = require("jsonwebtoken");
var config = require("../config.js");

var games = {
  allGames: (callback) => {
    var dbconn = db.getConnection();
    dbconn.connect(function (err) {
      if (err) {
        console.log(err);
        return callback(err, null);
      } else {
        var sql =
          "SELECT g.gameid, g.title, g.description, g.year, gp.price, p.platformname, COALESCE(gi.filepath, './images/sp_games') AS filepath FROM games AS g JOIN gamesbycategory AS gc ON g.gameid = gc.gameid JOIN gamesbyplatform AS gp ON g.gameid = gp.gameid JOIN platform AS p ON gp.platformid = p.platformid LEFT JOIN gamesimage AS gi ON g.gameid = gi.gameid GROUP BY g.gameid, p.platformname ORDER BY g.title;";
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

  searchGames: (title, platformname, callback) => {
    var dbconn = db.getConnection();
    dbconn.connect(function (err) {
      if (err) {
        console.log(err);
        return callback(err, null);
      } else {
        var sql =
          "SELECT g.gameid, g.title, g.description, g.year, gp.price, p.platformname, COALESCE(gi.filepath, './images/sp_games') AS filepath FROM games AS g JOIN gamesbycategory AS gc ON g.gameid = gc.gameid JOIN gamesbyplatform AS gp ON g.gameid = gp.gameid JOIN platform AS p ON gp.platformid = p.platformid LEFT JOIN gamesimage AS gi ON g.gameid = gi.gameid WHERE g.title LIKE CONCAT('%', ?, '%') AND p.platformname IN (?) GROUP BY g.gameid, p.platformname ORDER BY g.title;";
        dbconn.query(sql, [title, platformname], (err, result) => {
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

  getGames: (gameid, platformname, callback) => {
    var dbconn = db.getConnection();
    dbconn.connect(function (err) {
      if (err) {
        console.log(err);
        return callback(err, null);
      } else {
        var sql =
          "SELECT g.gameid, g.title, g.description, g.year, GROUP_CONCAT(c.categoryname SEPARATOR ', ') AS categories, p.platformname, gp.price, COALESCE(gi.filepath, '/images/sp_games') AS image_filepath FROM games AS g JOIN gamesByCategory AS gc ON g.gameid = gc.gameid JOIN category AS c ON gc.categoryid = c.categoryid JOIN gamesByPlatform AS gp ON g.gameid = gp.gameid JOIN platform AS p ON gp.platformid = p.platformid LEFT JOIN gamesImage AS gi ON g.gameid = gi.gameid WHERE g.gameid = ? AND p.platformname = ?;";
        dbconn.query(sql, [gameid, platformname], (err, result) => {
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

  addGame: (
    title,
    description,
    year,
    platformid,
    price,
    categoryid,
    points,
    callback
  ) => {
    var dbconn = db.getConnection();
    dbconn.connect(function (err) {
      if (err) {
        console.log(err);
        return callback(err, null);
      } else {
        var sql =
          "INSERT INTO games (title, description, year) VALUES (?, ?, ?);";
        dbconn.query(sql, [title, description, year], (err, result) => {
          if (err) {
            console.log(err);
            return callback(err, null);
          }

          var gameid = result.insertId;
          var insertPlatform = [];
          for (let i = 0; i < platformid.length; i++) {
            var p = price[i];
            var pid = platformid[i];
            var pt = points[i];
            insertPlatform.push([gameid, pid, p, pt]);
          }

          var sql =
            "INSERT INTO gamesbyplatform (gameid, platformid, price, points) VALUES ?;";
          dbconn.query(sql, [insertPlatform], (err, result) => {
            if (err) {
              console.log(err);
              return callback(err, null);
            }

            var insertCategory = [];
            for (let i = 0; i < categoryid.length; i++) {
              var catid = categoryid[i];
              insertCategory.push([gameid, catid]);
            }

            var sql =
              "INSERT INTO gamesbycategory (gameid, categoryid) VALUES ?;";
            dbconn.query(sql, [insertCategory], (err, result) => {
              if (err) {
                console.log(err);
                return callback(err, null);
              }

              return callback(null, result);
            });
          });
        });
      }
    });
  },

  addImage: (title, fullPath, callback) => {
    var dbconn = db.getConnection();
    dbconn.connect(function (err) {
      if (err) {
        console.log(err);
        return callback(err, null);
      } else {
        var sql = "SELECT gameid, title FROM games WHERE title = ?;";
        dbconn.query(sql, [title], (err, result1) => {
          if (err) {
            console.log(err);
            return callback(err, null);
          }

          if (result1.length == 0) {
            return callback('nosuchgame', null)
          }

          var sql = "INSERT INTO gamesImage (gameid, filepath) VALUE (?, ?);";
          dbconn.query(sql, [result1[0].gameid, fullPath], (err, result) => {
            dbconn.end();
            if (err) {
              console.log(err);
              return callback(err, null);
            }

            return callback(null, result1);
          });
        });
      }
    });
  },

  userGames: (userid, title, platformname, callback) => {
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
            return callback('doesnotowngame', result)
          }

          var sql =
            "SELECT * FROM usergames WHERE userid = ? AND gameid = ? AND platformid = ?;";
          dbconn.query(
            sql,
            [userid, result[0].gameid, result[0].platformid],
            (err, result) => {
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

  displayingUserGames: (userid, callback) => {
    var dbconn = db.getConnection();
    dbconn.connect(function (err) {
      if (err) {
        console.log(err);
        return callback(err, null);
      } else {
        var sql =
          "SELECT g.title, p.platformname, GROUP_CONCAT(c.categoryname SEPARATOR ', ') AS categoryname FROM games AS g, platform AS p, category AS c, gamesByCategory AS gc, usergames AS ug WHERE ug.userid = ?  AND ug.gameid = g.gameid  AND ug.platformid = p.platformid  AND gc.gameid = g.gameid  AND gc.categoryid = c.categoryid GROUP BY g.title, p.platformname;";
        dbconn.query(sql, [userid], (err, result) => {
          if (err) {
            console.log(err);
            return callback(err, null);
          }

          return callback(null, result);
        });
      }
    });
  },

  buyGames: (userid, title, platformname, callback) => {
    var dbconn = db.getConnection();
    dbconn.connect(function (err) {
      if (err) {
        console.log(err);
        return callback(err, null);
      } else {
        var gametitles = title.split(", ");
        var platformnames = platformname.split(", ");
        console.log(platformnames)
        var sql =
          "SELECT g.gameid, p.platformid FROM games AS g, platform AS p WHERE g.title IN (?) AND p.platformname IN (?);";
        dbconn.query(sql, [gametitles, platformnames], (err, result) => {
          if (err) {
            console.log(err);
            return callback(err, null);
          }
          console.log(result)
          if (result.length != gametitles.length) {
            return callback('nosuchgame', null)
          }

          var gameIds = result.map((row) => row.gameid);
          var platformIds = result.map((row) => row.platformid);

          var values = [];
          for (let i = 0; i < gameIds.length; i++) {
            values.push([userid, gameIds[i], platformIds[i]]);
          }

          var sql =
            "INSERT INTO usergames (userid, gameid, platformid) VALUES ?;";
          dbconn.query(sql, [values], (err, result) => {
            if (err) {
              console.log(err);
              return callback(err, null);
            }

            var sql = "DELETE FROM cart WHERE userid = ?;";
            dbconn.query(sql, [userid], (err, result) => {
              dbconn.end();
              if (err) {
                console.log(err);
                return callback(err);
              }

              return callback(null, result);
            });
          });
        });
      }
    });
  },
};

module.exports = games;
