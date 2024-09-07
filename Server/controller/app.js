// Alden Chia Yu Xiang
// 2205584
// DISM/FT/2A/01

var express = require("express");
var bodyParser = require("body-parser");
var fileupload = require("express-fileupload");
const user = require("../model/user.js");
const games = require("../model/games.js");
const review = require("../model/review.js");
const platform = require("../model/platform.js");
const category = require("../model/category.js");
const cart = require("../model/cart.js");
var verifyToken = require("../auth/verifyToken.js");
var verifyAdmin = require("../auth/verifyAdmin.js");
var cors = require("cors");
const path = require("path");
const { profile } = require("console");

var app = express();

var urlencodedParser = bodyParser.urlencoded({ extended: false });
app.use(bodyParser.json()); //parse appilcation/json data
app.use(urlencodedParser);
app.use(fileupload());

app.options("*", cors());
app.use(cors());
var urlencodedParser = bodyParser.urlencoded({ extended: false });

// ===================================================================
//                              API 1
// ===================================================================

app.post("/user/login", (req, res) => {
  var username = req.body.username;
  var password = req.body.password;

  if (username == "" || password == "") {
    res.status(400).send({ message: "Bad request" });
    return;
  }

  user.loginUser(username, password, (err, token, result) => {
    if (err == "Wrong credentials") {
      res.status(400).send({
        message: "Bad request",
      });
      return;
    }
    if (err) {
      console.log(err);
      res.status(500).send({
        message: "Internal Server Error",
      });
      return;
    }

    res.statusCode = 200;
    res.setHeader("Content-Type", "application/json");

    res.json({
      success: true,
      userData: JSON.stringify(result),
      token: token,
      status: "You are successfully logged in!",
    });
    res.send();
  });
});

// ===================================================================
//                              API 2
// ===================================================================

app.put("/user/signup", (req, res) => {
  var username = req.body.username;
  var password = req.body.password;
  var email = req.body.email;
  var member_type = req.body.member_type;
  var points = req.body.points;
  var profile_picture_url = req.body.profile_picture_url;

  if (
    username == "" ||
    password == "" ||
    email == "" ||
    member_type == "" ||
    points == "" ||
    profile_picture_url == ""
  ) {
    res.status(400).send({ message: "Bad request" });
    return;
  }

  user.userSignUp(
    username,
    password,
    email,
    member_type,
    points,
    profile_picture_url,
    (err, token, result) => {
      if (err) {
        // if email address already exist
        if (err.code == "ER_DUP_ENTRY") {
          res.status(422).send({ message: "Unprocessable Content" });
          return;
        }

        // if member type is not any of the correct one
        if (err.sqlMessage == "Check constraint 'users_chk_1' is violated.") {
          res.status(400).send({ message: "Bad request" });
          return;
        }

        console.log(err);
        res.status(500).send({
          message: "Internal Server Error",
        });
        return;
      }

      res.statusCode = 200;
      res.setHeader("Content-Type", "application/json");

      res.json({
        success: true,
        userData: JSON.stringify(result),
        token: token,
        status: "You are successfully logged in!",
      });
      res.send();
    }
  );
});

// ===================================================================
//                              API 3
// ===================================================================

app.put("/user/updatePass", (req, res) => {
  var newPassword = req.body.newPassword;
  var oldPassword = req.body.oldPassword;
  var email = req.body.email;

  if (newPassword == "" || oldPassword == "" || email == "") {
    res.status(400).send({ message: "Bad request" });
    return;
  }

  user.updatePassword(email, newPassword, oldPassword, (err, result) => {
    if (err == "No such user exist") {
      res.status(400).send({ message: "Bad request" });
      return;
    }

    if (err) {
      console.log(err);
      res.status(500).send({
        message: "Internal Server Error",
      });
      return;
    }

    res.status(200).send(result);
  });
});

// ===================================================================
//                              API 4
// ===================================================================

app.get("/get/username", verifyToken, (req, res) => {
  var userid = req.query.userid;
  console.log(userid)
  if (userid == "") {
    res.status(400).send({ message: "Bad request" });
    return;
  }

  user.getUserName(userid, (err, result) => {
    if (err) {
      console.log(err);
      res.status(500).send({
        message: "Internal Server Error",
      });
      return;
    }

    if (result.length == 0) {
      res.status(400).send({ message: "Bad request" });
      return;
    }

    res.status(200).send(result);
  });
});

