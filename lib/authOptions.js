import GoogleProvider from "next-auth/providers/google";
import User from '@/models/User';
import dbConnect from '@/lib/dbConnect';

export const authOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      authorization: {
        params: {
          prompt: "consent",
          access_type: "offline",
          response_type: "code"
        }
      }
    }),
  ],
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60,
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.email = user.email;
      }
      return token;
    },
    async session({ session, token }) {
      session.user.id = token.id;
      session.user.email = token.email;

      try {
        await dbConnect();
        const dbUser = await User.findOne({ email: token.email });
        if (dbUser) {
          session.user.dbId = dbUser._id.toString();
          session.user.name = dbUser.name || token.name;
          session.user.image = dbUser.image || token.picture;
        }
      } catch (error) {
        console.error("Database session error:", error);
      }
      return session;
    },
    async signIn({ user, profile }) {
      try {
        await dbConnect();
        const existingUser = await User.findOne({ email: user.email });
        if (!existingUser) {
          const newUser = await User.create({
            name: user.name || profile?.name,
            email: user.email,
            image: user.image || profile?.picture
          });
          user.id = newUser._id.toString();
        } else {
          user.id = existingUser._id.toString();
        }
        return true;
      } catch (error) {
        console.error('SignIn Error:', error);
        return false;
      }
    },
    async redirect({ baseUrl }) {
      return baseUrl;
    }
  },
  pages: {
    signIn: '/',
  },
  secret: process.env.NEXTAUTH_SECRET,
  debug: process.env.NODE_ENV === 'development'
};