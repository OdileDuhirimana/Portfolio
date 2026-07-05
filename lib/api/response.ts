import { NextResponse } from "next/server";

/**
 * Standardized API response envelope, shared by every route handler.
 *
 * WHY: an audit found `/api/contact` and `/api/health` each inventing their
 * own response shape (`{ ok, error }` vs `{ status }`), with no shared error
 * code taxonomy. That makes client-side error handling brittle — every new
 * route would need its own bespoke parsing logic. This module is the one
 * place that decides what "success" and "failure" look like on the wire.
 */

export type ApiSuccess<T> = {
  ok: true;
  data: T;
};

export type ApiError = {
  ok: false;
  error: string;
  /** Machine-readable code for programmatic handling (e.g. "RATE_LIMITED"). */
  code: string;
  /** Optional structured context, e.g. which field failed validation. */
  details?: Record<string, unknown>;
};

export function okResponse<T>(data: T, status = 200): NextResponse<ApiSuccess<T>> {
  return NextResponse.json({ ok: true, data }, { status });
}

export function errorResponse(
  message: string,
  status: number,
  code: string,
  details?: Record<string, unknown>,
): NextResponse<ApiError> {
  return NextResponse.json({ ok: false, error: message, code, details }, { status });
}
