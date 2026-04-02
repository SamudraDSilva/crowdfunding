import mongoose from "mongoose";
import bcrypt from "bcrypt";
import User from "./models/User.js";
import Campaign from "./models/Campaign.js";
import Transaction from "./models/Transaction.js";
import Favorite from "./models/Favourite.js";
import Notification from "./models/Notification.js";
import dotenv from "dotenv";

dotenv.config();

const MONGO_URI =
  process.env.MONGO_URI || "mongodb://localhost:27017/yourdbname";
const PASSWORD = "Qwert1234!2";

const hashPassword = async (plain) => {
  const salt = await bcrypt.genSalt(10);
  return bcrypt.hash(plain, salt);
};

// ─── Users ────────────────────────────────────────────────────────────────────

const usersData = [
  {
    username: "admin",
    email: "admin@crowdfunding.lk",
    role: "admin",
    rank: "Platinum",
  },
  {
    username: "nimal_silva",
    email: "nimal.silva@gmail.com",
    role: "user",
    rank: "Bronze",
  },
  {
    username: "kumari_perera",
    email: "kumari.perera@yahoo.com",
    role: "user",
    rank: "Bronze",
  },
  {
    username: "sahan_fernando",
    email: "sahan.fernando@hotmail.com",
    role: "user",
    rank: "Bronze",
  },
  {
    username: "dilani_jayawardena",
    email: "dilani.jaya@gmail.com",
    role: "user",
    rank: "Bronze",
  },
  {
    username: "kasun_rajapaksa",
    email: "kasun.raja@gmail.com",
    role: "user",
    rank: "Bronze",
  },
  {
    username: "chamari_wickrama",
    email: "chamari.wick@gmail.com",
    role: "user",
    rank: "Bronze",
  },
];

// ─── Campaigns (5) ────────────────────────────────────────────────────────────
// image field stores the relative path exactly as multer saves it to disk.

const campaignsRaw = [
  {
    title: "Clean Water for Rural Communities",
    subtitle:
      "Providing safe drinking water access to underserved villages across Sri Lanka.",
    category: "Health",
    subcategory: "WASH",
    image: "assets\\images\\1741159224381-Water.png",
    endDate: new Date("2025-09-30"),
    goalAmount: 3500000,
    projectStory:
      "Thousands of rural families across Sri Lanka still rely on contaminated streams and unprotected wells for drinking water, leading to widespread waterborne illness especially among children. This campaign will fund the installation of 15 community water purification units and 3 km of clean distribution pipe, bringing safe tap water to over 3,000 people for the first time. Every rupee goes directly toward materials, installation, and a trained local maintenance team to keep the system running for years to come.",
    status: "Active",
    ownerIndex: 1,
  },
  {
    title: "Reviving Sri Lanka's Small-Scale Farmers",
    subtitle:
      "Empowering paddy and vegetable farmers in the North with tools, training, and fair markets.",
    category: "Food",
    subcategory: "Agriculture",
    image: "assets\\images\\1741159312650-agriculture.jpg",
    endDate: new Date("2025-10-15"),
    goalAmount: 2000000,
    projectStory:
      "Small-scale paddy farmers in the Northern and North-Central provinces face a perfect storm of rising input costs, unpredictable rainfall, and no access to fair markets. Many are forced to sell their harvest at a loss to middlemen. This campaign will provide 150 farming families with quality seeds, modern hand tools, and a 3-month agri-training programme, while connecting them directly to Colombo supermarkets and export cooperatives — tripling their average take-home income.",
    status: "Active",
    ownerIndex: 2,
  },
  {
    title: "Rebuild Flood-Hit Schools in Matara",
    subtitle:
      "Restoring classrooms and learning materials for 800 students after devastating monsoon floods.",
    category: "Education",
    subcategory: "School Restoration",
    image: "assets\\images\\1741159887907-flood.jpg",
    endDate: new Date("2025-08-31"),
    goalAmount: 2500000,
    projectStory:
      "The 2024 monsoon floods submerged several primary schools in Matara district, destroying classrooms, furniture, and entire libraries. Over 800 students are currently sharing a single undamaged building in shifts, severely disrupting their education. Funds raised will go toward waterproofing and rebuilding damaged classrooms, replacing desks and learning materials, and installing flood-resilient drainage around school grounds so this never happens again.",
    status: "Active",
    ownerIndex: 3,
  },
  {
    title: "Protect Sri Lanka's Elephant Orphanage",
    subtitle:
      "Funding veterinary care, feed, and habitat expansion for rescued elephants at Pinnawala.",
    category: "Environment",
    subcategory: "Wildlife Conservation",
    image: "assets\\images\\1741160840319-Elephant-Orphanage.jpg",
    endDate: new Date("2026-01-15"),
    goalAmount: 5000000,
    projectStory:
      "The Pinnawala Elephant Orphanage is home to over 90 rescued and orphaned elephants, many of whom were injured by human-wildlife conflict or separated from their herds. Underfunding has strained veterinary resources and limited the ability to expand safe grazing land. This campaign will cover one full year of medical care, nutritional feed supplements for calves, and the acquisition of 5 acres of adjacent land to give the herd more natural roaming space — ensuring Pinnawala remains a world-class sanctuary.",
    status: "Active",
    ownerIndex: 4,
  },
  {
    title: "RoboHub: Sri Lanka's First Youth Robotics Lab",
    subtitle:
      "Building a free robotics and AI learning centre for school students in Colombo.",
    category: "Technology",
    subcategory: "STEM Education",
    image: "assets\\images\\1741161983369-RoboHub.jpeg",
    endDate: new Date("2025-11-30"),
    goalAmount: 3000000,
    projectStory:
      "Sri Lanka's tech industry is growing rapidly, but students from low-income schools have almost no exposure to robotics, coding, or artificial intelligence. RoboHub will be the country's first free, community-run robotics lab — open to all school students aged 10 to 18. Funds will cover 20 robot kits, computers, 3D printers, instructor salaries for one year, and weekend workshops led by university engineers. The first 200 students will receive a certified completion badge recognised by local tech companies.",
    status: "Active",
    ownerIndex: 5,
  },
];

