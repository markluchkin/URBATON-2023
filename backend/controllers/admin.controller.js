const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const News = require("../models/News");
const { validationResult } = require("express-validator");

class adminController {
  /* async news(req, res) {
    console.log("aaa");
  } */
  async createNews(req, res){
    try{
      const {title, text, date, organization} = req.body;

      const news = await News.create({ title, text, date, organization });

      res.status(201).json({ news });
    } catch (error){
      console.error(error);
      return res.status(500).json({ error: "Ошибка сервера" });
    }
  }
  async createNews(req, res){
    try{
      const {title, text, date, organization} = req.body;

      const news = await News.create({ title, text, date, organization });

      res.status(201).json({ news });
    } catch (error){
      console.error(error);
      return res.status(500).json({ error: "Ошибка сервера" });
    }
  }
}


module.exports = new adminController();
