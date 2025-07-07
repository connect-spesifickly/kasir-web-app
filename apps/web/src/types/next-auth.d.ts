import "next-auth";
declare module "next-auth" {
  interface User {
    data: {
      accessToken?: string;
      refreshToken?: string;
      email?: string;
      id?: string;
    };
  }
  interface Session {
    accessToken?: string;
    refreshToken?: string;
    email?: string;
    id?: string;
  }
}
