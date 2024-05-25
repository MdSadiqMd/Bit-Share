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
  errorHandler,
} from "../imports";
import authTokenHandler from "../middlewares/authTokenhandler";
const {
  S3Client,
  GetObjectCommand,
  PutObjectCommand,
} = require("@aws-sdk/client-s3");
const { getSignedUrl } = require("@aws-sdk/s3-request-presigner");
const dotenv = require("dotenv");
dotenv.config();
require("dotenv").config();

interface IGetUserAuthInfoRequest extends Request {
  user: string;
}

const s3Client = new S3Client({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
});

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

const getObjectURL = async (key: string): Promise<string> => {
  const params = {
    Bucket: process.env.AWS_BUCKET_NAME as string,
    Key: key,
  };
  return await getSignedUrl(s3Client, new GetObjectCommand(params));
};

const postObjectURL = async (
  filename: string,
  contentType: string
): Promise<string> => {
  const params = {
    Bucket: process.env.AWS_BUCKET_NAME as string,
    Key: filename,
    ContentType: contentType,
  };
  return await getSignedUrl(s3Client, new PutObjectCommand(params));
};

router.get(
  "/generatepostobjecturl",
  authTokenHandler,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const timeinms = new Date().getTime();
      const signedUrl = await postObjectURL(timeinms.toString(), "");
      return response(
        res,
        200,
        "signed url generated",
        {
          signedUrl: signedUrl,
          filekey: timeinms.toString(),
        },
        true
      );
    } catch (err) {
      next(err);
    }
  }
);

/*
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
  upload.single("filename")(req, res, (err: any) => {
    if (err) {
      return response(res, 400, "file Upload Failed", null, false);
    }
    next();
  });
};
*/

router.get("/test", (req, res) => {
  res.send("File Share Routes Testing");
});

router.post(
  "/sharefile",
  authTokenHandler,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { senderEmail, receiverEmail, filename, fileKey, fileType } =
        req.body;
      console.log(req.body);
      let sender = await userModel.findOne({ email: senderEmail });
      let receiver = await userModel.findOne({ email: receiverEmail });
      if (!sender) {
        return response(
          res,
          400,
          "You need to Login to Share the Files",
          null,
          false
        );
      }
      if (!receiver) {
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
        fileURL: fileKey,
        fileType: fileType,
        fileName: filename ? filename : Date.now().toLocaleString(),
        sharedAt: Date.now(),
      });
      receiver.files.push({
        senderEmail: senderEmail,
        receiverEmail: receiverEmail,
        fileURL: fileKey,
        fileType: fileType,
        fileName: filename ? filename : Date.now().toLocaleString(),
        sharedAt: Date.now(),
      });
      await sender.save();
      await receiver.save();
      await mailer(receiverEmail, senderEmail);
      return response(res, 200, "File Shared Successfully", null, true);
    } catch (error) {
      console.log(error);
      return response(res, 500, "Internal Server Error", null, false);
    }
  }
);

router.get(
  "/getfiles",
  authTokenHandler,
  async (req: any, res: Response, next: NextFunction) => {
    try {
      let user = await userModel.findOne({ _id: req.userId });
      //console.log("user in get files",user);
      if (!user) {
        return response(res, 400, "User not found", null, false);
      }
      return response(res, 200, "files fetched successfully", user.files, true);
    } catch (err) {
      console.log(err);
      return response(res, 500, "Internal Server Error", null, false);
    }
  }
);

export default router;
