import { NextResponse } from "next/server";
import { handleApiError } from "../../../back/lib/api-error";
import * as UsersService from "../../../back/services/users.service";

export async function GET() {
  try {
    const users = await UsersService.listUsers();
    const formatted = users.map((u) => ({
      ...u,
      createdAt: u.createdAt.toISOString().slice(0, 10),
    }));
    return NextResponse.json(formatted);
  } catch (e) {
    return handleApiError(e);
  }
}
