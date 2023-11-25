
const jwt = require("jsonwebtoken");

const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
        return res.status(401).json({ error: "Не авторизован. Не предоставлен токен." });
    }

    jwt.verify(token, "pryanik", (err, user) => {
        if (err) {
            return res.status(403).json({ error: "Неправильный токен" });
        }
        req.user = user;
        next();
    });
};

module.exports = { authenticateToken };