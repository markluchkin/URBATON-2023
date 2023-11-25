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

// MAILER: password -> user
const nodemailer = require('nodemailer');
const transporter = nodemailer.createTransport({
  service: 'Gmail',
  auth: {
    user: 'ekbartedinfo@gmail.com',
    pass: 'bqlj vmty xbsu kshn'
  }
});


class leaderController {
  async signup(req, res) {
    const { organization, email, phone } = req.body;
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

      const hashedPassword = await bcrypt.hash(generatedPassword, 10);
      console.log(email, generatedPassword);

      const newLeader = new Leader({
        organization: organization,
        email: email,
        phone: phone,
        password: hashedPassword,
      });
      await newLeader.save();

      res.status(201).json({ message: "Успешное оформление заявки", password: generatedPassword });

      // отправить письмом на почтуу
      const mailOptions = {
        from: 'ekbartedinfo@gmail.com',
        to: email,
        subject: '«Art Education Info» — пароль от личного кабинета',
        text: 'Добро пожаловать! \nВаш сгенерированный пароль для входа в ваш аккаунт: ' + generatedPassword + '\n \n' + 'что-то еще можно добавить'
      };
      transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
          console.log(error);
        } else {
          console.log('Письмо успешно отправлено: ' + info.response);
        }
      });

      console.log("Успешное оформление заявки");
    } catch (error) {
      console.log("Error creating leader:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  }

  async createUser(req, res) {
    const userOrganization = req.user.organization;
    const userRole = req.user.role;
    if (userRole !== "Leader") {
      return res.status(403).json({ error: "В доступе отказано." });
    }
    const { name, surname, email, role, phone } = req.body;
    const validator = validationResult(req);
    if (!validator.isEmpty()) {
      res.status(401).json(validator.errors.shift());
      console.log(validator.errors.shift())
      return;
    }
    try {
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

      if (existingAdmin) {
        res.status(400).json({ message: "Этот пользователь уже зарегистрирован" });
        console.log("Этот пользователь уже зарегистрирован");
        return;
      }
      else if (existingTeacher) {
        res.status(400).json({ message: "Этот пользователь уже зарегистрирован" });
        console.log("Этот пользователь уже зарегистрирован");
        return;
      }
      else if (existingParent) {
        res.status(400).json({ message: "Этот пользователь уже зарегистрирован" });
        console.log("Этот пользователь уже зарегистрирован");
        return;
      }
      else if (existingStudent) {
        res.status(400).json({ message: "Этот пользователь уже зарегистрирован" });
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

      const hashedPassword = await bcrypt.hash(generatedPassword, 10);
      console.log(email, generatedPassword);

      switch (role) {
        case "Admin":
          const newAdmin = new Admin({
            name: name,
            surname: surname,
            email: email,
            phone: phone,
            password: hashedPassword,
            organization: userOrganization
          })
          await newAdmin.save()
          break

        case "Teacher":
          const newTeacher = new Teacher({
            name: name,
            surname: surname,
            email: email,
            phone: phone,
            password: hashedPassword,
            organization: userOrganization
          })
          await newTeacher.save()
          break

        case "Parent":
          const newParent = new Parent({
            name: name,
            surname: surname,
            email: email,
            phone: phone,
            password: hashedPassword,
            organization: userOrganization
          })
          await newParent.save()
          break

        case "Student":
          const newStudent = new Student({
            name: name,
            surname: surname,
            email: email,
            phone: phone,
            password: hashedPassword,
            organization: userOrganization
          })
          await newStudent.save()
          break

      }

      res.status(201).json({ message: "Успешная регистрация пользователя", password: generatedPassword, role: role });

      // отправить письмом на почтуу
      const mailOptions = {
        from: 'ekbartedinfo@gmail.com',
        to: email,
        subject: 'Art Education Info» — пароль от личного кабинета',
        text: 'Добро пожаловать! \nВаш сгенерированный пароль для входа в ваш аккаунт: ' + generatedPassword + '\n \n' + 'что-то еще можно добавить'
      };
      transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
          console.log(error);
        } else {
          console.log('Письмо успешно отправлено: ' + info.response);
        }
      });

      console.log("Успешная регистрация пользователя");
    } catch (error) {
      console.log("Error creating user:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  }
  
  static async getAllAdmins(req, res){
    try{
      const admins = await Admin.find({});
      res.join(admins)
    } catch (error){
      console.error('Error retrieving students:', error);
      res.status(500).json({ error: 'Something went wrong' });
    }
  }

  static async getAllTeachers(req, res){
    try{
      const teachers = await Teacher.find({});
      res.join(teachers)
    } catch (error){
      console.error('Error retrieving students:', error);
      res.status(500).json({ error: 'Something went wrong' });
    }
  }

  static async getAllParents(req, res){
    try{
      const parents = await Parent.find({});
      res.join(parents)
    } catch (error){
      console.error('Error retrieving students:', error);
      res.status(500).json({ error: 'Something went wrong' });
    }
  }

  static async getAllStudents(req, res){
    try{
      const students = await Student.find({});
      res.join(students)
    } catch (error){
      console.error('Error retrieving students:', error);
      res.status(500).json({ error: 'Something went wrong' });
    }
  }

}

module.exports = new leaderController();