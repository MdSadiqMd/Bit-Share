import {
  express,
  Request,
  Response,
  NextFunction,
  Router,
  userModel,
  verificationModel,
  bcrypt,
  jwt,
  fs,
  multer,
  nodemailer,
  Transporter,
  response,
  authTokenHandler,
} from "../imports";
require("dotenv").config();

const router: Router = express.Router();
const app = express();
app.use(express.json());

router.get("/test", (req, res) => {
  res.send("File Share Routes Testing");
});

module.exports = router;
