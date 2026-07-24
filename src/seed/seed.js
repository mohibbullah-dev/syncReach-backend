import "dotenv/config";
import { connectDB } from "../config/db.js";
import { User } from "../models/User.js";
import { Review } from "../models/Review.js";
import { GalleryItem } from "../models/GalleryItem.js";
import { TeamMember } from "../models/TeamMember.js";

async function seed() {
  await connectDB(process.env.MONGODB_URI);

  const email = (process.env.SEED_ADMIN_EMAIL || "admin@syncreach.com").toLowerCase();
  const existing = await User.findOne({ email });
  if (!existing) {
    await User.create({
      name: process.env.SEED_ADMIN_NAME || "Sabid Khan",
      email,
      password: process.env.SEED_ADMIN_PASSWORD || "admin123",
      role: "Admin",
    });
    console.log(`Admin created: ${email}`);
  } else {
    console.log(`Admin already exists: ${email}`);
  }

  if ((await Review.countDocuments()) === 0) {
    await Review.insertMany([
      {
        type: "text",
        name: "Amina Rahman",
        username: "@amina",
        role: "Head of Growth · SaaS agency",
        avatar: "",
        body: "We went from 3 meetings a week to 3 a day. SyncReach paid for itself in 11 days.",
        rating: 5,
        featured: true,
        published: true,
      },
      {
        type: "video",
        name: "Jordan Lee",
        username: "@jordan",
        role: "Founder · B2B startup",
        avatar: "",
        body: "The personalization is spot-on. Prospects reply asking who wrote it — our team did.",
        mediaUrl: "https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4",
        thumbnailUrl: "https://images.unsplash.com/photo-1557804506-669a67965ba0?w=640&q=80",
        rating: 5,
        featured: true,
        published: true,
      },
    ]);
    console.log("Sample reviews seeded");
  }

  if ((await GalleryItem.countDocuments()) === 0) {
    await GalleryItem.create({
      type: "photo",
      title: "Outbound war room",
      caption: "Daily pipeline huddle",
      src: "https://images.unsplash.com/photo-1556761175-b413da4baf72?w=900&q=80",
      featured: true,
      sortOrder: 1,
      published: true,
    });
    console.log("Sample gallery seeded");
  }

  if ((await TeamMember.countDocuments()) === 0) {
    await TeamMember.insertMany([
      {
        name: "Md Sabid Khan",
        role: "Co-Founder & CEO",
        img: "",
        sortOrder: 1,
        published: true,
      },
      {
        name: "Safiq Ahmed",
        role: "Co-Founder & CTO",
        img: "",
        sortOrder: 2,
        published: true,
      },
    ]);
    console.log("Sample team seeded");
  }

  console.log("Seed complete.");
  process.exit(0);
}

seed().catch((err) => {
  console.error(err);
  process.exit(1);
});
