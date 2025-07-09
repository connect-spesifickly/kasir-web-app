import { compare } from "bcrypt";
import { getUserByEmail } from "../helpers/user.prisma";
import { UserLogin } from "../interfaces/user.interface";
import { ResponseError } from "../helpers/error";
import { putOwnerAccessToken } from "../helpers/jwt";
import prisma from "../prisma";
import { generateHashedPassword } from "../utils/generate-password";
import jwt from "jsonwebtoken";
import { JWT_REFRESH_SECRET, JWT_ACCESS_SECRET } from "../config";

class AuthService {
  async login(data: { email: string; password: string }) {
    const { email, password } = data;
    const user = (await getUserByEmail(email)) as UserLogin;
    if (!(await compare(password, user.password as string))) {
      throw new ResponseError(401, "Invalid password");
    }
    const token = await putOwnerAccessToken(user);
    return {
      user: {
        id: user.id,
        email: user.email,
      },
      token,
    };
  }

  async register(data: { email: string; password: string }) {
    const { email, password } = data;
    // Check if user already exists
    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      throw new ResponseError(409, "Email already registered");
    }
    // Hash password
    const hashedPassword = await generateHashedPassword(password);
    // Create user
    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
      },
    });
    return {
      id: user.id,
      email: user.email,
    };
  }

  async refreshToken(refreshToken: string) {
    try {
      const payload = jwt.verify(refreshToken, JWT_REFRESH_SECRET) as {
        email: string;
      };
      const user = await getUserByEmail(payload.email);
      if (!user) throw new ResponseError(404, "User not found");
      return await putOwnerAccessToken(user);
    } catch (err) {
      throw new ResponseError(401, "Invalid or expired refresh token");
    }
  }

  async resetPassword(token: string, newPassword: string) {
    try {
      const payload = jwt.verify(token, JWT_ACCESS_SECRET) as { email: string };
      const user = await getUserByEmail(payload.email);
      if (!user) throw new ResponseError(404, "User not found");
      const hashedPassword = await generateHashedPassword(newPassword);
      await prisma.user.update({
        where: { email: payload.email },
        data: { password: hashedPassword },
      });
      return { message: "Password updated successfully" };
    } catch (err) {
      throw new ResponseError(400, "Invalid or expired reset token");
    }
  }
}

export default new AuthService();
