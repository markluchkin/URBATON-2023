const jwt = require("jsonwebtoken");
const Leader = require("../models/Leader");
const Parent = require("../models/Parent");
const Teacher = require("../models/Teacher");
const Student = require("../models/Student");
const Admin = require("../models/Admin");
const { validationResult } = require("express-validator");
const mongoose = require("../db");

async function findUserById(userId) {
  try {
    const student = await Student.findById(userId);
    if (student) {
      return student;
    }

    const teacher = await Teacher.findById(userId);
    if (teacher) {
      return teacher;
    }

    const parent = await Parent.findById(userId);
    if (parent) {
      return parent;
    }

    const admin = await Admin.findById(userId);
    if (admin) {
      return admin;
    }

    const leader = await Leader.findById(userId);
    if (leader) {
      return leader;
    }

    return null;
  } catch (error) {
    console.error(error);
    throw new Error("Ошибка при поиске пользователя");
  }
}


class loginController {

  async login(req, res) {
    const { email, password } = req.body;
    const validator = validationResult(req);
    var role;
    if (!validator.isEmpty()) {
      res.status(401).json(validator.errors.shift());
      return;
    }

    try {
      const leader = await Leader.findOne({ email });
      const parent = await Parent.findOne({ email });
      const teacher = await Teacher.findOne({ email });
      const student = await Student.findOne({ email });
      const admin = await Admin.findOne({ email });
      if (leader) {
        let organization = leader.organization;
        role = "Leader";
        /* const isPasswordValid = await bcrypt.compare(password, leader.password);
        if (!isPasswordValid) {
            res.status(401).json({ message: "Неверные данные" });
            console.log("Неверные данные");
            return;
          } */
        const token = jwt.sign(
          { userId: leader._id, email: leader.email, role: role, organization: organization },
          "pryanik",
          { expiresIn: "7d" }
        );
        res.status(200).json({ token, userId: leader._id, role: role });
        //console.log(token);
      }
      else if (parent) {
        let organization = parent.organization;
        role = "Parent";
        /* const isPasswordValid = await bcrypt.compare(password, parent.password);
        if (!isPasswordValid) {
            res.status(401).json({ message: "Неверные данные" });
            console.log("Неверные данные");
            return;
          } */
        const token = jwt.sign(
          { userId: parent._id, email: parent.email, role: role, organization: organization  },
          "pryanik",
          { expiresIn: "7d" }
        );
        const responseData = {
          token,
          userId: parent._id,
          role: role,
          students: await Promise.all(parent.students.map(async (studentId) => {
            try {
              const studentBody = await Student.findById(studentId);
              console.log(studentBody);
              var name = studentBody.name + ' ' + studentBody.surname;
              return { name: name, id: studentId };
            } catch (error) {
              console.error("Ошибка при получении данных студента:", error);
              return { name: "Ошибка", id: studentId };
            }
          })),
        };
        res.status(200).json(responseData);
        //console.log(token);
      }
      else if (teacher) {
        let organization = teacher.organization;
        role = "Teacher";
        /* const isPasswordValid = await bcrypt.compare(password, teacher.password);
        if (!isPasswordValid) {
            res.status(401).json({ message: "Неверные данные" });
            console.log("Неверные данные");
            return;
          } */
        const token = jwt.sign(
          { userId: teacher._id, email: teacher.email, role: role, organization: organization  },
          "pryanik",
          { expiresIn: "7d" }
        );
        res.status(200).json({ token, userId: teacher._id, role: role});
        //console.log(token);
      }
      else if (student) {
        let organization = student.organization;
        role = "Student";
        /* const isPasswordValid = await bcrypt.compare(password, student.password);
        if (!isPasswordValid) {
            res.status(401).json({ message: "Неверные данные" });
            console.log("Неверные данные");
            return;
          } */
        const token = jwt.sign(
          { userId: student._id, email: student.email, role: role, organization: organization },
          "pryanik",
          { expiresIn: "7d" }
        );
        res.status(200).json({ token, userId: student._id, role: role });
        //console.log(token);
      }
      else if (admin) {
        let organization = admin.organization;
        role = "Admin";
        /* const isPasswordValid = await bcrypt.compare(password, admin.password);
        if (!isPasswordValid) {
            res.status(401).json({ message: "Неверные данные" });
            console.log("Неверные данные");
            return;
          } */
        const token = jwt.sign(
          { userId: admin._id, email: admin.email, role: role, organization: organization  },
          "pryanik",
          { expiresIn: "7d" }
        );
        res.status(200).json({ token, userId: admin._id, role: role });
        //console.log(token);
      }
      else {
        res.status(404).json({ message: "Пользователя не существует" });
        //console.log("Пользователя не существует");
        return;
      }
    } catch (error) {
      console.log("Error during login:", error);
      res.status(500).json({ message: "Ошибка сервера" });
    }
  }
  async getUserInfo(req, res){
    const userId = req.user.userId;

    try {
      findUserById(userId)
      .then((user) => {
        if (user) {
          if (user.role == 'Leader'){
            var name = user.organization

          }
          else {
            var name = user.name + ' ' + user.surname

          }
          const email = user.email;
          const phone = user.phone;
          const role = user.role;
          const id = user._id;

          res.status(200).json({"name":name, "emal": email, "phone": phone, "role": role, "id": id});
        } else {
          res.status(404).json("Пользователь не найден")
          console.log("Пользователь не найден");
        }
      })
      .catch((error) => {
        console.error(error);
      });
    } catch (error) {
      console.error("Ошибка при получении информации о студенте:", error);
      res.status(500).json({ error: "Ошибка сервера" });
    }

  }

}

module.exports = new loginController();