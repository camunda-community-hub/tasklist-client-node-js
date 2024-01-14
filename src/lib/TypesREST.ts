import { TaskQuery as TaskQueryQl } from "./Types";

export namespace REST {
    export enum TaskState {
        CREATED,
        COMPLETED,
        CANCELED,
    }

    export interface TaskQuery extends Omit<TaskQueryQl, "state"> {
        state: TaskState;
    }
}
