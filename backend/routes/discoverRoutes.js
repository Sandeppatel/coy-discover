
const express = require("express");
const router = express.Router();

const {
    getFeed,
    swipeProfile,
    getMatches
} = require("../controllers/discoverController");

// GET all undiscovered profiles
router.get("/feed", getFeed);

// POST like or pass
router.post("/swipe", swipeProfile);

// GET mutual matches
router.get("/matches", getMatches);

module.exports = router;
