// Alden Chia Yu Xiang
// 2205584
// DISM/FT/2A/01

var db = require("./databaseConfig.js");
var jwt = require("jsonwebtoken");
var config = require("../config.js");

var user = {
  loginUser: (username, password, callback) => {
    var dbconn = db.getConnection();
    dbconn.connect(function (err) {
      if (err) {
        console.log(err);
        return callback(err, null);
      } else {
        var sql =
          "SELECT userid, username, email, member_type FROM users WHERE username = ? AND password = ?;";
        dbconn.query(sql, [username, password], (err, result) => {
          dbconn.end();
          if (err) {
            console.log(err);
            return callback(err, null);
          }

          var token = "";

          if (result.length == 1) {
            token = jwt.sign(
              { id: result[0].userid, username: result[0].username, email: result[0].email, member_type: result[0].member_type },
              config.key,
              {
                expiresIn: 86400,
              }
            );
            console.log("@@token " + token);
            return callback(null, token, result);
          }

          return callback("Wrong credentials", null);
        });
      }
    });
  },

  userSignUp: (
    username,
    password,
    email,
    member_type,
    points,
    profile_picture_url,
    callback
  ) => {
    var dbconn = db.getConnection();
    dbconn.connect(function (err) {
      if (err) {
        console.log(err);
        return callback(err, null);
      } else {
        var sql =
          "INSERT INTO users (username, password, email, member_type, points, profile_picture_url) VALUES (?, ?, ?, ?, ?, ?);";
        dbconn.query(
          sql,
          [username, password, email, member_type, points, profile_picture_url],
          (err, result) => {
            if (err) {
              console.log(err);
              return callback(err, null);
            }

            var sql =
              "SELECT userid, username, email, member_type FROM users WHERE username = ? AND password = ?;";
            dbconn.query(sql, [username, password], (err, result) => {
              dbconn.end();
              if (err) {
                console.log(err);
                return callback(err, null);
              }

              return callback(null, result);
            });
          }
        );
      }
    });
  },

  updatePassword: (email, newPassword, oldPassword, callback) => {
    var dbconn = db.getConnection();
    dbconn.connect(function (err) {
      if (err) {
        console.log(err);
        return callback(err, null);
      } else {

        var sql = "SELECT * FROM users WHERE email = ? AND password = ?;";
        dbconn.query(sql, [email, oldPassword], (err, result) => {
          if (err) {
            console.log(err);
            return callback(err, null);
          }

          if (result.length != 0) {
            var sql = "UPDATE users SET password = ? WHERE email = ?;";
            dbconn.query(sql, [newPassword, email], (err, result) => {
              dbconn.end();
              if (err) {
                console.log(err);
                return callback(err, null);
              }

              return callback(null, result);
            });
          } else {
            return callback("No such user exist", null);
          }
        });
      }
    });
  },

  getUserName: (userid, callback) => {
    var dbconn = db.getConnection();
    dbconn.connect(function (err) {
      if (err) {
        console.log(err) 
        return callback(err, null)
      } else {
        var sql = "SELECT username FROM users WHERE userid = ?;";
        dbconn.query(sql, [userid], (err, result) => {
          dbconn.end()
          if (err) {
            console.log(err)
            return callback(err, null)
          }
          return callback(null, result)
        })
      }
    })
  }
};

module.exports = user;
