import NextAuth from "next-auth";
import GitHub from "next-auth/providers/github";
import Google from "next-auth/providers/google";

export const { handlers, auth, signIn, signOut } = NextAuth({
  providers: [GitHub, Google],
  callbacks: {
    async signIn({ user, account }) {
      // Best-effort: register new users in the .NET API without blocking sign-in
      try {
        const apiBaseUrl = process.env.API_BASE_URL;
        if (apiBaseUrl) {
          await fetch(`${apiBaseUrl}/users/register`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              email: user.email ?? "",
              name: user.name ?? "",
              provider: account?.provider ?? "",
              providerAccountId: account?.providerAccountId ?? "",
            }),
          });
        }
      } catch {
        // silently continue — DB may be unavailable
      }
      return true;
    },
  },
});
