import { NextResponse } from "next/server";
import { handleApiError } from "../../../back/lib/api-error";
import * as AccountService from "../../../back/services/account.service";

export async function DELETE() {
  try {
    await AccountService.deleteAccount();
    return new NextResponse(null, { status: 204 });
  } catch (e) {
    return handleApiError(e);
  }
}
