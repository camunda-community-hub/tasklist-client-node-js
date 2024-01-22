import { TasklistAuthProvider } from "./TasklistAuthProvider";
import { getTasklistCredentials } from "camunda-8-credentials-from-env";
import { getTasklistToken } from "camunda-saas-oauth";
const pkg = require("../../package.json");

export class SaasAuthProvider extends TasklistAuthProvider {
  constructor() {
    super();
  }

  async getHeaders({ userAgentString }: { userAgentString?: string }) {
    if (!userAgentString) {
      userAgentString = `tasklist-graphql-client-nodejs/${pkg.version}`;
    }
    return {
      authorization: `Bearer ${await getTasklistToken(userAgentString)}`,
    };
  }

  getBaseUrl() {
    return getTasklistCredentials().CAMUNDA_TASKLIST_BASE_URL;
  }
}
