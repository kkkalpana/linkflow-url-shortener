require("dotenv").config();

const mongoose = require("mongoose");
const connectDB = require("./config/db");
const User = require("./models/User");
const Url = require("./models/Url");
const Click = require("./models/Click");

const demoEmailPattern = /^demo\.\d+@linkflow\.local$/;
const demoCodePattern = /^demo-\d+$/;

const demoUsers = Array.from({ length: 8 }, (_, index) => ({
  name: [
    "Ava Morgan",
    "Noah Williams",
    "Mia Chen",
    "Liam Patel",
    "Sofia Garcia",
    "Ethan Brooks",
    "Isla Wilson",
    "Leo Martin",
  ][index],
  email: `demo.${String(index + 1).padStart(2, "0")}@linkflow.local`,
  password: "DemoPass123!",
}));

const destinationUrls = [
  "https://github.com/",
  "https://developer.mozilla.org/",
  "https://www.npmjs.com/",
  "https://vercel.com/docs",
  "https://render.com/docs",
  "https://www.mongodb.com/docs/",
  "https://redis.io/docs/latest/",
  "https://expressjs.com/",
  "https://react.dev/",
  "https://vite.dev/guide/",
  "https://nodejs.org/en/learn",
  "https://www.chartjs.org/docs/latest/",
];

const referrers = [
  "Direct",
  "Google",
  "GitHub",
  "LinkedIn",
  "Twitter",
  "Product Hunt",
];
const browsers = ["Chrome", "Safari", "Firefox", "Edge"];
const operatingSystems = ["macOS", "Windows", "iOS", "Android", "Linux"];
const devices = ["Desktop", "Desktop", "Mobile", "Mobile", "Tablet"];
const countries = [
  "United States",
  "Canada",
  "United Kingdom",
  "Germany",
  "India",
  "Australia",
];

const requireConfirmation = () => {
  if (!process.argv.includes("--confirm")) {
    throw new Error(
      "Refusing to seed data without the --confirm flag. Run: npm run seed:demo",
    );
  }
};

const buildClick = (urlId, urlIndex, clickIndex) => ({
  urlId,
  timestamp: new Date(
    Date.now() - (clickIndex + urlIndex * 3) * 6 * 60 * 60 * 1000,
  ),
  ip: `192.0.2.${(clickIndex % 40) + 1}`,
  userAgent: `${browsers[clickIndex % browsers.length]} demo browser`,
  referrer: referrers[(clickIndex + urlIndex) % referrers.length],
  country: countries[(clickIndex + urlIndex) % countries.length],
  browser: browsers[clickIndex % browsers.length],
  os: operatingSystems[(clickIndex + urlIndex) % operatingSystems.length],
  device: devices[(clickIndex + urlIndex) % devices.length],
});

const seedDemoData = async () => {
  requireConfirmation();
  await connectDB();

  const existingUsers = await User.find({
    email: { $regex: demoEmailPattern },
  }).select("_id");
  const existingUserIds = existingUsers.map((user) => user._id);
  const existingUrls = await Url.find({
    $or: [
      { userId: { $in: existingUserIds } },
      { shortCode: { $regex: demoCodePattern } },
    ],
  }).select("_id");
  const existingUrlIds = existingUrls.map((url) => url._id);

  await Click.deleteMany({ urlId: { $in: existingUrlIds } });
  await Url.deleteMany({ _id: { $in: existingUrlIds } });
  await User.deleteMany({ _id: { $in: existingUserIds } });

  const users = await User.create(demoUsers);
  const urlDocuments = [];

  for (let userIndex = 0; userIndex < users.length; userIndex += 1) {
    for (let linkIndex = 0; linkIndex < 6; linkIndex += 1) {
      const urlIndex = userIndex * 6 + linkIndex;
      const clickCount = 8 + ((urlIndex * 7) % 25);
      urlDocuments.push({
        originalUrl: destinationUrls[urlIndex % destinationUrls.length],
        shortCode: `demo-${String(urlIndex + 1).padStart(3, "0")}`,
        customAlias: linkIndex === 0 ? `demo-link-${userIndex + 1}` : undefined,
        userId: users[userIndex]._id,
        clicks: clickCount,
        isActive: urlIndex % 17 !== 0,
        expiresAt:
          urlIndex % 11 === 0
            ? new Date(Date.now() + 14 * 24 * 60 * 60 * 1000)
            : null,
        createdAt: new Date(
          Date.now() - (urlIndex + 1) * 2 * 24 * 60 * 60 * 1000,
        ),
      });
    }
  }

  const urls = await Url.create(urlDocuments);
  const clicks = urls.flatMap((url, urlIndex) =>
    Array.from({ length: url.clicks }, (_, clickIndex) =>
      buildClick(url._id, urlIndex, clickIndex),
    ),
  );
  await Click.insertMany(clicks);

  console.log(
    `Seeded ${users.length} users, ${urls.length} URLs, and ${clicks.length} clicks.`,
  );
};

seedDemoData()
  .catch((error) => {
    console.error(`Demo seed failed: ${error.message}`);
    process.exitCode = 1;
  })
  .finally(async () => {
    await mongoose.connection.close();
  });
