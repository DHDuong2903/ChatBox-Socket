const accountModel = require("../models/account.model");

module.exports = {
  renderLogin: async (req, res) => {
    return res.render("login.ejs");
  },
};
