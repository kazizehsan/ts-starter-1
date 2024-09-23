import * as express from 'express';

// @ts-ignore
export function expressAuthentication(request: express.Request, securityName: string, scopes?: string[]): Promise<any> {
  /*
   * This just tells TSOA to add auth specs to openapi.
   * Actual authentication is handled by a custom middleware.
   */
  return new Promise<void>((resolve) => resolve());
}
