
const fs = require("fs");
const path = require("path");

// Database file path
const dbPath = path.join(__dirname, "../data/db.json");

// Read database
const getDatabase = () => {
    const data = fs.readFileSync(dbPath, "utf-8");
    return JSON.parse(data);
};

// GET /feed
const getFeed = (req, res) => {
    try {
        const db = getDatabase();

        // Get already swiped profile IDs
        const swipedProfileIds = db.swipes
            .filter(swipe => swipe.userId === db.currentUser.id)
            .map(swipe => swipe.profileId);

        // Return only profiles not yet swiped on
        const feed = db.profiles
            .filter(profile => !swipedProfileIds.includes(profile.id))
            .map(({ likedYou, ...publicProfile }) => publicProfile);

        res.status(200).json({
            success: true,
            count: feed.length,
            profiles: feed
        });

    } catch (error) {
        console.error("Feed Error:", error);

        res.status(500).json({
            success: false,
            message: "Failed to fetch profiles"
        });
    }
};


const saveDatabase = (db) => {
    fs.writeFileSync(dbPath, JSON.stringify(db, null, 2));
};

// POST /swipe
const swipeProfile = (req, res) => {
    try {
        const { profileId, action } = req.body;
        const db = getDatabase();

        if (!profileId || !["like", "pass"].includes(action)) {
            return res.status(400).json({
                success: false,
                message: "Valid profileId and action are required"
            });
        }

        const profile = db.profiles.find(p => p.id === profileId);

        if (!profile) {
            return res.status(404).json({
                success: false,
                message: "Profile not found"
            });
        }

        const alreadySwiped = db.swipes.some(
            swipe =>
                swipe.userId === db.currentUser.id &&
                swipe.profileId === profileId
        );

        if (alreadySwiped) {
            return res.status(409).json({
                success: false,
                message: "You have already swiped on this profile"
            });
        }

        // Record the swipe
        db.swipes.push({
            userId: db.currentUser.id,
            profileId,
            action,
            createdAt: new Date().toISOString()
        });

        let isMatch = false;

        // Check mutual like
        if (action === "like" && profile.likedYou === true) {
            isMatch = true;

            db.matches.push({
                id: `match-${profileId}`,
                userId: db.currentUser.id,
                profileId,
                createdAt: new Date().toISOString()
            });
        }

        saveDatabase(db);

        res.status(200).json({
            success: true,
            action,
            isMatch,
            match: isMatch
                ? {
                    id: profile.id,
                    name: profile.name,
                    photo: profile.photo
                }
                : null
        });

    } catch (error) {
        console.error("Swipe Error:", error);

        res.status(500).json({
            success: false,
            message: "Failed to record swipe"
        });
    }
};

// GET /matches
const getMatches = (req, res) => {
    try {
        const db = getDatabase();

        // Get matches belonging to current user
        const userMatches = db.matches.filter(
            match => match.userId === db.currentUser.id
        );

        // Get matched profile details
        const matches = userMatches.map(match => {
            const profile = db.profiles.find(
                p => p.id === match.profileId
            );

            if (!profile) return null;

            const { likedYou, ...publicProfile } = profile;

            return {
                matchId: match.id,
                matchedAt: match.createdAt,
                ...publicProfile
            };
        }).filter(Boolean);

        res.status(200).json({
            success: true,
            count: matches.length,
            matches
        });

    } catch (error) {
        console.error("Matches Error:", error);

        res.status(500).json({
            success: false,
            message: "Failed to fetch matches"
        });
    }
};

module.exports = { getFeed, swipeProfile, getMatches };
