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

const app: Application = express();
const server: http.Server = http.createServer(app);
const io: SocketIOServer = socketIO(server);

const allowOrigins: string[] = ["http://localhost:3000"];
app.use(
  cors({
    origin: function (origin, callback) {
      if (origin && allowOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Unreliable CORS Origin"));
      }
    },
    credentials: true,
  })
);

app.use(bodyParser.json());
app.use(cookieParser());
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

const PORT: number = 8000;
server.listen(PORT, () => {
  console.log(`Server is Running at Port ${PORT}`);
});
