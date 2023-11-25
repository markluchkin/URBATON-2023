const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const generatePassword = require("generate-password");
const Leader = require("../models/Leader");
const Admin = require("../models/Admin");
const Teacher = require("../models/Teacher");
const Parent = require("../models/Parent");
const Student = require("../models/Student");
const { validationResult } = require("express-validator");
const mongoose = require("../db");

class leaderController {
  async signup(req, res) {
    const { name, email, phone } = req.body;
    const validator = validationResult(req);
    if (!validator.isEmpty()) {
      res.status(401).json(validator.errors.shift());
      console.log(validator.errors.shift())
      return;
    }
    try {
      const existingLeader = await Leader.findOne({
        $or: [
          { email: email },
          { phone: phone }
        ]
      });
      if (existingLeader) {
        res.status(400).json({ message: "Эта организация уже зарегистрирована" });
        console.log("Эта организация уже зарегистрирована")
        return;
      }
      const generatedPassword = generatePassword.generate({
        length: 10,
        numbers: true,
        symbols: true,
        uppercase: true,
        excludeSimilarCharacters: true,
      });
      // отправить письмом на почтуу
      const hashedPassword = await bcrypt.hash(generatedPassword, 10);
      console.log(email, generatedPassword);

      const newLeader = new Leader({
        name: name,
        email: email,
        phone: phone,
        password: hashedPassword,
      });
      await newLeader.save();

      res.status(201).json({ message: "Успешное оформление заявки", password: generatedPassword});
      console.log("Успешное оформление заявки");
    } catch (error) {
      console.log("Error creating leader:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  }

  async createUser(req,res){
    const { name, surname, email, role, phone } = req.body;
    const validator = validationResult(req);
    if (!validator.isEmpty()) {
      res.status(401).json(validator.errors.shift());
      console.log(validator.errors.shift())
      return;
    }
    try {
      const existingLeader = await Leader.findOne({
        $or: [
          { email: email },
          { phone: phone }
        ]
      });
      const existingAdmin = await Admin.findOne({
        $or: [
          { email: email },
          { phone: phone }
        ]
      });
      const existingTeacher = await Teacher.findOne({
        $or: [
          { email: email },
          { phone: phone }
        ]
      });
      const existingParent = await Parent.findOne({
        $or: [
          { email: email },
          { phone: phone }
        ]
      });
      const existingStudent = await Student.findOne({
        $or: [
          { email: email },
          { phone: phone }
        ]
      });

      if (existingAdmin){
        res.status(400).json({ message: "Этот пользователь уже зарегистрирован"});
        console.log("Этот пользователь уже зарегистрирован");
        return;
      }
      else if (existingTeacher){
        res.status(400).json({ message: "Этот пользователь уже зарегистрирован"});
        console.log("Этот пользователь уже зарегистрирован");
        return;
      }
      else if (existingParent){
        res.status(400).json({ message: "Этот пользователь уже зарегистрирован"});
        console.log("Этот пользователь уже зарегистрирован");
        return;
      }
      else if (existingStudent){
        res.status(400).json({ message: "Этот пользователь уже зарегистрирован"});
        console.log("Этот пользователь уже зарегистрирован");
        return;
      }

      const generatedPassword = generatePassword.generate({
        length: 10,
        numbers: true,
        symbols: true,
        uppercase: true,
        excludeSimilarCharacters: true,
      });

      // отправить письмом на почтуу

      const hashedPassword = await bcrypt.hash(generatedPassword, 10);
      console.log(email, generatedPassword);

      switch (role) {
        case "Admin":
          const newAdmin = new Admin({
          name: name,
          surname: surname,
          email: email,
          phone: phone,
          password: hashedPassword})
          await newAdmin.save()
          break

        case "Teacher":
          const newTeacher = new Teacher({
          name: name,
          surname: surname,
          email: email,
          phone: phone,
          password: hashedPassword})
          await newTeacher.save()
          break

        case "Parent":
          const newParent = new Parent({
          name: name,
          surname: surname,
          email: email,
          phone: phone,
          password: hashedPassword})
          await newParent.save()
          break

        case "Student":
          const newStudent = new Student({
          name: name,
          surname: surname,
          email: email,
          phone: phone,
          password: hashedPassword})
          await newStudent.save()
          break  
          
      }
      

      res.status(201).json({ message: "Успешная регистрация пользователя", password: generatedPassword, role: role});
      console.log("Успешная регистрация пользователя");
    } catch (error) {
      console.log("Error creating user:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  }
}

module.exports = new leaderController();