// ===================================================================
//                              API 5
// ===================================================================

app.get("/get/games", (req, res) => {
  games.allGames((err, result) => {
    if (err) {
      console.log(err);
      res.status(500).send({
        message: "Internal Server Error",
      });
      return;
    }
    res.status(200).send(result);
  });
});

// ===================================================================
//                              API 6
// ===================================================================

app.get("/search/game", (req, res) => {
  title = req.query.title;
  platformname = req.query.platformname;

  if (platformname == "") {
    res.status(400).send({ message: "Bad request" });
    return;
  }

  games.searchGames(title, platformname, (err, result) => {
    if (err) {
      console.log(err);
      res.status(500).send({
        message: "Internal Server Error",
      });
      return;
    }

    res.status(200).send(result);
  });
});

// ===================================================================
//                              API 7
// ===================================================================

app.get("/game/:gameid/:platformname", (req, res) => {
  gameid = req.params.gameid;
  platformname = req.params.platformname;

  if (gameid == "" || platformname == "") {
    res.status(400).send({ message: "Bad request" });
    return;
  }

  games.getGames(gameid, platformname, (err, result) => {
    if (err) {
      console.log(err);
      res.status(500).send({
        message: "Internal Server Error",
      });
      return;
    }

    if (result[0].title == null) {
      res.status(404).send({ message: "Not Found" });
      return;
    }

    res.status(200).send(result);
  });
});

// ===================================================================
//                              API 8
// ===================================================================

app.get("/reviews", (req, res) => {
  gameid = req.query.gameid;

  if (gameid == "") {
    res.status(400).send({ message: "Bad request" });
    return;
  }

  review.getReviews(gameid, (err, result) => {
    if (err) {
      console.log(err);
      res.status(500).send({
        message: "Internal Server Error",
      });
      return;
    }
    res.status(200).send(result);
  });
});

// ===================================================================
//                              API 9
// ===================================================================

app.post("/add/review", verifyToken, (req, res) => {
  userid = req.body.userid;
  gameid = req.body.gameid;
  content = req.body.content;
  rating = req.body.rating;

  if (
    userid == "" ||
    gameid == "" ||
    content == "" ||
    rating == "" ||
    parseInt(rating) < 0 ||
    parseInt(rating) > 5
  ) {
    res.status(400).send({ message: "Bad request" });
    return;
  }

  review.addReview(userid, gameid, content, rating, (err, result) => {
    if (err) {
      if (err.code == "ER_NO_REFERENCED_ROW_2") {
        res.status(404).send({ message: "Not Found" });
        return;
      }
      console.log(err);
      res.status(500).send({
        message: "Internal Server Error",
      });
      return;
    }
    res.status(200).send(result);
  });
});

// ===================================================================
//                              API 10
// ===================================================================

app.get("/get/platforms", (req, res) => {
  platform.allPlatforms((err, result) => {
    if (err) {
      console.log(err);
      res.status(500).send({
        message: "Internal Server Error",
      });
      return;
    }
    res.status(200).send(result);
  });
});

// ===================================================================
//                              API 11
// ===================================================================

app.post("/add/platform", verifyToken, verifyAdmin, (req, res) => {
  platformname = req.body.platformname;
  description = req.body.description;

  if (platformname == "" || description == "") {
    res.status(400).send({ message: "Bad request" });
    return;
  }

  platform.addPlatform(platformname, description, (err, result) => {
    if (err) {
      if (err.code === "ER_DUP_ENTRY") {
        res.status(422).send({
          message: "Unprocessable Content",
        });
        return;
      }
      console.log(err);
      res.status(500).send({
        message: "Internal Server Error",
      });
      return;
    }
    res.status(200).send(result);
  });
});

// ===================================================================
//                              API 12
// ===================================================================

app.get("/get/categories", (req, res) => {
  category.allPCategories((err, result) => {
    if (err) {
      console.log(err);
      res.status(500).send({
        message: "Internal Server Error",
      });
      return;
    }
    res.status(200).send(result);
  });
});

