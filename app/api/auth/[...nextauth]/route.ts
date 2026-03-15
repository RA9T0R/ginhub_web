import NextAuth, { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

export const authOptions: NextAuthOptions = {
    providers: [
        CredentialsProvider({
            name: "Credentials",
            credentials: {
                email: { label: "Email", type: "email" },
                password: { label: "Password", type: "password" }
            },
            async authorize(credentials) {
                if (!credentials?.email || !credentials?.password) {
                    throw new Error('กรุณากรอกอีเมลและรหัสผ่าน');
                }

                const user = await prisma.user.findUnique({
                    where: { email: credentials.email }
                });

                if (!user || !user.password) {
                    throw new Error('ไม่พบอีเมลนี้ในระบบ');
                }

                let isPasswordValid = false;

                if (user.password.startsWith('$2')) {
                    isPasswordValid = await bcrypt.compare(credentials.password, user.password);
                } else {
                    isPasswordValid = credentials.password === user.password;
                }

                if (!isPasswordValid) {
                    throw new Error('รหัสผ่านไม่ถูกต้อง');
                }

                return {
                    id: user.id,
                    name: user.name,
                    email: user.email,
                    role: user.role,
                };
            }
        })
    ],
    session: {
        strategy: "jwt",
    },
    callbacks: {
        async jwt({ token, user }) {
            if (user) {
                token.role = user.role;
                token.id = user.id;
            }
            return token;
        },
        async session({ session, token }) {
            if (session.user) {
                session.user.role = token.role as string;
                session.user.id = token.id as string;
            }
            return session;
        }
    },
    pages: {
        signIn: '/',
    }
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };