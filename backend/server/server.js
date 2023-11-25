const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const adminRouter = require("../routes/admin.routes");
const leaderRouter = require("../routes/leader.routes");
const loginRouter = require("../routes/login.routes");

const formData = require("express-form-data");
const os = require("os");

module.exports = class Server {
  constructor(port = process.env.port || 3000) {
    this.port = port;
    this.app = express();
  }

  setup() {
    this.app.use(bodyParser.urlencoded({ extended: true }));
    this.app.use(express.static('public'));
    this.app.use(bodyParser.json());
    this.app.use(formData.parse({
      uploadDir: os.tmpdir(),
      autoClean: true
    }));

    this.app.use(cors());
  }

  start() {
    this.setup();

    this.app.use("/api/admin/", adminRouter);
    this.app.use("/api/leader/", leaderRouter);
    this.app.use("/api/login/", loginRouter);

    this.app.listen(this.port, () => {
      console.log(`Server started at http://127.0.0.1:${this.port}`);
    });
  }
};