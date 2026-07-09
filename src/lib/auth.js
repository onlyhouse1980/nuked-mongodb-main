import bcrypt from 'bcryptjs';
import { getServerSession } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';

import { dbConnect } from '@/lib/dbConnect';
import { getMongoClient } from '@/lib/mongodb';
import WaterReading from '@/models/WaterReading';

const ADMIN_USERNAME = 'admin';
const ADMIN_DB_NAME = process.env.ADMIN_DB_NAME || 'meter';
const ADMIN_USERS_COLLECTION = process.env.ADMIN_USERS_COLLECTION || 'users';

async function authorizeAdmin(identifier, password) {
  if (identifier.toLowerCase() !== ADMIN_USERNAME) {
    return null;
  }

  const client = await getMongoClient();
  if (!client) {
    console.warn('MongoDB unavailable during admin authorization.');
    return null;
  }

  const adminUser = await client
    .db(ADMIN_DB_NAME)
    .collection(ADMIN_USERS_COLLECTION)
    .findOne({ username: ADMIN_USERNAME, role: 'admin' });

  if (!adminUser?.password) {
    return null;
  }

  const isPasswordCorrect = await bcrypt.compare(password, adminUser.password);
  if (!isPasswordCorrect) {
    return null;
  }

  return {
    id: adminUser._id.toString(),
    name: ADMIN_USERNAME,
    username: ADMIN_USERNAME,
    role: 'admin',
  };
}

async function authorizeWaterReadingUser(identifier, password) {
  const connection = await dbConnect();
  if (!connection) {
    console.warn('Database unavailable during credential authorization.');
    return null;
  }

  const user = await WaterReading.findOne({ email: identifier });

  if (!user?.password) {
    return null;
  }

  const isPasswordCorrect = await bcrypt.compare(password, user.password);
  if (!isPasswordCorrect) {
    return null;
  }

  return {
    id: user._id.toString(),
    email: user.email,
    lastName: user.last_name,
    role: 'user',
  };
}

export const authOptions = {
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        username: { label: 'Username or Email', type: 'text' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        const identifier = (
          credentials?.username ||
          credentials?.email ||
          ''
        ).trim();
        const password = credentials?.password || '';

        if (!identifier || !password) {
          return null;
        }

        const adminUser = await authorizeAdmin(identifier, password);
        if (adminUser) {
          return adminUser;
        }

        return authorizeWaterReadingUser(identifier, password);
      },
    }),
  ],
  pages: {
    signIn: '/login',
  },
  session: {
    strategy: 'jwt',
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.lastName = user.lastName;
        token.role = user.role;
        token.username = user.username;
      }
      return token;
    },
    async session({ session, token }) {
      if (token && session.user) {
        session.user.id = token.id;
        session.user.lastName = token.lastName;
        session.user.role = token.role;
        session.user.username = token.username;
      }
      return session;
    },
  },
};

export async function getAdminSession() {
  const session = await getServerSession(authOptions);

  if (session?.user?.role !== 'admin') {
    return null;
  }

  return session;
}
