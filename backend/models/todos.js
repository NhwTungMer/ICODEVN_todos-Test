const db = require('../db');

function getTodos() {
    return db.table('todos').select('*').orderBy('id', 'desc')
}

function createTodo({ title, description, due_date }) {
    return db('todos').insert({ title, description, due_date });
}

function updateTodo(id, { title, description, due_date, is_completed }) {
    const updateData = {
        updated_at: db.fn.now()
    };
    if (title !== undefined) updateData.title = title;
    if (description !== undefined) updateData.description = description;
    if (due_date !== undefined) updateData.due_date = due_date;
    if (is_completed !== undefined) updateData.is_completed = is_completed;
    return db('todos')
        .where({ id })
        .update(updateData);
}

function deleteTodo(id) {
    return db('todos').where({ id }).del();
}

function filterTodos(status) {
    if (status === 'completed') {
        return db('todos').where({ is_completed: 1 });
    } else if (status === 'incomplete') {
        return db('todos').where({ is_completed: 0 });
    } else {
        return db('todos').select('*');
    }
}

function getTodoById(id) {
    return db('todos').where({ id }).first();
}

module.exports = {
    getTodos,
    createTodo,
    updateTodo,
    deleteTodo,
    filterTodos,
    getTodoById
}
