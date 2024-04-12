import {
  express,
  Application,
  Request,
  Response,
  NextFunction,
  SocketIOServer,
  http,
  socketIO,
  cors,
  bodyParser,
  cookieParser,
  authRoutes,
  fileShareRoutes,
} from "./imports";

interface CustomCookieOptions extends cookieParser.CookieParseOptions {
  httpOnly?: boolean;
}

const PORT: number = 8000;
const app: Application = express();
const server: http.Server = http.createServer(app);
const io: SocketIOServer = socketIO(server);

const allowOrigins: string[] = ["http://localhost:3000"];
app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin || allowOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Unreliable CORS Origin"));
      }
    },
    credentials: true,
  })
);

app.use(bodyParser.json());
app.use(
  cookieParser(process.env.TOKEN_SECRET,{
    httpOnly: true,
    secure: true,
    sameSite: "none",
    maxAge: 1000 * 60 * 60 * 24 * 7,
    signed: true,
  } as CustomCookieOptions)
);
app.use("/public", express.static("public"));

app.use((req: Request, res: Response, next: NextFunction) => {
  (req as any).io = io;
  next();
});

app.use("/auth", authRoutes);
app.use("/file", fileShareRoutes);

app.get("/", (req: Request, res: Response) => {
  res.send("Server is Running");
});

server.listen(PORT, () => {
  console.log(`Server is Running at Port ${PORT}`);
});
