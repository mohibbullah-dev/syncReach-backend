import { User } from "../models/User.js";
import { publicUser } from "../utils/auth.js";

export async function listUsers(req, res, next) {
  try {
    const users = await User.find({
      role: { $in: ["SuperAdmin", "Admin"] },
    }).sort({ role: -1, createdAt: 1 });
    res.json(users.map(publicUser));
  } catch (err) {
    next(err);
  }
}

/** SuperAdmin only — create a regular Admin account */
export async function createAdmin(req, res, next) {
  try {
    const { name, email, password, avatarUrl } = req.body;
    if (!name?.trim() || !email?.trim() || !password) {
      return res.status(400).json({ message: "Name, email, and password are required." });
    }
    if (password.length < 6) {
      return res.status(400).json({ message: "Password must be at least 6 characters." });
    }

    const normalized = email.toLowerCase().trim();
    const exists = await User.findOne({ email: normalized });
    if (exists) {
      return res.status(409).json({ message: "An account with this email already exists." });
    }

    const user = await User.create({
      name: name.trim(),
      email: normalized,
      password,
      role: "Admin",
      avatarUrl: avatarUrl?.trim() || "",
    });

    res.status(201).json(publicUser(user));
  } catch (err) {
    next(err);
  }
}

/** SuperAdmin only — delete Admin accounts (not SuperAdmin, not self) */
export async function deleteUser(req, res, next) {
  try {
    const target = await User.findById(req.params.id);
    if (!target) {
      return res.status(404).json({ message: "User not found." });
    }
    if (target._id.toString() === req.user._id.toString()) {
      return res.status(400).json({ message: "You cannot delete your own account." });
    }
    if (target.role === "SuperAdmin") {
      return res.status(403).json({ message: "Super Admin accounts cannot be deleted." });
    }
    if (target.role !== "Admin") {
      return res.status(400).json({ message: "Only Admin accounts can be deleted." });
    }

    await target.deleteOne();
    res.json({ ok: true });
  } catch (err) {
    next(err);
  }
}
