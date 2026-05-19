import { NextResponse } from "next/server";
import { ZodError } from "zod";

export function handleApiError(e: unknown): NextResponse {
  if (e instanceof ZodError) {
    return NextResponse.json({ error: "Invalid input", issues: e.issues }, { status: 400 });
  }
  if (e instanceof Error) {
    switch (e.message) {
      case "UNAUTHORIZED":
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
      case "FORBIDDEN":
        return NextResponse.json({ error: "Forbidden" }, { status: 403 });
      case "NOT_FOUND":
        return NextResponse.json({ error: "Not found" }, { status: 404 });
      case "SIRET_ALREADY_EXISTS":
        return NextResponse.json({ error: "SIRET already exists" }, { status: 409 });
      case "EMAIL_ALREADY_EXISTS":
        return NextResponse.json({ error: "Email already exists" }, { status: 409 });
    }
  }
  console.error("[API Error]", e);
  return NextResponse.json({ error: "Internal server error" }, { status: 500 });
}
