const { Router } = require("express");
const lessonController = require("../controllers/lesson.controller.js");
const { check } = require("express-validator");
const router = new Router();

router.post('/createLesson', lessonController.createLesson);

module.exports = router;