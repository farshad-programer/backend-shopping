import corsOptions from "../config/corsOptions.js";

export default function (
  app,
  express,
  cookieParser,
  cors,
  credentials,
  fileUpload
) {
  app.use(credentials);
  app.use(cors(corsOptions));
  app.use(express.json({ limit: "50mb" }));
  app.use(express.urlencoded({ limit: "50mb", extended: true }));
  app.use(cookieParser());
}



