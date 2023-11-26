const { Router } = require("express");
const lessonController = require("../controllers/lesson.controller.js");
const { check } = require("express-validator");
const router = new Router();

router.post('/createLesson', lessonController.createLesson);
router.get('/getTeacherLesson', lessonController.getTeacherLessons);
router.post('/getStudentLesson', lessonController.getStudentLessons);
router.get('/getAllLesson', lessonController.getAllLessons);

module.exports = router;