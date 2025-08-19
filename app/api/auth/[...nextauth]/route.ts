import NextAuth from 'next-auth/next';
import type { Session } from 'next-auth';
import { PrismaAdapter } from '@next-auth/prisma-adapter';
import prisma from '@/lib/db';
import CredentialsProvider from 'next-auth/providers/credentials';

export const authOptions = {
  adapter: PrismaAdapter(prisma),
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: 'Email', type: 'email', placeholder: 'email@example.com' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        const user = await prisma.user.findUnique({
          where: { email: credentials?.email },
          include: { company: true },
        });

        if (!user) return null;

        // Hubi password (tusaale: bcrypt)
        // if (!(await bcrypt.compare(credentials!.password, user.password))) return null;

        return user;
      },
    }),
    // Ku dar providers kale haddii loo baahdo
  ],
  callbacks: {
    async session({ session, token, user, ...rest }: any) {
      if (session.user) {
        session.user.id = token.id;
        session.user.role = token.role;
        session.user.companyId = token.companyId;
        session.user.companyName = token.companyName;
        session.user.avatar = token.avatar;
      }
      return session;
    },
    async jwt({ token, user }: { token: any; user?: any }) {
      if (user) {
        token.id = user.id;
        token.role = user.role;
        token.companyId = user.companyId;
        token.companyName = user.company?.name;
        token.avatar = user.avatar;
      }
      return token;
    },
  },
  session: {
    strategy: 'jwt' as const,
  },
  pages: {
    signIn: '/login',
  },
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };