import { IOptionHeaders, TasklistAuthProvider } from "./TasklistAuthProvider";

/**
 * @description This is an example of how to use the CookieAuthProvider class to create a TasklistApiClient instance.
 * @example
 * const tasklistApiClient = new TasklistApiClient(new CookieAuthProvider({
 *    authUrl: "https://<domain>/tasklist/api/login",
 *    username: "demo",
 *    password: "demo",
 *    tasklistBaseUrl: "https://<domain>/tasklist",
 * }));
 **/
export class CookieAuthProvider extends TasklistAuthProvider {
  constructor(
    private cookieAuthOptions: {
      authUrl: string; // "https://<domain>/tasklist/api/login";
      username: string; // "demo";
      password: string; // "demo";
      tasklistBaseUrl: string; // "https://<domain>/tasklist";
    }
  ) {
    super();
  }

  async getTasklistToken(userAgentString: string) {
    const params = new URLSearchParams({
      username: this.cookieAuthOptions.username,
      password: this.cookieAuthOptions.password,
    });

    const response = await fetch(
      this.cookieAuthOptions.authUrl + "?" + params,
      {
        method: "POST",
        headers: {
          "content-type": "application/x-www-form-urlencoded",
          "user-agent": userAgentString,
        },
      }
    );

    // ex. headers.cookies =  ['TASKLIST-SESSION=XXXX; Path=/tasklist; HttpOnly; SameSite=Lax']
    const cookies = response.headers.get("set-cookie");

    if (!cookies) {
      throw new Error("No cookies in response");
    }

    const token = cookies.split(";")[0].split("=")[1];
    if (!token) {
      throw new Error("No token in response");
    }

    return token;
  }

  async getHeaders(optionHeaders: IOptionHeaders) {
    const token = await this.getTasklistToken(
      optionHeaders.userAgentString || ""
    );
    return {
      cookie: `TASKLIST-SESSION=${token}`,
    };
  }

  getBaseUrl() {
    return this.cookieAuthOptions.tasklistBaseUrl;
  }
}
