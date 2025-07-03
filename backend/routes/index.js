const express = require('express');
const router = express.Router();

const todosController = require('../controllers/todos')

router.get('/todos', todosController.getTodos)
router.get('/todos/filter', todosController.filterTodos)
router.post('/todos', todosController.createTodo)
router.put('/todos/:id', todosController.updateTodo)
router.put('/todos/:id/complete', todosController.markComplete)
router.delete('/todos/:id', todosController.deleteTodo)

module.exports = router;
