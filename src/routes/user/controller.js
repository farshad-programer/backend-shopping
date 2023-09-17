import controller from "../controller.js";
import _ from "lodash";

export default new (class extends controller {
  async dashboard(req, res) {
    res.send("user dashboard");
  }

  async me(req, res) {
    this.response({ res, data: _.pick(req.user, ["name", "email"]) })
  }
})();