// ===================================================================
//                              API 13
// ===================================================================

app.post("/add/game", verifyToken, verifyAdmin, (req, res) => {
  var title = req.body.title;
  var description = req.body.description;
  var platformid = req.body.platformid.split(", ");
  var price = req.body.price.split(", ");
  var points = req.body.points.split(", ");
  var categoryid = req.body.categoryid.split(", ");
  var year = req.body.year;

  // body validation
  if (title === "" || description === "" || year === "") {
    res.status(400).send({ message: "Bad request" });
    return;
  }

  // check if price, platformid and points are the same length (same table)
  if (
    price.length != platformid.length ||
    platformid.length != points.length ||
    price.length != points.length
  ) {
    res.status(400).send({ message: "Bad request" });
    return;
  }

  // check if they is empty element
  for (let i = 0; i < platformid.length; i++) {
    if (platformid[i] == "" || price[i] == "" || points[i] == "") {
      res.status(400).send({ message: "Bad request" });
      return;
    }
  }

  // check if any category element is empty
  for (let i = 0; i < categoryid.length; i++) {
    if (categoryid[i] == "") {
      res.status(400).send({ message: "Bad request" });
      return;
    }
  }

  games.addGame(
    title,
    description,
    year,
    platformid,
    price,
    categoryid,
    points,
    (error, result) => {
      if (error) {
        // If title already exist
        if (error.code === "ER_DUP_ENTRY") {
          res.status(422).send({
            message: "Unprocessable Content",
          });
          return;
        }
        console.log(error);
        res.status(500).send({
          message: "Internal Server Error",
        });
        return;
      }
      res.status(200).send({ message: "Success" });
    }
  );
});

// ===================================================================
//                              API 14
// ===================================================================

app.post("/add/image", (req, res) => {
  var title = req.body.title;
  var image2add = req.files.myfile;

  // image type validation
  if (image2add.mimetype != "image/jpeg") {
    res.status(415).send({ message: "Incorrect file type" });
    return;
  }

  // image size validation
  if (image2add.size > 1000000) {
    res.status(413).send({ message: "Exceed file size" });
    return;
  }

  filePath = "/images/" + title;

  games.addImage(title, filePath, (error, result) => {
    if (error) {
      // gameid already exist in table
      if (error.code == "ER_DUP_ENTRY") {
        res.status(422).send({ message: "Unprocessable Content" });
        return;
      }

      // if gameid is invalid
      if (error == "nosuchgame") {
        res.status(404).send({ message: "Not Found" });
        return;
      }

      console.log(error);
      res.status(500).send({ message: "Internal Server Error" });
      return;
    }

    // moving file into gameImage
    fileName = result[0].title + ".jpeg";
    console.log(fileName);

    // Use __dirname or a specific folder path on the server for saving the image
    const uploadPath = path.join(__dirname, "../../Frontend/public/images"); // Change "uploads" to your desired folder name
    fullPath = path.join(uploadPath, fileName);
    console.log(fullPath);

    // Use gameImage (previously req.files.myfile) to move the uploaded file
    image2add.mv(fullPath, function (error) {
      if (error) {
        console.log(error);
        res.status(500).send({ message: "Internal Server Error" });
        return;
      }

      // get the full path for output
      filePath = path.resolve(fullPath);
      result[0]["uploaded _on"] = filePath;
      res.status(200).send(result);
    });
  });
});

// ===================================================================
//                              API 15
// ===================================================================

app.post("/add/cart", (req, res) => {
  userid = req.body.userid;
  title = req.body.title;
  platformname = req.body.platformname;

  if (userid == "" || title == "" || platformname == "") {
    res.status(400).send({ message: "Bad request" });
    return;
  }

  cart.addToCart(userid, title, platformname, (err, result) => {
    if (err) {
      if (err.code == "ER_DUP_ENTRY") {
        res.status(422).send({ message: "Unprocessable Content" });
        return;
      }

      if (err == "nosuchgame") {
        res.status(404).send({ message: "Not Found" });
        return;
      }

      console.log(err);
      res.status(500).send({ message: "Internal Server Error" });
      return;
    }
    res.status(200).send(result);
  });
});

