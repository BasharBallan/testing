
const authRoute = require("../modules/user/authRoute");
const productRoute = require("../modules/product/productRoute");
const orderRoute = require("../modules/order/orderRoute");

const healthRoute = require("../modules/health/healthRoute");

const mountRoutes = (app) => {
  app.use("/api/v1/auth", authRoute);
  app.use("/", healthRoute);
  app.use("/api/v1/products", productRoute);
  app.use("/api/v1/orders", orderRoute);

};

module.exports = mountRoutes;
