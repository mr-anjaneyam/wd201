
const todoList = require("../todo");
const { all, add, markAsComplete, overdue, dueToday, dueLater } = todoList();

describe("Todo List Test suite", () => {
  // Before starting all tests
  beforeAll(() => {
    add({
      title: "Test todo",
      dueDate: new Date().toLocaleDateString("en-CA"),
      completed: false,
    });
  });
  test("Creating a new todo", () => {
    const todoLength = all.length;
    add({
      title: "Test todo",
      dueDate: new Date().toLocaleDateString("en-CA"),
      completed: false,
    });
    expect(all.length).toBe(todoLength + 1);
  });

  test("Todo Complete", () => {
    markAsComplete(0);
    expect(all[0].completed).toBe(true);
  });

  test("Todo Overdue", () => {
    add({
      title: "Test overdue",
      dueDate: new Date(
        new Date().setDate(new Date().getDate() - 1)
      ).toLocaleDateString("en-CA"),
      completed: false,
    });
    expect(overdue().length).toBe(1);
  });

  test("Todos due today", () => {
    
    expect(dueToday().length).toBe(2);
  });

  test("Todos due later", () => {
    add({
      title: "Test due later",
      dueDate: new Date(
        new Date().setDate(new Date().getDate() + 1)
      ).toLocaleDateString("en-CA"),
      completed: false,
    });
    expect(dueLater().length).toBe(1);
  });
});
