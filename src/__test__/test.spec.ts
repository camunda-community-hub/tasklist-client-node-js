import {TasklistApiClient} from "./../index"

jest.setTimeout(10000)

it("can request all tasks", async () => {
    const tasklist = new TasklistApiClient()
    const res = await tasklist.getAllTaskNames()
    console.log(res)
    expect(res).toBeTruthy()
})