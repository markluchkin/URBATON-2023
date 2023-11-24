const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

const { validationResult } = require("express-validator");

class adminController {
  async news(req, res) {
    console.log("aaa");

  }
}

module.exports = new adminController();