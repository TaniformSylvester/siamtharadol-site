/**
 * Logs a server-side error as a plain string rather than passing the raw Error object to
 * console.error. On this dev environment, Next's dev-overlay tries to attach a source code
 * frame to any Error object logged via console.error, and that formatter is broken here
 * (throws "invalid type: boolean false, expected enum CodeFrameColorMode"), which swallows
 * the in-flight API response and turns it into an empty 500. Stringifying first avoids that
 * interception entirely and is harmless in production.
 */
export function logError(context: string, err: unknown) {
  const message = err instanceof Error ? `${err.message}\n${err.stack}` : String(err);
  console.error(`[${context}] ${message}`);
}
