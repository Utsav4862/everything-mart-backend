const { uploadFile, getOrder } = require("../Controller/orderController");
const { multerSt } = require("../middleware/multer");

const router = require("express").Router();

router.post("/upload", multerSt, uploadFile);
router.get("/:id", getOrder);

module.exports = router;
