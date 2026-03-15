const bcrypt = require("bcryptjs");

async function run() {
  const password = "Admin12345";
  const hash = await bcrypt.hash(password, 10);
  console.log("Hashed password:");
  console.log(hash);
}

run();