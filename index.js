const express = require("express");
require("dotenv").config({ path: ".env" });
require("./config");
const cors = require("cors");
const orderRoutes = require("./Routes/orderRoutes");
const app = express();

app.use(cors());
app.use(express.json());

app.use(express.static("uploads"));

app.use("/api/order", orderRoutes);

app.listen(5555);
