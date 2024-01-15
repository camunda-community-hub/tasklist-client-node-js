import { TaskQuery as TaskQueryQl, Task as TaskQl } from "./Types";

export namespace REST {
    export enum TaskState {
        CREATED,
        COMPLETED,
        CANCELED,
    }

    export interface TaskQuery extends Omit<TaskQueryQl, "state"> {
        state: TaskState;
    }

    export interface Task
        extends Omit<TaskQl, "processDefinitionId" | "processInstanceId" | "creationTime" | "completionTime"> {
        processDefinitionKey: string;
        processInstanceKey: string;
        creationDate: string;
        completionDate: string | null;
        dueDate: string | null;
        followUpDate: string | null;
        candidateUsers: string[] | null;
    }

    export interface TaskWithVariables<T = { [key: string]: any }> extends Omit<Task, "variables"> {
        variables: T;
    }
}
