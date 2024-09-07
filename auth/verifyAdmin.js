function verifyAdmin(req, res, next) {
  member_type = req.role;

  if (member_type != "Admin") {
    console.log("Not Admin")
    res.status(403).send({message: "Unauthorize access"})
    return
  }
  console.log("Admin")
  next();
}

module.exports = verifyAdmin;
