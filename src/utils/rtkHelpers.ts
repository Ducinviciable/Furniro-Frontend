import { FetchBaseQueryError } from "@reduxjs/toolkit/query";
import { SerializedError } from "@reduxjs/toolkit";

type RtkError = FetchBaseQueryError | SerializedError | { message?: string };

function isFetchBaseQueryError(error: RtkError): error is FetchBaseQueryError {
  return typeof error === "object" && error !== null && "status" in error;
}

export function getRtkErrorMessage(error: unknown): string {
  if (typeof error !== "object" || error === null) {
    return "An unknown error occurred.";
  }

  const rtkError = error as RtkError;

  if (isFetchBaseQueryError(rtkError)) {
    if (
      typeof rtkError.data === "object" &&
      rtkError.data !== null &&
      "message" in rtkError.data
    ) {
      return String((rtkError.data as { message: string }).message);
    }
    return String(rtkError.status);
  }

  if ("message" in rtkError && rtkError.message) {
    return rtkError.message;
  }

  return "An unknown error occurred.";
}
