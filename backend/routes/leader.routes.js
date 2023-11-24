const { Router } = require("express");
const leaderController = require("../controllers/leader.controller.js");
const { check } = require("express-validator");
const router = new Router();

router.post('/signup', [
  check("name")
    .exists()
    .withMessage("Требуется имя организации"),
  check("email")
    .exists()
    .withMessage("Требуется Email")
    .isEmail()
    .withMessage("Неверный email")
    .not()
    .isEmpty()
    .withMessage("Email не может быть пустым")
    .normalizeEmail(),
  check("phone")
    .exists()
    .withMessage("Требуется телефон")
    .not()
    .isEmpty()
    .withMessage("Пароль не может быть пустым"),
], leaderController.signup);

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
    .withMessage("Пароль не может быть пустым"),
], leaderController.login);

module.exports = router;