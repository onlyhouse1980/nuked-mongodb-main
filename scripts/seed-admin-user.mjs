import bcrypt from 'bcryptjs';
import { MongoClient } from 'mongodb';

const {
  ADMIN_PASSWORD,
  ADMIN_USERNAME = 'admin',
  ADMIN_DB_NAME = 'meter',
  ADMIN_USERS_COLLECTION = 'users',
  MONGODB_URI,
} = process.env;

if (!MONGODB_URI) {
  throw new Error('MONGODB_URI is required.');
}

if (!ADMIN_PASSWORD) {
  throw new Error('ADMIN_PASSWORD is required.');
}

const client = new MongoClient(MONGODB_URI, {
  serverSelectionTimeoutMS: 20000,
});

try {
  await client.connect();

  const users = client.db(ADMIN_DB_NAME).collection(ADMIN_USERS_COLLECTION);
  const existingUser = await users.findOne({ username: ADMIN_USERNAME });
  const existingPasswordMatches = existingUser?.password
    ? await bcrypt.compare(ADMIN_PASSWORD, existingUser.password)
    : false;

  if (existingUser && existingPasswordMatches && existingUser.role === 'admin') {
    console.log(`Admin user "${ADMIN_USERNAME}" already exists.`);
    process.exit(0);
  }

  const hashedPassword = await bcrypt.hash(ADMIN_PASSWORD, 12);
  const now = new Date();

  await users.updateOne(
    { username: ADMIN_USERNAME },
    {
      $set: {
        username: ADMIN_USERNAME,
        password: hashedPassword,
        role: 'admin',
        updatedAt: now,
      },
      $setOnInsert: {
        createdAt: now,
      },
    },
    { upsert: true },
  );

  console.log(`Admin user "${ADMIN_USERNAME}" saved with a hashed password.`);
} finally {
  await client.close();
}
