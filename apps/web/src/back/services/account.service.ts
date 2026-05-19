import { getUser } from "../../lib/auth-session";
import { UsersRepository } from "../repositories/users.repository";

export async function deleteAccount() {
  const user = await getUser();
  if (!user) throw new Error("UNAUTHORIZED");
  return UsersRepository.deleteById(user.id);
}
