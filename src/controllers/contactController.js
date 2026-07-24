import { ContactMessage } from "../models/ContactMessage.js";

function mapMessage(doc) {
  const o = doc.toObject();
  return {
    id: o._id.toString(),
    name: o.name,
    email: o.email,
    company: o.company || "",
    message: o.message,
    read: Boolean(o.read),
    createdAt: o.createdAt,
  };
}

/** Public contact form — no auth */
export async function createContactMessage(req, res, next) {
  try {
    const { name, email, company, message } = req.body || {};
    if (!name?.trim() || !email?.trim() || !message?.trim()) {
      return res.status(400).json({ message: "Name, email, and message are required." });
    }
    const item = await ContactMessage.create({
      name: name.trim(),
      email: email.trim(),
      company: (company || "").trim(),
      message: message.trim(),
    });
    res.status(201).json({ ok: true, id: item._id.toString() });
  } catch (err) {
    next(err);
  }
}

export async function listContactMessages(req, res, next) {
  try {
    const items = await ContactMessage.find().sort({ createdAt: -1 });
    res.json(items.map(mapMessage));
  } catch (err) {
    next(err);
  }
}

export async function markContactRead(req, res, next) {
  try {
    const item = await ContactMessage.findByIdAndUpdate(
      req.params.id,
      { read: true },
      { new: true },
    );
    if (!item) return res.status(404).json({ message: "Message not found." });
    res.json(mapMessage(item));
  } catch (err) {
    next(err);
  }
}

export async function deleteContactMessage(req, res, next) {
  try {
    const item = await ContactMessage.findByIdAndDelete(req.params.id);
    if (!item) return res.status(404).json({ message: "Message not found." });
    res.json({ ok: true });
  } catch (err) {
    next(err);
  }
}
