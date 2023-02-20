import { getTasklistToken } from "camunda-saas-oauth";
import { getTasklistCredentials } from "camunda-8-credentials-from-env"
import gotQl from 'gotql';
 
const pkg = require('../../package.json')

/**
 * @description The high-level client for the Tasklist GraphQL API
 * @example
 * ```
 * 
 * ```
 */
export class TasklistApiClient {
    private userAgentString: string;
    graphqlUrl: string;

    /**
     * @example
     * @description
     * 
     */
    constructor() {
        this.userAgentString = `tasklist-graphql-client-nodejs/${pkg.version}`
        const creds = getTasklistCredentials()
        this.graphqlUrl = `${creds.CAMUNDA_TASKLIST_BASE_URL}/graphql`
    }

    private async getHeaders() {
        return {
            'content-type': 'application/json',
            'authorization': `Bearer ${await getTasklistToken(this.userAgentString)}`,
            'user-agent': this.userAgentString,
            'accept': '*/*'
        }
    }

    public async getAllTaskNames() {
        const headers = await this.getHeaders()
        const query = {
            operation: {
                name: 'tasks',
                args: {
                    query: {}
                },
                fields: ['name']
            }
        }
        return gotQl.query(this.graphqlUrl, 
            query,
            {headers},
        ).then(res => res.data)
    }
}