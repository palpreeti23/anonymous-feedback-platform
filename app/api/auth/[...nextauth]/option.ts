import NextAuth, { CredentialsSignin } from "next-auth";
import Credentials from "next-auth/providers/credentials";
import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";
import bcrypt from "bcryptjs";
import { error } from "console";

export const { handlers, auth } = NextAuth({
  providers: [
    Credentials({
      credentials: {
        identifier: { label: "Username or email" },
        password: { label: "Password", type: "password" },
      },

      async authorize(credentials: any): Promise<any> {
        await dbConnect();
        try {
          const user = await UserModel.findOne({
            $or: [
              { username: credentials.identifier },
              { email: credentials.identifier },
            ],
          });

          if (!user) {
            throw new Error("user not found");
          }
          if (!user.isVarified) {
            throw new Error("verify your account before login ");
          }

          const isCorrectPassword = await bcrypt.compare(
            credentials.password,
            user.password,
          );
          if (isCorrectPassword) {
            return user;
          } else {
            throw new Error("incorrect password");
          }
        } catch (error: any) {}
        throw new Error(
          error instanceof Error ? error.message : JSON.stringify(error),
        );
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token._id = user._id.toString();
        token.isVarified = user.isVarified;
        token.username = user.username;
        token.isAcceptingMessages = user.isAcceptingMessages;
      }

      return token;
    },
    async session({ session, token }) {
      if (token) {
        session.user._id = token._id;
        session.user.username = token.username;
        session.user.isAcceptingMessages = token.isAcceptingMessages;
        session.user.isVarified = token.isVarified;
      }
      return session;
    },
  },
  pages: {
    signIn: "/sign-in",
  },
  secret: process.env.NEXTAUTH_SECRET,
});

// import NextAuth from "next-auth";
// import Credentials from "next-auth/providers/credentials";
// import bcrypt from "bcryptjs";
// import UserModel from "@/model/User";
// import dbConnect from "@/lib/dbConnect";

// export const { handlers, auth } = NextAuth({
//   providers: [
//     Credentials({
//       credentials: {
//         email: { label: "Username or Email" },
//         password: { label: "Password", type: "password" },
//       },
//       async authorize(credentials: any): Promise<any> {
//         await dbConnect();
//         try {
//           const user = await UserModel.findOne({
//             $or: [
//               { email: credentials.identifier },
//               { username: credentials.identifier },
//             ],
//           });

//           if (!user) {
//             throw new Error("No User found with this email");
//           }

//           if (!user.isVarified) {
//             throw new Error("please verify your account before login");
//           }

//           const isPasswordCorrect = await bcrypt.compare(
//             credentials.password,
//             user.password,
//           );

//           if (isPasswordCorrect) {
//             return user;
//           } else {
//             throw new Error("incorrect password");
//           }
//         } catch (err: any) {
//           throw new Error(err.message || "Authorization failed");
//         }
//       },
//     }),
//   ],
//   callbacks: {
//     async jwt({ token, user }) {
//       if (user) {
//         token._id = user._id?.toString();
//         token.isVarified = user.isVarified;
//         token.isAcceptingMessages = user.isAcceptingMessages;
//         token.username = user.username;
//       }
//       return token;
//     },
//     async session({ session, token }) {
//       if (token) {
//         session.user._id = token._id;
//         session.user.isVarified = token.isVarified;
//         session.user.isAcceptingMessages = token.isAcceptingMessages;
//         session.user.username = token.username;
//       }
//       return session;
//     },
//   },
//   pages: {
//     signIn: "/sign-in",
//   },
//   session: {
//     strategy: "jwt",
//   },
//   secret: process.env.NEXTAUTH_SECRET,
// });
