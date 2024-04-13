import {
  express,
  Router,
  userModel,
  verificationModel,
  bcrypt,
  jwt,
  fs,
  multer,
  nodemailer,
  Transporter,
} from "../imports";

async function mailer(receiverEmail: string, code: number): Promise<void> {
  let transporter: Transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    secure: false,
    requireTLS: true,
    service:"gmail",
    auth: {
      user: "mohammadsadiq4950@gmail.com",
      pass: "ozyx xzzz iovq ngmd",
    },
  });

  let info = await transporter.sendMail({
    from: "Bit-Share",
    to: receiverEmail,
    subject: "OTP Verification",
    text: "Verify your Account via OTP: " + code,
    html: "<b>Verify your Account via OTP: " + code + "</b>",
  });

  console.log(info.messageId);
  console.log(nodemailer.getTestMessageUrl(info));
}

const router = express.Router();

router.get("/test", (req, res) => {
  res.send("Auth Routes Testing");
  mailer("mohammadsadiq4930@gmail.com", 12345);
});

module.exports = router;
