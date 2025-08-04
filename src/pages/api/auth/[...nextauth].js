import NextAuth from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import bcrypt from 'bcryptjs';
import dbConnect from '../../../../lib/dbConnect';
import WaterReading from '../../../../models/WaterReading';

export default NextAuth({
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: 'Email', type: 'text' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials, req) {
        await dbConnect();

        // Find the user by their email
        const user = await WaterReading.findOne({ email: credentials.email });

        // If no user is found, return null
        if (!user) {
          return null;
        }

        // Compare the plaintext password with the hashed password from the database
        const isPasswordCorrect = await bcrypt.compare(credentials.password, user.password);

        // If the passwords don't match, return null
        if (!isPasswordCorrect) {
          return null;
        }

        // If authentication is successful, return a simplified user object
        return { 
          id: user._id.toString(), // Must be a string
          email: user.email,
          lastName: user.last_name,
        };
      },
    }),
  ],
  pages: {
    signIn: '/login',
  },
  session: {
    jwt: true,
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.lastName = user.lastName;
      }
      return token;
    },
    async session({ session, token }) {
      if (token) {
        session.user.id = token.id;
        session.user.lastName = token.lastName;
      }
      return session;
    },
  },
});