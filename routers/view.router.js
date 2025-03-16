const express = require("express");
const router = express.Router();

const { renderChat } = require("../controllers/view.controller");
const { renderLogin } = require("../controllers/login.controller");

router.route("/").get(renderLogin);

router.route("/chat").get(renderChat);

module.exports = router;
