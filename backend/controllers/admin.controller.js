const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

const { validationResult } = require("express-validator");

class adminController {
  async login(req, res) {
    const { email, password } = req.body;
    const validator = validationResult(req);

    if (!validator.isEmpty()) {
      res.status(400).json(validator.errors.shift());
      return;
    }

    try {
      const leader = await Leader.findOne({ email });

      if (!leader) {
        res.status(401).json({ message: "Нет такого пользователя" });
        console.log("Нет такого пользователя");
        return;
      }
      const isPasswordValid = await bcrypt.compare(password, leader.password);

      if (!isPasswordValid) {
        res.status(401).json({ message: "Неверные данные" });
        console.log("Неверные данные");
        return;
      }
      const token = jwt.sign(
        { userId: leader._id, email: leader.email },
        "pryanik",
        { expiresIn: "7d" }
      );

      res.status(200).json({ token, userId: leader._id });
      console.log(token);
    } catch (error) {
      console.log("Error during login:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  }
}

module.exports = new adminController();