// ===================================================================
//                              API 16
// ===================================================================

app.delete("/del/cart", (req, res) => {
  userid = req.body.userid;
  title = req.body.title;
  platformname = req.body.platformname;

  if (userid == "" || title == "" || platformname == "") {
    res.status(400).send({ message: "Bad request" });
    return;
  }

  cart.deleteFromCart(userid, title, platformname, (err, result) => {
    if (err) {
      if (err == "nosuchgame") {
        res.status(400).send({ message: "Bad request" });
        return;
      }

      console.log(err);
      res.status(500).send({ message: "Internal Server Error" });
      return;
    }

    if (result.affectedRows != 1) {
      res.status(404).send({ message: "Not Found" });
      return;
    }

    res.status(200).send(result);
  });
});

// ===================================================================
//                              API 17
// ===================================================================

app.get("/check/cart", (req, res) => {
  var userid = req.query.userid;
  var title = req.query.title;
  var platformname = req.query.platformname;

  if (userid == "" || title == "" || platformname == "") {
    res.status(400).send({ message: "Bad request" });
    return;
  }

  cart.checkCart(userid, title, platformname, (err, result) => {
    if (err) {
      if (err == "nosuchplatform" || err == "nosuchgame") {
        res.status(404).send({ message: "Not Found" });
        return;
      }

      console.log(err);
      res.status(500).send({ message: "Internal Server Error" });
      return;
    }

    res.status(200).send(result);
  });
});

// ===================================================================
//                              API 18
// ===================================================================

app.get("/view/cart", (req, res) => {
  var userid = req.query.userid;

  if (userid == "") {
    res.status(400).send({ message: "Bad request" });
    return;
  }

  cart.viewCart(userid, (err, result) => {
    if (err) {
      console.log(err);
      res.status(500).send({ message: "Internal Server Error" });
      return;
    }

    res.status(200).send(result);
  });
});

// ===================================================================
//                              API 19
// ===================================================================

app.get("/user/games", (req, res) => {
  var userid = req.query.userid;
  var title = req.query.title;
  var platformname = req.query.platformname;

  if (userid == "" || title == "" || platformname == "") {
    res.status(400).send({ message: "Bad request" });
    return;
  }

  games.userGames(userid, title, platformname, (err, result) => {
    if (err) {
      if (err == 'userdoesnotowngame') {
        res.status(404).send({ message: "Not Found" });
        return;
      }

      console.log(err);
      res.status(500).send({ message: "Internal Server Error" });
      return;
    }

    if (result.length == 0) {
      res.status(404).send({ message: "Not Found" });
      return;
    }

    res.status(200).send(result);
  });
});

// ===================================================================
//                              API 20
// ===================================================================

app.get("/owned/games", (req, res) => {
  var userid = req.query.userid;

  if (userid == "") {
    res.status(400).send({ message: "Bad request" });
    return;
  }

  games.displayingUserGames(userid, (err, result) => {
    if (err) {
      console.log(err);
      res.status(500).send({ message: "Internal Server Error" });
      return;
    }



    res.status(200).send(result);
  });
});

// ===================================================================
//                              API 21
// ===================================================================

app.post("/bought/games", (req, res) => {
  var userid = req.body.userid;
  var title = req.body.title;
  var platformname = req.body.platformname;

  if (userid == "" || title == "" || platformname == "") {
    res.status(400).send({ message: "Bad request" });
    return;
  }

  games.buyGames(userid, title, platformname, (err, result) => {
    if (err) {
      if (err.code == "ER_DUP_ENTRY") {
        res.status(422).send({ message: "Unprocessable Content" });
        return;
      }

      if (err = 'nosuchgame') {
        res.status(404).send({ message: "Not Found" });
        return;
      }

      console.log(err);
      res.status(500).send({ message: "Internal Server Error" });
      return;
    }

    if (result.length == 0) {
      res.status(404).send({ message: "Not Found" });
      return;
    }

    res.status(200).send(result);
  });
});

// ===================================================================
//                              API 22
// ===================================================================

app.get("/verify/admin", verifyToken, verifyAdmin, (req, res) => {
  res.status(200).send();
});

module.exports = app;
