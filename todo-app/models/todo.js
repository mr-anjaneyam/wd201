const { DataTypes } = require('sequelize');
const db = require('./index');

const Todo = db.define('Todo', {
  title: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  dueDate: {
    type: DataTypes.DATE,
    allowNull: false,
  },
  completed: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
});

Todo.addTodo = async function (todoData) {
  try {
    const todo = await this.create(todoData);
    return todo;
  } catch (error) {
    throw error;
  }
};

Todo.setCompletionStatus = async function (id, status) {
  try {
    const todo = await this.findByPk(id);
    if (todo) {
      await todo.update({ completed: status });
      return todo;
    } else {
      throw new Error('Todo not found');
    }
  } catch (error) {
    throw error;
  }
};

Todo.remove = async function (id) {
  try {
    const todo = await this.findByPk(id);
    if (todo) {
      await todo.destroy();
    } else {
      throw new Error('Todo not found');
    }
  } catch (error) {
    throw error;
  }
};

Todo.allTodos = async function () {
  try {
    const Overdue = await this.findAll({ where: { dueDate: { [Op.lt]: new Date() }, completed: false } });
    const DueToday = await this.findAll({ where: { dueDate: { [Op.eq]: new Date() }, completed: false } });
    const DueLater = await this.findAll({ where: { dueDate: { [Op.gt]: new Date() }, completed: false } });
    const Complete = await this.findAll({ where: { completed: true } });

    return { Overdue, DueToday, DueLater, Complete };
  } catch (error) {
    throw error;
  }
};

module.exports = Todo;
