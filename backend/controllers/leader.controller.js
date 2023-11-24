const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const generatePassword = require("generate-password");
const Leader = require("../models/Leader");
const { validationResult } = require("express-validator");
const mongoose = require("../db");

class leaderController{
    async signup(req, res) {
        const { name, email, phone} = req.body;
        const validator = validationResult(req);
        if (!validator.isEmpty()) {
          res.status(401).json(validator.errors.shift());
          return;
        }
        try {
            const generatedPassword = generatePassword.generate({
                length: 10,
                numbers: true,
                symbols: true,
                uppercase: true,
                excludeSimilarCharacters: true,
              });
              // отправить письмом на почтуу
              const hashedPassword = await bcrypt.hash(generatedPassword, 10);

            const newLeader = new Leader({
                name: name,
                email: email,
                phone: phone,
                password: hashedPassword,
            });
            await newLeader.save();
        
            res.status(201).json({ message: "Leader created successfully" });
        } catch(error) {
            console.error("Error creating leader:", error);
            res.status(500).json({ message: "Internal server error" });
        }
    }
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
        res.status(401).json({ message: "" });
        return;
      }
      const isPasswordValid = await bcrypt.compare(password, leader.password);

      if (!isPasswordValid) {
        res.status(401).json({ message: "Неверные данные" });
        return;
      }
      const token = jwt.sign(
        { userId: leader._id, email: leader.email },
        "pryanik",
        { expiresIn: "7d" }
      );

      res.status(200).json({ token, userId: leader._id });
    } catch (error) {
      console.error("Error during login:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  }
}

module.exports = new leaderController();