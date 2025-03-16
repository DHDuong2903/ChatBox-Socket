const viewRouter = require("./view.router");
const accountRouter = require("./account.router");

module.exports = (app) => {
  app.use("/", viewRouter);
  app.use("/api/accounts", accountRouter);
};
