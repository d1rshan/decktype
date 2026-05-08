import { db } from "./client";

const users = db.collection("user");
const allUsers = await users.find({}).toArray();

for (const user of allUsers) {
  if (user.username) continue;

  const username = (user.name as string).toLowerCase().replace(/\s+/g, ""); // spaces → nothing, e.g. "john doe" → "johndoe"

  await users.updateOne(
    { _id: user._id },
    { $set: { username, displayUsername: username } },
  );

  console.log(`${user.name} → ${username}`);
}

console.log("Done.");
