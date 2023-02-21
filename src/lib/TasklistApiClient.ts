import { getTasklistToken } from "camunda-saas-oauth";
import { getTasklistCredentials } from "camunda-8-credentials-from-env"
import gotQl from 'gotql';
import { Form, GraphQLTaskQuery, GraphQLTasksQuery, Task, TaskFields, TaskQuery, User, Variable, VariableInput } from "./Types";
 
const pkg = require('../../package.json')

const defaultFields: TaskFields  = [
    'assignee', 
    'candidateGroups', 
    'completionTime', 
    'creationTime',
    'formKey',
    'id',
    'isFirst',
    'name',
    'processDefinitionId',
    'processName',
    'sortValues',
    'taskDefinitionId',
    'taskState',
]

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

    /**
     * @description Query Tasklist for a list of tasks. See the [API documentation](https://docs.camunda.io/docs/apis-clients/tasklist-api/queries/tasks/).
     * @example
     * ```
     * const tasklist = new TasklistApiClient()
     * 
     * async function getTasks() { 
     *   const res = await tasklist.getTasks({
     *     state: TaskState.CREATED
     *   }, ['id', 'name', 'processName'])
     *   console.log(res ? 'Nothing' : JSON.stringify(res.tasks, null, 2))
     *   return res
     * }
     * ```
     * @param query 
     * @param fields - a list of fields to return in the query results
     * @returns 
     */
    public async getTasks(query: Partial<TaskQuery>, fields: TaskFields = defaultFields): Promise<null | {tasks: Task[]}> {
        const headers = await this.getHeaders()
        const q: GraphQLTasksQuery = {
            operation: {
                name: 'tasks',
                args: {
                    query
                },
                fields
            }
        }
        return gotQl.query(this.graphqlUrl,
            q,
            {headers}
        ).then(res => res.data)
    }

    public async getAllTasks(fields: TaskFields = [
        'assignee', 
        'candidateGroups', 
        'completionTime', 
        'creationTime',
        'formKey',
        'id',
        'isFirst',
        'name',
        'processDefinitionId',
        'processName',
        'sortValues',
        'taskDefinitionId',
        'taskState',
        ]) {
        const headers = await this.getHeaders()
        const query: GraphQLTasksQuery = {
            operation: {
                name: 'tasks',
                args: {
                    query: {}
                },
                fields
            }
        }
        return gotQl.query(this.graphqlUrl, 
            query,
            {headers},
        ).then(res => res.data)
    }

    /**
     * @description https://docs.camunda.io/docs/apis-clients/tasklist-api/queries/task/
     * @param id 
     * @param fields 
     * @returns 
     */
    public async getTask(id: string, fields = defaultFields) {
        const headers = await this.getHeaders()
        const query: GraphQLTaskQuery = {
            operation: {
                name: 'task',
                args: {
                    query: {
                        id
                    }
                },
                fields
            }
        }
        return gotQl.query(this.graphqlUrl, 
            query,
            {headers},
        ).then(res => res.data)        
    }

    /**
     * @description https://docs.camunda.io/docs/apis-clients/tasklist-api/queries/form/
     * @param id 
     * @param processDefinitionId 
     */
    public async getForm(id: string, processDefinitionId: string): Promise<Form> {
        throw new Error("Not implemented yet")
    }


    /**
     * @description https://docs.camunda.io/docs/apis-clients/tasklist-api/queries/current-user/
     */
    public async getCurrentUser(): Promise<User> {
        throw new Error("Not implemented yet")
    }

    /**
     * @description https://docs.camunda.io/docs/apis-clients/tasklist-api/queries/variables/
     * @param taskId 
     * @param variableNames 
     */
    public async getVariables(taskId: string, variableNames: string[]) {
        throw new Error("Not implemented yet")
    }

    /**
     * @description https://docs.camunda.io/docs/apis-clients/tasklist-api/queries/variable/
     * @param id 
     */
    public async getVariable(id: string): Promise<Variable> {
        throw new Error("Not implemented yet")
    }

    /**
     * @description https://docs.camunda.io/docs/apis-clients/tasklist-api/mutations/claim-task/
     * @param taskId 
     * @param assignee 
     * @param allowOverrideAssignment 
     */
    public async claimTask(taskId: string, assignee: string, allowOverrideAssignment: boolean): Promise<Task> {
        throw new Error("Not implemented yet")
    }

    /**
     * @description https://docs.camunda.io/docs/apis-clients/tasklist-api/mutations/complete-task/
     * @param taskId 
     * @param variables 
     */
    public async completeTask(taskId: string, variables: VariableInput[]): Promise<Task> {
        throw new Error("Not implemented yet")
    }

    /**
     * @description https://docs.camunda.io/docs/apis-clients/tasklist-api/mutations/delete-process-instance/
     * @param processInstanceId 
     */
    public async deleteProcessInstance(processInstanceId: string): Promise<boolean> {
        throw new Error("Not implemented yet")
    }

    /**
     * @description https://docs.camunda.io/docs/apis-clients/tasklist-api/mutations/unclaim-task/
     * @param taskId 
     */
    public async unclaimTask(taskId: string): Promise<Task> {
        throw new Error("Not implemented yet")
    }
}