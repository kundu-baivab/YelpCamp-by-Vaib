const express = require("express");
const router = express.Router({ mergeParams: true });
const methodOverride = require("method-override");

const catchAsync = require("../utils/catchAsync");

const { validateReview, isLoggedIn, isReviewAuthor } = require("../middleware");
const reviews = require("../controllers/review");

router.use(express.urlencoded({ extended: true }));
router.use(methodOverride("_method"));

router.post("/", isLoggedIn, validateReview, catchAsync(reviews.createReview));

router.delete(
  "/:reviewid",
  isLoggedIn,
  isReviewAuthor,
  catchAsync(reviews.deleteReview)
);

module.exports = router;
