import NextAuth from "next-auth/next";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcrypt";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const handler = NextAuth({
    adapter: PrismaAdapter(prisma),
    providers: [
        CredentialsProvider({
            name: "credentials",
            credentials: {
                username: { label: "Username", type: "text", placeholder: "John Smith" },
                password: { label: "Password", type: "password" },
                email: { label: "Email", type: "text", placeholder: "jsmith" }
            },
            async authorize(credentials) {
                // check to see if email and password are valid
                if (!credentials?.email || !credentials?.password) {
                    return null;
                }

                // check to see if user exists
                const user = await prisma.user.findUnique({
                    where: {
                        email: credentials.email
                    }
                })

                if (!user) {
                    return null;
                }

                // check to see if passwords match
                const passwordsMatch = await bcrypt.compare(credentials.password, user.hashedPassword!);

                if (!passwordsMatch) {
                    return null;
                }

                return user;
            },
        })
    ],
    session: {
        strategy: "jwt",
    },
    secret: process.env.NEXTAUTH_SECRET,
    debug: process.env.NODE_ENV === "development",
});

export { handler as GET, handler as POST };