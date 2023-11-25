const { Router } = require("express");
const adminController = require("../controllers/admin.controller.js");
const { check } = require("express-validator");
const router = new Router();

router.get('/news', adminController.news);

router.post('/news', adminController.createNews);

module.exports = router;