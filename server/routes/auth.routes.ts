import {
  express,
  userModel,
  verificationModel,
  bcrypt,
  jwt,
  fs,
  multer,
  nodemailer,
} from "../imports";

async function mailer(receiverEmail, code) {
  let transporter = nodemailer.getTransporter({
    host: "smtp.gmail.com",
    port: 587,
    secure: false,
    requireTLS: true,
    auth: {
      user: process.env.GMAIL,
      pass: process.env.GMAIL_APP_PASSWORD,
    },
  });
  let info=await transporter
}

const router = express.Router();
router.get("/test", (req, res) => {
  res.send("Auth Routes Testing");
});

module.exports = router;
