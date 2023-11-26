const News = require("../models/News");
const mongoose = require("../db");
// const { validationResult } = require("express-validator");

class newsController {

  async createNews(req, res) {
    //дописать проверку токена, тела запроса
    try {
    const userOrganization = req.user.organization;
      const { title, text, date } = req.body;

      const news = await News.create({ title, text, date, organization: userOrganization });

      res.status(201).json({ news });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: "Ошибка сервера" });
    }
  }
  
  async getAllNews(req, res){
    const userOrganization = req.user.organization;
    try {
      const news = await News.find({ organization: userOrganization });
      res.json(news);
    } catch (error) {
      console.error('Ошибка при получении новостей:', error);
      res.status(500).json({ error: 'Ошибка сервера' });
    }
  }
}
module.exports = new newsController();
