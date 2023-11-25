const express = require("express");
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const Mark = require("../models/Mark");
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
  
      const mark = new Mark({
        subject: subject,
        value: value,
        student: studentId,
        teacher: teacherId,
      });
  
      await mark.save();
  
      res.status(201).json({ message: "Оценка поставлена" });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  }
};
module.exports = new markController();