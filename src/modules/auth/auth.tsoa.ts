import * as express from 'express';

// @ts-ignore
// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function expressAuthentication(request: express.Request, securityName: string, scopes?: string[]): Promise<any> {
  /*
   * This just tells TSOA to add auth specs to openapi.
   * Actual authentication is handled by a custom middleware.
   */
  // eslint-disable-next-line no-promise-executor-return
  return new Promise<void>((resolve) => resolve());
}
