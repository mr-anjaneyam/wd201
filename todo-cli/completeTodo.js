const db = require("./models/index");
const markAsComplete = async (id) => {
  try {
    await db.Todo.markAsComplete(id);
  } catch (error) {
    console.error(error);
  }
};

(
  async () => {
  const { id } = argv;
  if (!id) {
    throw new Error("Pass an ID");
  }
  if (!Number.isInteger(id)) {
    throw new Error("ID must be an integer");
  }
  await markAsComplete(id);
  await db.Todo.showList();
})();
