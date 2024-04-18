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

async function mailer(
  receiverEmail: string,
  senderEmail: String
): Promise<void> {
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
    subject: "new File Received",
    text: "You received a File from " + senderEmail,
    html: "<b>You received a File from " + senderEmail + "</b>",
  });

  //console.log(info.messageId);
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

router.get("/test", (req, res) => {
  res.send("File Share Routes Testing");
});

router.post(
  "/sharefile",
  authTokenHandler,
  fileUpload,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      
    } catch (error) {
      
    }
  }
);

module.exports = router;
