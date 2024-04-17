import { express, userModel, verificationModel, bcrypt, jwt } from "../imports";
require("dotenv").config();

const router = express.Router();
router.get("/test", (req, res) => {
  res.send("File Share Routes Testing");
});

module.exports = router;
