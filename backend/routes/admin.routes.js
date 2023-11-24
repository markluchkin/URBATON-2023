const { Router } = require("express");
const userController = require("../controllers/admin.controller.js");
const { check } = require("express-validator");
const router = new Router();

router.get('/news', userController.news);

module.exports = router;