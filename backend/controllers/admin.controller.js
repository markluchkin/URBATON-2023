const News = require("../models/News");
const mongoose = require("../db");
// const { validationResult } = require("express-validator");

class adminController {

  async createNews(req, res) {
    //дописать проверку токена, тела запроса
    try {
      const { title, text, date, organization } = req.body;

      const news = await News.create({ title, text, date, organization });

      res.status(201).json({ news });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: "Ошибка сервера" });
    }
  }
}
module.exports = new adminController();
