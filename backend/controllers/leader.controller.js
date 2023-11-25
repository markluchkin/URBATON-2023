const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const generatePassword = require("generate-password");
const Leader = require("../models/Leader");
const Admin = require("../models/Admin");
const Teacher = require("../models/Teacher");
const Parent = require("../models/Parent");
const Student = require("../models/Student");
const Group = require("../models/Group");
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
        uppercase: true,
        excludeSimilarCharacters: true,
      });

      const hashedPassword = generatedPassword;//await bcrypt.hash(generatedPassword, 10);
      console.log(email, generatedPassword);

      const newLeader = new Leader({
        organization: organization,
        email: email,
        phone: phone,
        password: hashedPassword,
      });
      await newLeader.save();
      const token = jwt.sign(
        { userId: newLeader._id, email: newLeader.email , role: "Leader", organization: organization},
        "pryanik",
        { expiresIn: "7d" }
      );

      res.status(201).json({ message: "Успешное оформление заявки", password: generatedPassword, token: token});

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
    console.log(userOrganization);
    const userRole = req.user.role;
    if (userRole !== "Leader") {
      return res.status(403).json({ error: "В доступе отказано." });
    }
    const { name, surname, email, role, phone, subject, group, groups} = req.body;
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
        uppercase: true,
        excludeSimilarCharacters: true,
      });

      const hashedPassword = generatedPassword//await bcrypt.hash(generatedPassword, 10);
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
            subject: subject,
            name: name,
            surname: surname,
            email: email,
            phone: phone,
            password: hashedPassword,
            organization: userOrganization,
            groups: groups,
            subject: subject
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
            organization: userOrganization,
            group: group
          })
          await newStudent.save();
          const existingGroup = await Group.findOne({ name: group });
          if (existingGroup) {
            // Если группа найдена, добавить студента в массив students
            existingGroup.students.push(newStudent);
            await existingGroup.save();
          } else {
            // Если группа не найдена, создать новую группу
            const newGroup = new Group({
              name: group,
              students: [newStudent],
            });
            await newGroup.save();
          }
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
  
  async getAllAdmins(req, res){
    const userOrganization = req.user.organization;
    const userRole = req.user.role;
    if (userRole !== "Leader") {
      return res.status(403).json({ error: "В доступе отказано." });
    }
    try{
      const admins = await Admin.find({organization: userOrganization});
      res.json(admins)
    } catch (error){
      console.error('Error retrieving students:', error);
      res.status(500).json({ error: 'Something went wrong' });
    }
  }

  async getAllTeachers(req, res){
    const userOrganization = req.user.organization;
    const userRole = req.user.role;
    if (userRole !== "Leader") {
      return res.status(403).json({ error: "В доступе отказано." });
    }
    try{
      const teachers = await Teacher.find({organization: userOrganization});
      res.json(teachers)
    } catch (error){
      console.error('Error retrieving students:', error);
      res.status(500).json({ error: 'Something went wrong' });
    }
  }

  async getAllParents(req, res){
    const userOrganization = req.user.organization;
    const userRole = req.user.role;
    if (userRole !== "Leader") {
      return res.status(403).json({ error: "В доступе отказано." });
    }
    try{
      const parents = await Parent.find({organization: userOrganization});
      res.json(parents)
    } catch (error){
      console.error('Error retrieving students:', error);
      res.status(500).json({ error: 'Something went wrong' });
    }
  }

  async getAllStudents(req, res){
    const userOrganization = req.user.organization;
    const userRole = req.user.role;
    if (userRole !== "Leader") {
      return res.status(403).json({ error: "В доступе отказано." });
    }
    try{
      const students = await Student.find({organization: userOrganization});
      res.json(students)
    } catch (error){
      console.error('Error retrieving students:', error);
      res.status(500).json({ error: 'Something went wrong' });
    }
  }

}

module.exports = new leaderController();