const todosModel = require('../models/todos');

async function getTodos(req, res) {
    try {
        const todos = await todosModel.getTodos(req, res);
        res.status(200).json({
            message: "Todos fetched successfully",
            todos: todos
        });
    } catch (error) {
        res.status(500).json({
            message: "Error fetching todos",
            error: error.message
        });
    }
}

async function createTodo(req, res) {
    try {
        const { title, description, due_date } = req.body;
        if (!title) {
            return res.status(400).json({ message: 'Title is required' });
        }
        await todosModel.createTodo({ title, description, due_date });
        res.status(201).json({ message: 'Todo created successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error creating todo', error: error.message });
    }
}

async function updateTodo(req, res) {
    try {
        const { id } = req.params;
        let { title, description, due_date, is_completed } = req.body;
        const current = await todosModel.getTodoById(id);
        if (!current) {
            return res.status(404).json({ message: 'Todo not found' });
        }
        if (title === undefined) title = current.title;
        if (description === undefined) description = current.description;
        if (due_date === undefined) due_date = current.due_date;
        if (is_completed === undefined) is_completed = current.is_completed;
        await todosModel.updateTodo(id, { title, description, due_date, is_completed });
        res.status(200).json({ message: 'Todo updated successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error updating todo', error: error.message });
    }
}

async function deleteTodo(req, res) {
    try {
        const { id } = req.params;
        await todosModel.deleteTodo(id);
        res.status(200).json({ message: 'Todo deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting todo', error: error.message });
    }
}

async function filterTodos(req, res) {
    try {
        const { status } = req.query;
        const todos = await todosModel.filterTodos(status);
        res.status(200).json({ message: 'Todos fetched successfully', todos });
    } catch (error) {
        res.status(500).json({ message: 'Error fetching todos', error: error.message });
    }
}

async function markComplete(req, res) {
    try {
        const { id } = req.params;
        const current = await todosModel.getTodoById(id);
        if (!current) {
            return res.status(404).json({ message: 'Todo not found' });
        }
        await todosModel.updateTodo(id, { is_completed: 1 });
        res.status(200).json({ message: 'Todo marked as completed' });
    } catch (error) {
        res.status(500).json({ message: 'Error marking complete', error: error.message });
    }
}

module.exports = {
    getTodos,
    createTodo,
    updateTodo,
    deleteTodo,
    filterTodos,
    markComplete
}
