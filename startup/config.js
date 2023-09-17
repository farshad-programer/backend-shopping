import corsOptions from "../config/corsOptions.js";

export default function (app, express, cookieParser, cors, credentials,fileUpload) {
  app.use(credentials);
  app.use(cors(corsOptions));
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));
  app.use(cookieParser());
  app.use(fileUpload({ useTempFiles: true }));
  app.use(express.static("public"));
}
