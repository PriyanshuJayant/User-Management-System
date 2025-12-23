const fs = require("fs");
const { ObjectId } = require("bson");

const TOTAL_USERS = 100_000;

const firstNames = [
  "Aarav", "Aryan", "Priyanshu", "Rohit", "Rahul",
  "Neha", "Ananya", "Pooja", "Kavya", "Simran", "Priya",
];

const lastNames = [
  "Sharma", "Verma", "Jain", "Gupta", "Singh", "Jaat",
  "Mehta", "Joshi", "Agarwal", "Patel", "Yadav", "Gurjar",
  "Kumar", "Rajput", "Dhobi", "Bania", "Bamman", "Jatav",
];

const genders = ["male", "female"];

const users = [];

for (let i = 0; i < TOTAL_USERS; i++) {
  const firstName = firstNames[Math.floor(Math.random() * firstNames.length)];
  const lastName = lastNames[Math.floor(Math.random() * lastNames.length)];
  const fullName = `${firstName} ${lastName}`;

  const createdAt = new Date(
    Date.now() - Math.floor(Math.random() * 365 * 24 * 60 * 60 * 1000)
  );

  users.push({
    _id: { $oid: new ObjectId().toHexString() },
    fullName,
    email: `${firstName.toLowerCase()}.${lastName.toLowerCase()}${i}@test.com`,
    age: Math.floor(Math.random() * 40) + 18,
    gender: genders[Math.floor(Math.random() * genders.length)],
    createdAt: { $date: createdAt.toISOString() },
    updatedAt: { $date: createdAt.toISOString() },
    __v: 0
  });
}

fs.writeFileSync(
  "users_100k.json",
  JSON.stringify(users, null, 2)
);

console.log("✅ 100,000 users generated: users_100k.json");
2