const express = require("express");
const router = express.Router();
const methodOverride = require("method-override");

const campgrounds = require("../controllers/campground");

const catchAsync = require("../utils/catchAsync");

const { isLoggedIn, validateCampground, isAuthor } = require("../middleware");
const { campgroundSchema } = require("../schemas");

router.use(express.urlencoded({ extended: true }));
router.use(methodOverride("_method"));


router.route('/')
    .get(catchAsync(campgrounds.index))
    .post(
        isLoggedIn,
        validateCampground,
        catchAsync(campgroundSchema.createCampground)
    )

router.get("/new", isLoggedIn, campgrounds.renderNewForm);

router.route('/:id')
    .get(catchAsync(campgrounds.showCampground))
    .put(
        isLoggedIn,
        isAuthor,
        validateCampground,
        catchAsync(campgrounds.editCampground)
    )
    .delete(
        isLoggedIn,
        isAuthor,
        catchAsync(campgrounds.deleteCampground)
    )
    
router.get(
    "/:id/edit",
    isLoggedIn,
    isAuthor,
    catchAsync(campgrounds.renderEditForm)
);


module.exports = router;
