export interface IOptionHeaders {
  [key: string]: string;
}

export abstract class TasklistAuthProvider {
  abstract getHeaders(
    optionHeaders: IOptionHeaders
  ): Promise<{ [key: string]: string }>;

  abstract getBaseUrl(): string;
}
