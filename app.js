const express = require('express');
const app = express();
app.use(express.json()); // Parse JSON bodies

let todos = [
  { id: 1, task: 'Learn Node.js', completed: false },
  { id: 2, task: 'Build CRUD API', completed: false },
];

// GET All – Read
app.get('/todos', (req, res) => {
  res.status(200).json(todos); // Send array as JSON
});

// POST New – Create
app.post('/todos', (req, res) => {
  // Validate that task is provided
  if (!req.body.task) {
    return res.status(400).json({ error: 'Task is required' });
  }
  const newTodo = {
    id: todos.length > 0 ? Math.max(...todos.map(t => t.id)) + 1 : 1,
    task: req.body.task,
    completed: req.body.completed || false
  };
  todos.push(newTodo);
  res.status(201).json(newTodo); // Echo back
});

// GET One – Read
app.get('/todos/:id', (req, res) => {
  const todo = todos.find((t) => t.id === parseInt(req.params.id));
  if (!todo) return res.status(404).json({ error: 'Todo not found' });
  res.status(200).json(todo);
});

// PUT Update
app.put('/todos/:id', (req, res) => {
  const todo = todos.find((t) => t.id === parseInt(req.params.id));
  if (!todo) return res.status(404).json({ error: 'Todo not found' });
  if (req.body.task) todo.task = req.body.task;
  if (req.body.completed !== undefined) todo.completed = req.body.completed;
  res.status(200).json(todo);
});

// DELETE Remove
app.delete('/todos/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const initialLength = todos.length;
  todos = todos.filter((t) => t.id !== id); // Array.filter() – non-destructive
  if (todos.length === initialLength)
    return res.status(404).json({ error: 'Not found' });
  res.status(204).send(); // Silent success
});

// GET Active – Bonus (Get all active todos)
app.get('/todos/active', (req, res) => {
  const active = todos.filter((t) => t.completed === false);
  res.json(active);
});

app.use((err, req, res, next) => {
  res.status(500).json({ error: 'Server error!' });
});

const PORT = 3002;
app.listen(PORT, () => console.log(`Server on port ${PORT}`));
