import {
  express,
  userModel,
  verificationModel,
  bcrypt,
  jwt,
  connectDB,
} from "../imports";

connectDB();

const router = express.Router();
router.get("/test", (req, res) => {
  res.send("File Share Routes Testing");
});

module.exports = router;
