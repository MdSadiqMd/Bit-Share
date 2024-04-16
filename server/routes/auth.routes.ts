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
  connectDB,
} from "../imports";

const app = express();
app.use(express.json());

async function mailer(receiverEmail: string, code: number): Promise<void> {
  let transporter: Transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    secure: false,
    requireTLS: true,
    service: "gmail",
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

const storage = multer.diskStorage({
  destination: (
    req: any,
    file: Express.Multer.File,
    cb: (error: Error | null, destination: string) => void
  ) => {
    cb(null, "./public"); // the file path should be same not the one in import statements
  },
  filename: (
    req: any,
    file: Express.Multer.File,
    cb: (error: Error | null, filename: string) => void
  ) => {
    let fileType = file.mimetype.split("/")[1];
    console.log(req.headers.filename);
    cb(null, `${Date.now()}.${fileType}`);
  },
});

const upload = multer({ storage: storage });
const fileUpload = (req: any, res: any, next: NextFunction) => {
  upload.single("clientfile")(req, res, (err: any) => {
    if (err) {
      return response(res, 400, "file Upload Failed", null, false);
    }
    next();
  });
};

const router = express.Router();

/*router.get("/test", (req, res) => {
  res.send("Auth Routes Testing");
  //mailer("mohammadsadiq4930@gmail.com", 12345);
});*/

// Check headers settings when testing with postman
router.post("/sendotp", async (req: Request, res: Response) => {
  const { email } = req.body;
  console.log(req.body);

  if (!email) {
    return response(res, 400, "Email is Required", null, false);
  }
  try {
    await verificationModel.deleteOne({ email: email });
    const code = Math.floor(100000 + Math.random() * 900000);
    await mailer(email, code);
    await verificationModel.findOneAndDelete({ email: email });
    const newVerification = new verificationModel({
      email: email,
      code: code,
    });
    await newVerification.save();
    return response(res, 200, "OTP Sent Successfully", null, true);
  } catch (error) {
    console.log(error);
    return response(res, 500, "Internal Server Error", null, false);
  }
});

router.post(
  "/register",
  fileUpload,
  async (req: any, res: any, next: NextFunction) => {
    console.log(req.file);
  }
);

module.exports = router;
