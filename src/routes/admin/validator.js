import { check as _check } from "express-validator";
const check = _check;

export default new (class {
  postValidator() {
    return [
      check("price")
        .not()
        .isEmpty()
        .withMessage("price can not empty")
        .isNumeric("price must be number"),

      check("count")
        .isNumeric().withMessage("price can not empty")
        .not()
        .isEmpty()
        .withMessage("price can not empty"),
      check("name")
        .not()
        .isEmpty()
        .withMessage("name of product cant be empty"),
      check("category").not().isEmpty().withMessage("category cant be empty"),
      check("description")
        .not()
        .isEmpty()
        .withMessage("description cant be empty"),
      check("images").not().isEmpty().withMessage("image cant be empty"),
    ];
  }
})();
