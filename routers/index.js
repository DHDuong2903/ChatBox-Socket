const accountRouter = require("./account.router");

module.exports = (app) => {
  app.use("/", (req, res) => {
    return res.render("login.ejs");
  });
  app.use("/api/accounts", accountRouter);
  app.use("/chat", (req, res) => {
    return res.render("chat.ejs");
  });
};
