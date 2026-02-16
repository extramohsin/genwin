const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const User = require("./models/User");
require("dotenv").config();

const users = [
  { fullName: "Aarav Sharma", username: "aarav_cool", branch: "CSE", year: "3" },
  { fullName: "Vivaan Gupta", username: "vivaan_g", branch: "AIDS", year: "2" },
  { fullName: "Aditya Verma", username: "adi_verma", branch: "ETC", year: "4" },
  { fullName: "Vihaan Singh", username: "vihaan_s", branch: "Mech", year: "1" },
  { fullName: "Arjun Mehta", username: "arjun_m", branch: "Civil", year: "3" },
  { fullName: "Sai Kumar", username: "sai_k", branch: "CSE", year: "2" },
  { fullName: "Reyansh Reddy", username: "reyansh_r", branch: "AIDS", year: "4" },
  { fullName: "Ayaan Khan", username: "ayaan_k", branch: "Electrical", year: "1" },
  { fullName: "Krishna Das", username: "krishna_d", branch: "ETC", year: "3" },
  { fullName: "Ishaan Patel", username: "ishaan_p", branch: "Mech", year: "2" },
  { fullName: "Shaurya Joshi", username: "shaurya_j", branch: "CSE", year: "4" },
  { fullName: "Atharv Nair", username: "atharv_n", branch: "Civil", year: "1" },
  { fullName: "Rohan Malhotra", username: "rohan_m", branch: "AIDS", year: "3" },
  { fullName: "Kabir Kapoor", username: "kabir_k", branch: "Electrical", year: "2" },
  { fullName: "Anaya Singh", username: "anaya_s", branch: "CSE", year: "3" },
  { fullName: "Diya Sharma", username: "diya_cool", branch: "AIDS", year: "2" },
  { fullName: "Saanvi Gupta", username: "saanvi_g", branch: "ETC", year: "4" },
  { fullName: "Aadhya Verma", username: "aadhya_v", branch: "Mech", year: "1" },
  { fullName: "Kiara Mehta", username: "kiara_m", branch: "Civil", year: "3" },
  { fullName: "Myra Reddy", username: "myra_r", branch: "CSE", year: "2" },
];

const seedDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("✅ Custom Seed: Connected to MongoDB");

    // Clear existing users mostly to avoid dupe errors during testing, 
    // but in prod you wouldn't do this. For this user context, it's safer to just check existance.
    // Actually, let's just insert if not exists.
    
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash("password123", salt);

    let count = 0;
    for (const u of users) {
      const exists = await User.findOne({ username: u.username });
      if (!exists) {
        await User.create({ ...u, password: hashedPassword });
        count++;
      }
    }

    console.log(`✅ Seeded ${count} new users!`);
    console.log("👉 Test Password for all: password123");
    process.exit();
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

seedDB();
