import { TaskState } from "../lib/Types"
import {TasklistApiClient} from "./../index"

it("can request all tasks", async () => {
    const tasklist = new TasklistApiClient()
    const res = await tasklist.getAllTasks()
    expect(res).toBeTruthy()
})

it("can request a task with parameters", async () => {
    const tasklist = new TasklistApiClient()
    const res = await tasklist.getTasks({
        state: TaskState.CREATED
    })
    expect(res).toBeTruthy()
})

it("can request a task with fields", async () => {
    const tasklist = new TasklistApiClient()
    const res = await tasklist.getTasks({}, ['id','processName'])
    console.log(res)
    expect(res).toBeTruthy()
    expect(res!.tasks[0].name).not.toBeDefined()
    expect(res!.tasks[0].processName).toBeTruthy()
})