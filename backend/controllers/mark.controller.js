const express = require("express");
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const Mark = require("../models/Mark");
const Student = require("../models/Student");
const Teacher = require("../models/Teacher");
const Group = require("../models/Group");
class markController{
  async createMark(req, res){
    try {
      const userRole = req.user.role;
        console.log(userRole);
      if (userRole !== "Teacher" && userRole !== "Admin" && userRole !== "Leader") {
        return res.status(403).json({ error: "В доступе отказано." });
      }
      const { subject, value, studentId } = req.body;
      const teacherId = req.user._id;
  
      const newMark = new Mark({
        subject: subject,
        value: value,
        student: studentId,
        teacher: teacherId,
      });
      await newMark.save();

      await Student.findOneAndUpdate(
        { _id: studentId },
        { $push: { marks: newMark._id } },
        { new: true }
      );
  
      res.status(201).json({ message: "Оценка поставлена" });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  }
  async getGroupsByTeacher(req, res){
    const userRole = req.user.role;
        console.log(userRole);
      if (userRole !== "Teacher" && userRole !== "Admin" && userRole !== "Leader") {
        return res.status(403).json({ error: "В доступе отказано." });
      }
      console.log(req.user);
      const teacherId = req.user.userId;
      console.log(teacherId);
      try {
        let teacher = await Teacher.findById(teacherId).populate({
          path: 'groups',
          populate: {
            path: 'students',
            select: 'name _id', // выбираем только имя и _id студента
          },
        });
        if (!teacher){
          res.status(401).json({ message: "Вы не учитель" });
          console.log("Вы не учитель");
          return;
        }
        console.log(teacher);
        console.log(teacher.groups);
        const formattedGroups = await Promise.all(teacher.groups.map(async (groupName) => {
          const group = await Group.findOne({ name: groupName }).populate('students', 'name _id');
      
          if (!group) {
            return {
              name: groupName,
              students: [],
            };
          }
      
          return {
            name: groupName,
            students: group.students.map(student => ({
              id: student._id,
              name: student.name,
            })),
          };
        }));
        res.status(200).json({ groups: formattedGroups });
      } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Ошибка сервера" });
      }
  }


};

module.exports = new markController();