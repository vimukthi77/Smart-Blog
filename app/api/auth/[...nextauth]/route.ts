import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import GithubProvider from "next-auth/providers/github";

const handler = NextAuth({
  providers: [
    GoogleProvider({
        clientId: process.env.GOOGLE_ID!,
        clientSecret: process.env.GOOGLE_SECRET!,
        authorization: {
          params: {
            prompt: "consent",
            access_type: "offline",
            response_type: "code",
            redirect_uri: process.env.NEXTAUTH_URL + "/api/auth/callback/google"
          }
        }
    }),
    GithubProvider({
        clientId: 'Ov23liiEcdcvHvGS44wO',
        clientSecret: '76493fb43138dd8331db9e05adf96ceeac42838f',
        authorization: {
          params: {
            client_id: 'Ov23liiEcdcvHvGS44wO',
            redirect_uri: `${process.env.NEXTAUTH_URL}/api/auth/callback/github`
          }
        }
    }),
  ],
  debug: process.env.NODE_ENV === 'development',
  pages: {
    signIn: '/auth',
    error: '/auth/error',
  },
});

export { handler as GET, handler as POST };
