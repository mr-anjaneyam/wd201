/* eslint-disable no-undef */
const myDB = require("../models");
const calculateDueDate = (days) => {
  if (!Number.isInteger(days)) {
    throw new Error("Days must be an integer");
  }
  const today = new Date();
  const oneDay = 86400000;
  return new Date(today.getTime() + days * oneDay)
}
describe("Tests for functions in todo.js", function () {
  beforeAll(async () => {
    await myDB.sequelize.sync({ force: true })
  });

  test("Todo.overdue should return all tasks (including completed ones) that are past their due date", async () => {
    const todo = await myDB.Todo.addTask({ title: "This is a sample item", dueDate: calculateDueDate(-2), completed: false });
    const items = await myDB.Todo.overdue();
    expect(items.length).toBe(1);
  });

  test("Todo.dueToday should return all tasks that are due today (including completed ones)", async () => {
    const dueTodayItems = await myDB.Todo.dueToday();
    const todo = await myDB.Todo.addTask({ title: "This is a sample item", dueDate: calculateDueDate(0), completed: false });
    const items = await myDB.Todo.dueToday();
    expect(items.length).toBe(dueTodayItems.length + 1);
  });

  test("Todo.dueLater should return all tasks that are due on a future date (including completed ones)", async () => {
    const dueLaterItems = await myDB.Todo.dueLater();
    const todo = await myDB.Todo.addTask({ title: "This is a sample item", dueDate: calculateDueDate(2), completed: false });
    const items = await myDB.Todo.dueLater();
    expect(items.length).toBe(dueLaterItems.length + 1);
  });

  test("Todo.markAsComplete should change the `completed` property of a todo to `true`", async () => {
    const overdueItems = await myDB.Todo.overdue()
    const aTodo = overdueItems[0];
    expect(aTodo.completed).toBe(false);
    await myDB.Todo.markAsComplete(aTodo.id);
    await aTodo.reload();

    expect(aTodo.completed).toBe(true);
  })

  test("For a completed past-due item, Todo.displayableString should return a string of the format `ID. [x] TITLE DUE_DATE`", async () => {
    const overdueItems = await myDB.Todo.overdue()
    const aTodo = overdueItems[0];
    expect(aTodo.completed).toBe(true);
    const displayValue = aTodo.displayableString()
    expect(displayValue).toBe(`${aTodo.id}. [x] ${aTodo.title} ${aTodo.dueDate}`)
  })

  test("For an incomplete todo in the future, Todo.displayableString should return a string of the format `ID. [ ] TITLE DUE_DATE`", async () => {
    const dueLaterItems = await myDB.Todo.dueLater()
    const aTodo = dueLaterItems[0];
    expect(aTodo.completed).toBe(false);
    const displayValue = aTodo.displayableString()
    expect(displayValue).toBe(`${aTodo.id}. [ ] ${aTodo.title} ${aTodo.dueDate}`)
  })

  test("For an incomplete todo due today, Todo.displayableString should return a string of the format `ID. [ ] TITLE` (date should not be shown)", async () => {
    const dueTodayItems = await myDB.Todo.dueToday()
    const aTodo = dueTodayItems[0];
    expect(aTodo.completed).toBe(false);
    const displayValue = aTodo.displayableString()
    expect(displayValue).toBe(`${aTodo.id}. [ ] ${aTodo.title}`)
  })

  test("For a complete todo due today, Todo.displayableString should return a string of the format `ID. [x] TITLE` (date should not be shown)", async () => {
    const dueTodayItems = await myDB.Todo.dueToday()
    const aTodo = dueTodayItems[0];
    expect(aTodo.completed).toBe(false);
    await myDB.Todo.markAsComplete(aTodo.id);
    await aTodo.reload();
    const displayValue = aTodo.displayableString()
    expect(displayValue).toBe(`${aTodo.id}. [x] ${aTodo.title}`)
  })
});
