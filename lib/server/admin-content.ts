import "server-only";
import { ENTITIES, type EntityName } from "@/lib/content";

export function entityOf(name: string): EntityName | null {
  return name in ENTITIES ? (name as EntityName) : null;
}

export function saveError(e: unknown): Response {
  const err = e as { code?: string; message?: string };
  if (err.code === "23505") return Response.json({ success: false, error: "That slug is already used. Choose another.", fieldErrors: { slug: "Already in use." } }, { status: 409 });
  if (err.message === "NOT_FOUND") return Response.json({ success: false, error: "Item not found." }, { status: 404 });
  console.error("[admin content]", e);
  return Response.json({ success: false, error: "Could not save. Please try again." }, { status: 500 });
}
