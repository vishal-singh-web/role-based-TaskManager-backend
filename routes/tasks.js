const { Router } = require('express');
const router = Router();
const { body, validationResult } = require('express-validator');
const fetchuser = require('../middleware/fetchuser');
const Tasks = require('../models/Tasks');

const validate = validations => {
  return async (req, res, next) => {  
    for (const validation of validations) {
      await validation.run(req);
    }
    next();
  };
};

router.post('/addtask', fetchuser, validate([
  body('title', 'Title cannot be less than 3 characters').isLength({ min: 3 }),
  body('description', 'Description cannot be less than 5 characters').isLength({ min: 5 }),
]), async (req, res) => {
  try {
    const { title, description, priority, status } = req.body;
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    const note = new Tasks({ 
      title,
      description,
      priority,
      status,
      user: req.user.id
    });
    const savedNote = await note.save();
    res.json(savedNote);
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal Server Error');
  }
});

router.put('/updatetask/:id', fetchuser, async (req, res) => {
  try {
    const { title, description, priority, status } = req.body;
    const newTask = {};
    if (title) newTask.title = title;
    if (description) newTask.description = description;
    if (priority) newTask.priority = priority;
    if (status) newTask.status = status;

    let task = await Tasks.findById(req.params.id);
    if (!task) {
      return res.status(404).send('Not Found');
    }
    if (task.user.toString() !== req.user.id) {
      return res.status(401).send('Not Allowed');
    }

    task = await Tasks.findByIdAndUpdate(req.params.id, { $set: newTask }, { new: true });
    res.json(task);
  } catch (error) {
    console.error(error.message);
    res.status(500).send('Internal Server Error');
  }
});

router.delete('/deletetask/:id', fetchuser, async (req, res) => {
  try {
    let task = await Tasks.findById(req.params.id);
    if (!task) {
      return res.status(404).send('Not Found');
    }
    if (task.user.toString() !== req.user.id) {
      return res.status(401).send('Not Allowed');
    }

    await Tasks.findByIdAndDelete(req.params.id); 
    res.send("Task deleted");
  } catch (error) {
    console.error(error.message);
    res.status(500).send('Internal Server Error');
  }
});

router.get('/fetchtasks', fetchuser, async (req, res) => {
  try {
    let tasks = {};
     if (req.user.role === 'admin') {
      tasks = await Tasks.find({});
    } else {
      tasks = await Tasks.find({ user: req.user.id });
    }
    res.json(tasks);
  } catch (error) {
    console.error(error.message);
    res.status(500).send('Internal Server Error');
  }
});

module.exports = router;