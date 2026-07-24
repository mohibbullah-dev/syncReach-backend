import { TeamMember } from "../models/TeamMember.js";

function mapMember(doc) {
  const o = doc.toObject();
  return {
    id: o._id.toString(),
    name: o.name,
    role: o.role,
    img: o.img || "",
    facebookUrl: o.facebookUrl,
    linkedinUrl: o.linkedinUrl,
    sortOrder: o.sortOrder,
    published: o.published,
  };
}

export async function listPublicTeam(req, res, next) {
  try {
    const items = await TeamMember.find({ published: true }).sort({ sortOrder: 1 });
    res.json(items.map(mapMember));
  } catch (err) {
    next(err);
  }
}

export async function listTeam(req, res, next) {
  try {
    const items = await TeamMember.find().sort({ sortOrder: 1 });
    res.json(items.map(mapMember));
  } catch (err) {
    next(err);
  }
}

export async function createTeamMember(req, res, next) {
  try {
    const item = await TeamMember.create(req.body);
    res.status(201).json(mapMember(item));
  } catch (err) {
    next(err);
  }
}

export async function updateTeamMember(req, res, next) {
  try {
    const item = await TeamMember.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!item) return res.status(404).json({ message: "Team member not found." });
    res.json(mapMember(item));
  } catch (err) {
    next(err);
  }
}

export async function deleteTeamMember(req, res, next) {
  try {
    const item = await TeamMember.findByIdAndDelete(req.params.id);
    if (!item) return res.status(404).json({ message: "Team member not found." });
    res.json({ ok: true });
  } catch (err) {
    next(err);
  }
}
