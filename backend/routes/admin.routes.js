const { Router } = require("express");
const adminController = require("../controllers/admin.controller.js");
const { check } = require("express-validator");
const router = new Router();

router.post('/createNews', adminController.createNews);

module.exports = router;