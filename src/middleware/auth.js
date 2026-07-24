import jwt from "jsonwebtoken";
import { User } from "../models/User.js";

export async function requireAuth(req, res, next) {
  try {
    const header = req.headers.authorization || "";
    const token = header.startsWith("Bearer ") ? header.slice(7) : null;
    if (!token) {
      return res.status(401).json({ message: "Authentication required." });
    }

    const payload = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(payload.id);
    if (!user) {
      return res.status(401).json({ message: "Invalid session." });
    }

    req.user = user;
    next();
  } catch {
    return res.status(401).json({ message: "Invalid or expired token." });
  }
}

/** CMS access — SuperAdmin or Admin */
export function requireAdmin(req, res, next) {
  if (!req.user || (req.user.role !== "SuperAdmin" && req.user.role !== "Admin")) {
    return res.status(403).json({ message: "Admin access required." });
  }
  next();
}

/** Only SuperAdmin — create/delete staff accounts */
export function requireSuperAdmin(req, res, next) {
  if (!req.user || req.user.role !== "SuperAdmin") {
    return res.status(403).json({ message: "Super Admin access required." });
  }
  next();
}