// ─── Transactions: [donorIndex, campaignIndex, amount] ────────────────────────

const transactionsRaw = [
  // Campaign 0 — Clean Water
  [1, 0, 150000],
  [2, 0, 250000],
  [3, 0, 500000],
  [6, 0, 300000],
  // Campaign 1 — Farmers
  [1, 1, 100000],
  [4, 1, 350000],
  [5, 1, 500000],
  [6, 1, 200000],
  // Campaign 2 — Flood Schools
  [2, 2, 200000],
  [3, 2, 400000],
  [5, 2, 600000],
  [6, 2, 250000],
  // Campaign 3 — Elephant Orphanage
  [1, 3, 500000],
  [2, 3, 800000],
  [4, 3, 1000000],
  [6, 3, 700000],
  // Campaign 4 — RoboHub
  [3, 4, 300000],
  [4, 4, 450000],
  [5, 4, 700000],
];

// ─── Favorites: [userIndex, campaignIndex] ────────────────────────────────────

const favoritesRaw = [
  [1, 2],
  [1, 4],
  [2, 0],
  [2, 3],
  [3, 1],
  [3, 4],
  [4, 0],
  [4, 2],
  [5, 3],
  [5, 1],
  [6, 0],
  [6, 4],
];

// ─── Helpers ──────────────────────────────────────────────────────────────────

const getRank = (total) => {
  if (total >= 1000000) return "Platinum";
  if (total >= 500000) return "Gold";
  if (total >= 30000) return "Silver";
  return "Bronze";
};

// ─── Seed ─────────────────────────────────────────────────────────────────────

const seed = async () => {
  await mongoose.connect(MONGO_URI);
  console.log("✅ Connected to MongoDB");

  await Promise.all([
    User.deleteMany({}),
    Campaign.deleteMany({}),
    Transaction.deleteMany({}),
    Favorite.deleteMany({}),
    Notification.deleteMany({}),
  ]);
  console.log("🗑️  Cleared existing collections");

  // ── Users ──
  const hashedPassword = await hashPassword(PASSWORD);
  const createdUsers = await User.insertMany(
    usersData.map((u) => ({ ...u, password: hashedPassword })),
  );
  console.log(`👤 Created ${createdUsers.length} users`);

  // ── Campaigns — progress: 0, synced from transactions below ──
  const createdCampaigns = await Campaign.insertMany(
    campaignsRaw.map(({ ownerIndex, ...c }) => ({
      ...c,
      progress: 0,
      owner: createdUsers[ownerIndex]._id,
    })),
  );
  console.log(`📢 Created ${createdCampaigns.length} campaigns`);

  // ── Transactions ──
  await Transaction.insertMany(
    transactionsRaw.map(([donorIdx, campaignIdx, amount]) => ({
      donor: createdUsers[donorIdx]._id,
      campaign: createdCampaigns[campaignIdx]._id,
      amount,
    })),
  );
  console.log(`💸 Created ${transactionsRaw.length} transactions`);

  // ── Sync campaign.progress from transactions (single source of truth) ──
  const campaignTotals = {};
  for (const [, campaignIdx, amount] of transactionsRaw) {
    campaignTotals[campaignIdx] = (campaignTotals[campaignIdx] || 0) + amount;
  }
  await Promise.all(
    Object.entries(campaignTotals).map(([idx, total]) =>
      Campaign.findByIdAndUpdate(createdCampaigns[Number(idx)]._id, {
        progress: total,
      }),
    ),
  );
  console.log(
    `📊 Synced progress for ${Object.keys(campaignTotals).length} campaigns from transactions`,
  );

  // ── Donor ranks ──
  const donorTotals = {};
  for (const [donorIdx, , amount] of transactionsRaw) {
    donorTotals[donorIdx] = (donorTotals[donorIdx] || 0) + amount;
  }
  const notifications = [];
  for (const [donorIdxStr, total] of Object.entries(donorTotals)) {
    const idx = Number(donorIdxStr);
    const rank = getRank(total);
    const user = createdUsers[idx];
    if (rank !== "Bronze") {
      await User.findByIdAndUpdate(user._id, { rank });
      notifications.push({
        userId: user._id,
        message: `Congratulations! Your rank has been updated to ${rank}.`,
      });
    }
  }
  if (notifications.length) {
    await Notification.insertMany(notifications);
    console.log(`🔔 Created ${notifications.length} rank-update notifications`);
  }

  // ── Favorites ──
  await Favorite.insertMany(
    favoritesRaw.map(([userIdx, campaignIdx]) => ({
      user: createdUsers[userIdx]._id,
      campaign: createdCampaigns[campaignIdx]._id,
    })),
  );
  console.log(`❤️  Created ${favoritesRaw.length} favorites`);

  console.log("\n🌱 Seed complete!");
  console.log(`   Password for all users : ${PASSWORD}`);
  console.log(`   Admin email            : ${usersData[0].email}`);
  console.log("\n   Campaigns seeded:");
  campaignsRaw.forEach((c, i) =>
    console.log(`   [${i}] ${c.title}  →  ${c.image}`),
  );
  await mongoose.disconnect();
};

seed().catch((err) => {
  console.error("❌ Seed failed:", err);
  mongoose.disconnect();
  process.exit(1);
});
