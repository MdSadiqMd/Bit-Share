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
  errorHandler,
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

// There is no Files in database inject it and test it
router.post(
  "/sharefile",
  //authTokenHandler,
  fileUpload,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { senderEmail, receiverEmail, filename } = req.body;
      console.log(req.body);
      let sender = await userModel.findOne({ email: senderEmail });
      let receiver = await userModel.findOne({ email: receiverEmail });
      if (!sender) {
        if (req.file && req.file?.path) {
          fs.unlink(req.file?.path, (err) => {
            if (err) {
              console.log(err);
            } else {
              console.log("File Deleted Successfully");
            }
          });
        }
        return response(
          res,
          400,
          "You need to Login to Share the Files",
          null,
          false
        );
      }
      if (!receiver) {
        if (req.file && req.file?.path) {
          fs.unlink(req.file?.path, (err) => {
            if (err) {
              console.log(err);
            } else {
              console.log("File Deleted Successfully");
            }
          });
        }
        return response(
          res,
          400,
          "The Receiver isn't Logged on Bit Share",
          null,
          false
        );
      }
      sender.files.push({
        senderEmail: senderEmail,
        receiverEmail: receiverEmail,
        fileURL: req.file?.path,
        filename: filename ? filename : Date.now().toLocaleString(),
        sharedAt: Date.now(),
      });
      receiver.files.push({
        senderEmail: senderEmail,
        receiverEmail: receiverEmail,
        fileURL: req.file?.path,
        filename: filename,
        sharedAt: Date.now(),
      });
      await sender.save();
      await receiver.save();
      await mailer(receiverEmail, senderEmail);
      return response(res, 200, "File Shared Successfully", null, true);
    } catch (error) {
      return response(res, 500, "Internal Server Error", null, false);
    }
  }
);

module.exports = router;
