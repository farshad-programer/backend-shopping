import mongoose from "mongoose";
import debug from "debug";
debug("app:main");
import config from "config";

export default function () {
  mongoose
    .connect(config.get("db.address"))
    .then(() => debug("connected to mongodb"))
    .catch(() => debug("could not connect"));
}
