const fs = require("fs");
const { parse } = require("csv-parse");
const Order = require("../Model/Order");
const Item = require("../Model/Item");

const uploadFile = async (req, resp) => {
  try {
    let res = [];

    const content = fs.readFileSync(req.file.path);
    const headers = [
      "order_id",
      "customer",
      "date",
      "item_name",
      "qnt",
      "unit_price",
    ];

    fs.createReadStream(req.file.path)
      .pipe(parse({ columns: headers, from_line: 2 }))
      .on("data", (row) => {
        res.push(row);
      })
      .on("end", async function () {
        res = res.map((data) => {
          return {
            order_id: parseInt(data.order_id),
            customer_name: data.customer,
            date: data.date,
            items: res
              .filter((d) => d.order_id == data.order_id)
              .map((dt) => {
                return {
                  name: dt.item_name,
                  qnt: parseInt(dt.qnt),
                  unit_price: parseFloat(dt.unit_price),
                };
              }),
          };
        });

        res = [...new Map(res.map((data) => [data.order_id, data])).values()];

        res = await Promise.all(
          res.map(async (data) => ({
            ...data,

            items: await Promise.all(
              data.items.map(async (it) => {
                let item = await Item.create(it);
                return item._id;
              })
            ),

            amount: parseFloat(
              data.items.reduce((amt, it) => {
                return (amt += it.qnt * it.unit_price);
              }, 0)
            ),
          }))
        );

        let d = await Order.insertMany(res);

        resp.send(d);
      });
  } catch (error) {
    throw new Error(error.message);
  }
};

const getOrder = async (req, res) => {
  try {
    let id = req.params.id;

    let order = await Order.findById(id).populate("items");

    res.send(order);
  } catch (error) {
    throw new Error(error.message);
  }
};

module.exports = { uploadFile, getOrder };
