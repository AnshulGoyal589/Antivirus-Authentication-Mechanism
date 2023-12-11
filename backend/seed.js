const mongoose = require("mongoose");
const Admin = require("./models/Admin");
const User = require("./models/User");

mongoose.connect("mongodb://127.0.0.1:27017/chrome", { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("Database connected successfully".green))  // Assuming you are using a color library like 'chalk'
  .catch((err) => console.error(`Error connecting to the database: ${err.message}`));

const adminData = [
  {
    key: '123'
  }
];
const chatData=[
  {
    username: "exampleUser",
    phoneNumber: "1234567890",
    expireAt: new Date(Date.now()+10000000),
    chats: [
        {
            customer: "uiui",
            admin: "asdasd",
            timestamp: new Date(Date.now())
        },
        {
            customer: "uiumkmoi",
            admin: "lll",
            timestamp: new Date(Date.now())
        }
    ]
}
]

async function seedAdmin() {
  try {
    await Admin.deleteMany({});
    await Admin.insertMany(adminData);
    await User.deleteMany({});
    await User.insertMany(chatData);
    console.log("Admin data seeded successfully");
  } catch (error) {
    console.error(`Error seeding admin data: ${error.message}`);
  } finally {
    mongoose.connection.close();  // Close the connection after seeding (optional)
  }
}

seedAdmin();
