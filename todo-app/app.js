const express = require("express");
require('dotenv').config()
const app = express();
const { Todo } = require("./models");
const bodyParser = require("body-parser");
const path = require("path");
app.use(bodyParser.json());
app.set("view engine", "ejs");
app.use(express.static(path.join(__dirname, "public")));

app.set("views", path.join(__dirname, "views"));
app.get("/", async (request, response) => {
  try {
    const todos = await Todo.getTodos();
    if (request.accepts("html")) {
      response.render("index", {
        allTodos: todos,
      });
    } else {
      response.json({
        allTodos: todos,
      });
    }
  } catch (error) {
    console.log(error);
    response.status(422).json(error);
  }
});

app.get("/todos", async (request, response) => {
  try {
    const todos = await Todo.getTodos();
    response.json(todos);
  } catch (error) {
    console.log(error);
    response.status(422).json(error);
  }
});

app.get("/todos/:id", async (request, response) => {
  try {
    const todo = await Todo.findByPk(request.params.id);
    response.json(todo);
  } catch (error) {
    console.log(error);
    response.status(422).json(error);
  }
});

app.post("/todos", async (request, response) => {
  try {
    const todo = await Todo.addTodo(request.body);
    response.json(todo);
  } catch (error) {
    console.log(error);
    response.status(422).json(error);
  }
});

app.put("/todos/:id/markAsCompleted", async (request, response) => {
  try {
    const todo = await Todo.findByPk(request.params.id);
    const updatedTodo = await todo.markAsCompleted();
    response.json(updatedTodo);
  } catch (error) {
    console.log(error);
    response.status(422).json(error);
  }
});

app.delete("/todos/:id", async (request, response) => {
  try {
    const deletedItem = await Todo.destroy({
      where: {
        id: request.params.id,
      },
    });
    response.send(deletedItem ? true : false);
  } catch (error) {
    console.error(error);
    response.status(422).json(error);
  }
});

module.exports = app;
