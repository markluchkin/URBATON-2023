const { Router } = require("express");
const loginController = require("../controllers/login.controller.js");
const { check } = require("express-validator");
const { authenticateToken } = require("../controllers/role.middleware.js");
const router = new Router();

router.post('/login', [
  check("email")
    .exists()
    .withMessage("Требуется Email")
    .isEmail()
    .withMessage("Неверный email")
    .not()
    .isEmpty()
    .withMessage("Email не может быть пустым")
    .normalizeEmail(),
  check("password")
    .exists()
    .withMessage("Требуется пароль")
    .not()
    .isEmpty()
    .withMessage("Пароль не может быть пустым")
], loginController.login);

router.get('/getInfo',authenticateToken, loginController.getUserInfo);

module.exports = router;