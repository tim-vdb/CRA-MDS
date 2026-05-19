import { getUser } from "../../lib/auth-session";
import { UsersRepository } from "../repositories/users.repository";

export async function listUsers() {
  const user = await getUser();
  if (!user) throw new Error("UNAUTHORIZED");
  if (user.role !== "ADMIN") throw new Error("FORBIDDEN");
  return UsersRepository.findAll();
}
