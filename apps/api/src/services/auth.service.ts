import { compare } from "bcrypt";
import { getUserByEmail } from "../helpers/user.prisma";
import { UserLogin } from "../interfaces/user.interface";
import { ResponseError } from "../helpers/error";
import { putOwnerAccessToken } from "../helpers/jwt";

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
}

export default new AuthService();
