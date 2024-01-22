export interface IOptionHeaders {
  [key: string]: string;
}

/**
 * Abstract class for authentication providers.
 */
export abstract class TasklistAuthProvider {
  abstract getHeaders(
    optionHeaders: IOptionHeaders
  ): Promise<{ [key: string]: string }>;

  abstract getBaseUrl(): string;
}
