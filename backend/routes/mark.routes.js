const { Router } = require("express");
const markController = require("../controllers/mark.controller.js");
const { check } = require("express-validator");
const router = new Router();
const { authenticateToken } = require("../controllers/role.middleware");

router.post('/create', [
  check("subject")
    .exists()
    .withMessage("Требуется название предмета")
    .not()
    .isEmpty()
    .withMessage("Название предмета не может быть пустым"),
  check("value")
    .exists()
    .withMessage("Требуется оценка")
    .not()
    .isEmpty()
    .withMessage("Оценка не может быть пустой"),
  check("student")
    .exists()
    .withMessage("Требуется ученик")
    .not()
    .isEmpty()
    .withMessage("Ученик не может быть пустым"),
    check("teacher")
    .exists()
    .withMessage("Требуется учитель")
    .not()
    .isEmpty()
    .withMessage("Учитель не может быть пустым"),
], markController.createMark);

router.get('/getGroups', markController.getGroupsByTeacher);

module.exports = router;