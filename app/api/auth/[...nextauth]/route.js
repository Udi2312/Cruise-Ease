import NextAuth from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"
import bcrypt from "bcryptjs"
import dbConnect from "@/lib/mongodb"
import User from "@/models/User"

export const authOptions = {   // ✅ export authOptions separately
  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null
        }

        try {
          await dbConnect()

          const user = await User.findOne({ email: credentials.email })

          if (!user) {
            return null
          }

          const isPasswordValid = await bcrypt.compare(credentials.password, user.password)

          if (!isPasswordValid) {
            return null
          }

          return {
            id: user._id.toString(),
            email: user.email,
            name: user.name,
            role: user.role,
          }
        } catch (error) {
          console.error("Auth error:", error)
          return null
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.role = user.role
        token.id = user.id 
        //  token.sessionId = `${user.id}-${Date.now()}-${Math.random().toString(36).substring(2)}`
      }
      // if (trigger === "update" && session) {
      //   token.name = session.name
      //   token.email = session.email
      // }
      return token
    },
    async session({ session, token }) {
      if (token) {
        session.user.id = token.id || token.sub    // ✅ attaches userId
        session.user.role = token.role  // ✅ attaches role
        // session.sessionId = token.sessionId
      }
      return session
    },
     async redirect({ url, baseUrl }) {
      // Handle redirects properly
      if (url.startsWith("/")) return `${baseUrl}${url}`
     else if (new URL(url).origin === baseUrl) return url
      return baseUrl
    },
  },
  pages: {
    signIn: "/login",
    error: "/login",
  },
  session: {
    strategy: "jwt",
     maxAge: 24 * 60 * 60, // 24 hours
    updateAge: 60 * 60, // 1 hour
  },
  jwt: {
    maxAge: 24 * 60 * 60, // 24 hours
  },
  //  cookies: {
  //   sessionToken: {
  //    name: process.env.NODE_ENV === "production" ? "__Secure-next-auth.session-token" : "next-auth.session-token",
  //     options: {
  //       httpOnly: true,
  //       sameSite: "lax",
  //       path: "/",
  //       secure: process.env.NODE_ENV === "production",
  //       domain: process.env.NODE_ENV === "production" ? undefined : "localhost",
  //     },
  //   },
  //   callbackUrl: {
  //     name: process.env.NODE_ENV === "production" ? "__Secure-next-auth.callback-url" : "next-auth.callback-url",
  //     options: {
  //       sameSite: "lax",
  //       path: "/",
  //       secure: process.env.NODE_ENV === "production",
        
  //     },
  //   },
  //   csrfToken: {
  //     name: process.env.NODE_ENV === "production" ? "__Host-next-auth.csrf-token" : "next-auth.csrf-token",
  //     options: {
  //       httpOnly: true,
  //       sameSite: "lax",
  //       path: "/",
  //       secure: process.env.NODE_ENV === "production",
       
  //     },
  //   },
  // },
    secret: process.env.NEXTAUTH_SECRET,
     debug: process.env.NODE_ENV === "development",
     trustHost: true,
}

const handler = NextAuth(authOptions)
export { handler as GET, handler as POST, }
