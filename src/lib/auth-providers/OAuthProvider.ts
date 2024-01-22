import { OAuthProviderImpl } from "camunda-saas-oauth";
import { TaskState } from "../Types";
import { TasklistApiClient } from "../TasklistApiClient";
import { TasklistAuthProvider } from "./AuthApiClient";
import { getTasklistCredentials } from "camunda-8-credentials-from-env";

export class OAuthProvider extends TasklistAuthProvider {
  constructor(
    private oauthProvider: OAuthProviderImpl,
    private options?: {
      baseUrl?: string;
    }
  ) {
    super();
  }

  async getHeaders({ userAgentString }: { userAgentString?: string }) {
    return {
      authorization: `Bearer ${await this.oauthProvider.getToken("TASKLIST")}`,
    };
  }

  getBaseUrl() {
    if (this.options?.baseUrl) {
      return this.options.baseUrl;
    }

    const creds = getTasklistCredentials();
    return `${creds.CAMUNDA_TASKLIST_BASE_URL}/v1`;
  }
}

/**
 * @description This is an example of how to use the SelfManagedOAuthProvider class to create a TasklistApiClient instance. 
 * @example 
 * const tasklistApiClient = new TasklistApiClient(new SelfManagedOAuthProvider({
    client_id: "tasklist",
    client_secret: "xxxx",
    authUrl: "https://<keycloak-domain>/realms/camunda-platform/protocol/openid-connect/token",
    baseUrl: "https://<keycloak-domain>/tasklist",
  }));
 */
export class SelfManagedOAuthProvider extends TasklistAuthProvider {
  constructor(
    private options: {
      client_id: string; // tasklist
      client_secret: string; // 123456
      grant_type?: string; // "client_credentials";
      authUrl: string; // "https://camunda.alpha.thaivivat.co.th/tasklist/api/login";
      baseUrl: string; // "https://camunda.alpha.thaivivat.co.th/tasklist";
    }
  ) {
    super();
  }

  async getToken(userAgentString?: string) {
    const urlencoded = new URLSearchParams();
    urlencoded.append("client_id", this.options.client_id);
    urlencoded.append("client_secret", this.options.client_secret);
    urlencoded.append(
      "grant_type",
      this.options.grant_type || "client_credentials"
    );

    const response = await fetch(this.options.authUrl, {
      method: "POST",
      body: urlencoded,
      redirect: "follow",
      headers: {
        "content-type": "application/x-www-form-urlencoded",
        "user-agent": userAgentString || "",
      },
    });

    if (!response.ok) {
      if (response.status === 401) {
        throw new Error("Unauthorized");
      } else if (response.status === 403) {
        throw new Error("Forbidden");
      } else if (response.status === 404) {
        throw new Error("Not found");
      } else if (response.status === 405) {
        throw new Error("Method not allowed");
      }

      throw new Error(
        `Error getting token: ${response.status} ${response.statusText}`
      );
    }

    const json = await response.json();
    return json.access_token;
  }

  async getHeaders({ userAgentString }: { userAgentString?: string }) {
    return {
      authorization: `Bearer ${await this.getToken(userAgentString)}`,
    };
  }

  getBaseUrl() {
    return this.options.baseUrl;
  }
}
