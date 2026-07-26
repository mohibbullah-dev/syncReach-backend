import "dotenv/config";
import { connectDB } from "../config/db.js";
import { User } from "../models/User.js";
import { Review } from "../models/Review.js";
import { GalleryItem } from "../models/GalleryItem.js";
import { TeamMember } from "../models/TeamMember.js";
import { PricingPlan, defaultCustomConfig } from "../models/PricingPlan.js";

async function seed() {
  await connectDB(process.env.MONGODB_URI);

  const name = process.env.SEED_ADMIN_NAME || "MD Shofiq";
  const email = (process.env.SEED_ADMIN_EMAIL || "safiq3d@gmail.com").toLowerCase();
  const password = process.env.SEED_ADMIN_PASSWORD || "admin123";
  const legacyEmails = ["admin@syncreach.com"];

  let existing = await User.findOne({ email });

  // Migrate previous seed Super Admin email → new credentials (password unchanged)
  if (!existing) {
    for (const legacy of legacyEmails) {
      if (legacy === email) continue;
      const old = await User.findOne({ email: legacy });
      if (old) {
        old.name = name;
        old.email = email;
        old.role = "SuperAdmin";
        await old.save();
        existing = old;
        console.log(`Super Admin migrated: ${legacy} → ${email}`);
        break;
      }
    }
  }

  if (!existing) {
    await User.create({
      name,
      email,
      password,
      role: "SuperAdmin",
    });
    console.log(`Super Admin created: ${email}`);
  } else {
    existing.name = name;
    existing.role = "SuperAdmin";
    await existing.save();
    console.log(`Super Admin ready: ${name} <${email}>`);
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
        name: "Md Sabid KhaSafiq",
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

  // Remove free-trial / credit-card copy from any existing plans
  const trialCleanup = await PricingPlan.updateMany(
    {
      $or: [
        { extrasBadge: /free trial/i },
        { extrasNote: /credit card/i },
      ],
    },
    { $set: { extrasBadge: "", extrasNote: "" } },
  );
  if (trialCleanup.modifiedCount) {
    console.log(`Cleared free-trial extras on ${trialCleanup.modifiedCount} plan(s)`);
  }

  if ((await PricingPlan.countDocuments()) === 0) {
    await PricingPlan.insertMany([
      {
        badge: "STARTER",
        name: "Starter",
        desc: "For founders launching outbound and validating their offer.",
        price: "$500",
        unit: "/ month",
        extrasBadge: "",
        extrasNote: "",
        features: [
          "5,000 emails / mo",
          "5 warmed inboxes",
          "Email copywriter",
          "Lead finder (2k credits)",
          "Basic analytics",
          "Email support",
        ],
        cta: "Start with Starter",
        featured: false,
        sortOrder: 1,
        published: true,
        planType: "fixed",
      },
      {
        badge: "MOST POPULAR",
        name: "Growth",
        desc: "For growing teams booking qualified meetings every week.",
        price: "$1,000",
        unit: "/ month",
        extrasBadge: "Unlimited warmed inboxes",
        extrasNote: "Best value for scaling outbound teams",
        features: [
          "25,000 emails / mo",
          "Unlimited warmed inboxes",
          "Personalization + LinkedIn",
          "Multi-channel sequences",
          "10k lead credits",
          "CRM integrations",
          "Priority support",
        ],
        cta: "Choose Growth",
        featured: true,
        sortOrder: 2,
        published: true,
        planType: "fixed",
      },
      {
        badge: "CUSTOM",
        name: "Custom",
        desc: "Build your own outbound stack — pick volume, seats, and add-ons.",
        price: "Custom",
        unit: "/ month",
        extrasBadge: "",
        extrasNote: "",
        features: [
          "Flexible email volume",
          "Warmed inboxes on demand",
          "Seats for your team",
          "Optional LinkedIn outreach",
          "Dedicated success support",
        ],
        cta: "Get this quote",
        featured: false,
        sortOrder: 3,
        published: true,
        planType: "custom",
        customConfig: defaultCustomConfig(),
      },
    ]);
    console.log("Sample pricing seeded");
  }

  // Migrate legacy Scale plan → Custom quote builder
  const scale = await PricingPlan.findOne({
    $or: [{ name: /^scale$/i }, { badge: /^scale$/i }],
    planType: { $ne: "custom" },
  });
  if (scale) {
    scale.badge = "CUSTOM";
    scale.name = "Custom";
    scale.desc = "Build your own outbound stack — pick volume, seats, and add-ons.";
    scale.price = "Custom";
    scale.unit = "/ month";
    scale.extrasBadge = "";
    scale.extrasNote = "";
    scale.features = [
      "Flexible email volume",
      "Warmed inboxes on demand",
      "Seats for your team",
      "Optional LinkedIn outreach",
      "Dedicated success support",
    ];
    scale.cta = "Get this quote";
    scale.planType = "custom";
    scale.customConfig = defaultCustomConfig();
    scale.markModified("customConfig");
    await scale.save();
    console.log("Migrated Scale → Custom quote plan");
  }

  // Upgrade existing Custom-named plans that were saved as fixed (missing config)
  const customLike = await PricingPlan.find({
    planType: { $ne: "custom" },
    $or: [
      { badge: /^custom$/i },
      { name: /^custom$/i },
      { price: /^custom$/i },
    ],
  });
  for (const plan of customLike) {
    plan.planType = "custom";
    if (!plan.customConfig?.levers?.length) {
      plan.customConfig = defaultCustomConfig();
      plan.markModified("customConfig");
    }
    if (!plan.cta || !/quote/i.test(plan.cta)) plan.cta = "Get this quote";
    await plan.save();
    console.log(`Upgraded "${plan.name}" → custom quote builder`);
  }

  if (!(await PricingPlan.findOne({ planType: "custom" }))) {
    await PricingPlan.create({
      badge: "CUSTOM",
      name: "Custom",
      desc: "Build your own outbound stack — pick volume, seats, and add-ons.",
      price: "Custom",
      unit: "/ month",
      features: [
        "Flexible email volume",
        "Warmed inboxes on demand",
        "Seats for your team",
        "Optional LinkedIn outreach",
        "Dedicated success support",
      ],
      cta: "Get this quote",
      featured: false,
      sortOrder: 3,
      published: true,
      planType: "custom",
      customConfig: defaultCustomConfig(),
    });
    console.log("Custom quote plan created");
  }

  // Ensure every custom plan has levers (empty config breaks public UI)
  const customs = await PricingPlan.find({ planType: "custom" });
  for (const plan of customs) {
    if (!plan.customConfig?.levers?.length) {
      plan.customConfig = defaultCustomConfig();
      plan.markModified("customConfig");
      await plan.save();
      console.log(`Restored customConfig for "${plan.name}"`);
    }
  }

  console.log("Seed complete.");
  process.exit(0);
}

seed().catch((err) => {
  console.error(err);
  process.exit(1);
});
