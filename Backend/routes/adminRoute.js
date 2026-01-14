import express from 'express';
import jwt from 'jsonwebtoken';
import Admin from '../models/adminModel.js';

const router = express.Router();

// Create default admin if not exists
const createDefaultAdmin = async () => {
    const existing = await Admin.findOne({ username: "abhibhrt" });
    if (!existing) {
        const defaultAdmin = new Admin({
            name: "Abhishek Bharti",
            password: "Bharti%7843"
        });
        await defaultAdmin.save();
    }
    console.log("Hey! Abhishek");
};
createDefaultAdmin();

// Sign-in route
router.post("/signin", async (req, res) => {
    const { username, password } = req.body;

    try {
        const admin = await Admin.findOne({ username });
        if (!admin) return res.status(401).json({ message: "invalid username or password" });

        const isMatch = await admin.matchPassword(password);
        if (!isMatch) return res.status(401).json({ message: "invalid username or password" });

        const token = jwt.sign(
            { id: admin._id, username: admin.username, role: admin.role },
            process.env.JWT_SECRET,
            { expiresIn: "7d" }
        );

        res.json({
            message: "sign-in successful",
            token,
            admin: {
                name: admin.name,
                username: admin.username,
                role: admin.role
            }
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "server error" });
    }
});

// Change password route
router.put("/change-password", async (req, res) => {
    const { username, oldPassword, newPassword, role } = req.body;

    try {
        const admin = await Admin.findOne({ username, role });
        if (!admin) return res.status(404).json({ message: "admin not found" });

        const isMatch = await admin.matchPassword(oldPassword);
        if (!isMatch) return res.status(401).json({ message: "old password is incorrect" });

        admin.password = newPassword; 
        await admin.save();

        res.json({ message: "password changed successfully" });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "server error" });
    }
});

export default router;