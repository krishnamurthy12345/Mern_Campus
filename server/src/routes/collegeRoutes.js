
const express = require("express");
const router = express.Router();

const auth = require("../middleware/auth");
const authorize = require("../middleware/authorize");
const validate = require("../middleware/validate");

const {
  createCollege,
  getColleges,
  getCollegeById,
  updateCollege,
  deleteCollege,
} = require("../controllers/collegeController");

const {
  createCollegeSchema,
  updateCollegeSchema,
} = require("../validators/collegeValidator");

router.get("/", getColleges);
router.get("/:id", getCollegeById);

router.post(
  "/",
  auth,
  authorize("admin"),
  validate(createCollegeSchema),
  createCollege
);

router.patch(
  "/:id",
  auth,
  authorize("admin"),
  validate(updateCollegeSchema),
  updateCollege
);

router.delete(
  "/:id",
  auth,
  authorize("admin"),
  deleteCollege
);

module.exports = router;
