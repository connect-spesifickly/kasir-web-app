import prisma from "../prisma";
import { generateHashedPassword } from "../utils/generate-password";

class AuthService {
  async register(data: { name: string; email: string; password: string }) {
    const { name, email, password } = data;
    const technicianPassword = await generateHashedPassword(password);
    await prisma.accounts.create({
      data: {
        name,
        email,
        password: technicianPassword,
        role: "Admin",
        isVerified: true,
      },
    });
  }
}

export default new AuthService();
