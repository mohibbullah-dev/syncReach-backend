import { User } from "../models/User.js";
import { publicUser, signToken } from "../utils/auth.js";

/** Public self-signup is disabled — Super Admin creates staff accounts. */
export async function signup(_req, res) {
  return res.status(403).json({
    message: "Public sign-up is disabled. Ask a Super Admin to create your account.",
  });
}

export async function login(req, res, next) {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email: (email || "").toLowerCase().trim() });
    if (!user || !(await user.comparePassword(password || ""))) {
      return res.status(401).json({ message: "Invalid email or password." });
    }
    if (user.role !== "SuperAdmin" && user.role !== "Admin") {
      return res.status(403).json({ message: "Admin access required." });
    }
    const token = signToken(user);
    res.json({ token, user: publicUser(user) });
  } catch (err) {
    next(err);
  }
}

export async function me(req, res) {
  res.json({ user: publicUser(req.user) });
}

export async function updateProfile(req, res, next) {
  try {
    const { name, email, avatarUrl, password } = req.body;
    const user = req.user;

    if (name !== undefined) user.name = String(name).trim();
    if (email !== undefined) {
      const nextEmail = String(email).toLowerCase().trim();
      const taken = await User.findOne({ email: nextEmail, _id: { $ne: user._id } });
      if (taken) {
        return res.status(409).json({ message: "Another account already uses this email." });
      }
      user.email = nextEmail;
    }
    if (avatarUrl !== undefined) {
      user.avatarUrl = avatarUrl === null ? "" : String(avatarUrl).trim();
    }
    if (password) {
      if (password.length < 6) {
        return res.status(400).json({ message: "Password must be at least 6 characters." });
      }
      user.password = password;
    }

    await user.save();
    const token = signToken(user);
    res.json({ token, user: publicUser(user) });
  } catch (err) {
    next(err);
  }
}
