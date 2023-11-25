const express = require("express");
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const Mark = require("../models/Mark");
const Student = require("../models/Student");
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
};
module.exports = new markController();