const { Router } = require("express");
const newsController = require("../controllers/news.controller.js");
const { check } = require("express-validator");
const router = new Router();

router.post('/', newsController.createNews);

router.get('/', newsController.getAllNews);

module.exports = router;