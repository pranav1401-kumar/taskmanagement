const express = require('express');
const { body, validationResult } = require('express-validator');
const { pool } = require('../config/database');
const { authenticateToken } = require('../middleware/auth');
const multer = require('multer');
const ExcelJS = require('exceljs');
const csv = require('csv-parser');
const fs = require('fs');
const path = require('path');

const router = express.Router();

// Configure multer for file uploads
const upload = multer({
  dest: 'uploads/',
  fileFilter: (req, file, cb) => {
    const allowedTypes = [
      'application/vnd.ms-excel',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      'text/csv'
    ];
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Invalid file type. Only Excel and CSV files are allowed.'), false);
    }
  }
});

// Get all tasks for the authenticated user
router.get('/', authenticateToken, async (req, res) => {
  try {
    const [tasks] = await pool.promise().execute(
      'SELECT * FROM tasks WHERE user_id = ? ORDER BY created_at DESC',
      [req.user.id]
    );

    res.json(tasks);
  } catch (error) {
    console.error('Error fetching tasks:', error);
    res.status(500).json({ message: 'Error fetching tasks' });
  }
});

// Get single task
router.get('/:id', authenticateToken, async (req, res) => {
  try {
    const [tasks] = await pool.promise().execute(
      'SELECT * FROM tasks WHERE id = ? AND user_id = ?',
      [req.params.id, req.user.id]
    );

    if (tasks.length === 0) {
      return res.status(404).json({ message: 'Task not found' });
    }

    res.json(tasks[0]);
  } catch (error) {
    console.error('Error fetching task:', error);
    res.status(500).json({ message: 'Error fetching task' });
  }
});

// Create new task
router.post('/', [
  authenticateToken,
  body('title').notEmpty().withMessage('Title is required'),
  body('description').optional(),
  body('effort_days').isInt({ min: 1 }).withMessage('Effort must be at least 1 day'),
  body('due_date').isISO8601().withMessage('Please provide a valid due date')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { title, description, effort_days, due_date } = req.body;

    const [result] = await pool.promise().execute(
      'INSERT INTO tasks (user_id, title, description, effort_days, due_date) VALUES (?, ?, ?, ?, ?)',
      [req.user.id, title, description || '', effort_days, due_date]
    );

    const [newTask] = await pool.promise().execute(
      'SELECT * FROM tasks WHERE id = ?',
      [result.insertId]
    );

    res.status(201).json({
      message: 'Task created successfully',
      task: newTask[0]
    });
  } catch (error) {
    console.error('Error creating task:', error);
    res.status(500).json({ message: 'Error creating task' });
  }
});

// Update task
router.put('/:id', [
  authenticateToken,
  body('title').notEmpty().withMessage('Title is required'),
  body('description').optional(),
  body('effort_days').isInt({ min: 1 }).withMessage('Effort must be at least 1 day'),
  body('due_date').isISO8601().withMessage('Please provide a valid due date'),
  body('status').optional().isIn(['pending', 'in_progress', 'completed']).withMessage('Invalid status')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { title, description, effort_days, due_date, status } = req.body;

    // Check if task exists and belongs to user
    const [existingTasks] = await pool.promise().execute(
      'SELECT id FROM tasks WHERE id = ? AND user_id = ?',
      [req.params.id, req.user.id]
    );

    if (existingTasks.length === 0) {
      return res.status(404).json({ message: 'Task not found' });
    }

    await pool.promise().execute(
      'UPDATE tasks SET title = ?, description = ?, effort_days = ?, due_date = ?, status = ? WHERE id = ? AND user_id = ?',
      [title, description || '', effort_days, due_date, status || 'pending', req.params.id, req.user.id]
    );

    const [updatedTask] = await pool.promise().execute(
      'SELECT * FROM tasks WHERE id = ?',
      [req.params.id]
    );

    res.json({
      message: 'Task updated successfully',
      task: updatedTask[0]
    });
  } catch (error) {
    console.error('Error updating task:', error);
    res.status(500).json({ message: 'Error updating task' });
  }
});

// Delete task
router.delete('/:id', authenticateToken, async (req, res) => {
  try {
    const [result] = await pool.promise().execute(
      'DELETE FROM tasks WHERE id = ? AND user_id = ?',
      [req.params.id, req.user.id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Task not found' });
    }

    res.json({ message: 'Task deleted successfully' });
  } catch (error) {
    console.error('Error deleting task:', error);
    res.status(500).json({ message: 'Error deleting task' });
  }
});

// Export tasks to Excel
router.get('/export/excel', authenticateToken, async (req, res) => {
  try {
    const [tasks] = await pool.promise().execute(
      'SELECT title, description, effort_days, due_date, status, created_at FROM tasks WHERE user_id = ? ORDER BY created_at DESC',
      [req.user.id]
    );

    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Tasks');

    // Add headers
    worksheet.columns = [
      { header: 'Title', key: 'title', width: 30 },
      { header: 'Description', key: 'description', width: 50 },
      { header: 'Effort (Days)', key: 'effort_days', width: 15 },
      { header: 'Due Date', key: 'due_date', width: 15 },
      { header: 'Status', key: 'status', width: 15 },
      { header: 'Created At', key: 'created_at', width: 20 }
    ];

    // Add data
    tasks.forEach(task => {
      worksheet.addRow({
        title: task.title,
        description: task.description,
        effort_days: task.effort_days,
        due_date: task.due_date,
        status: task.status,
        created_at: task.created_at
      });
    });

    // Style the header row
    worksheet.getRow(1).font = { bold: true };
    worksheet.getRow(1).fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: 'FFCCCCCC' }
    };

    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.setHeader('Content-Disposition', `attachment; filename="tasks-${Date.now()}.xlsx"`);

    await workbook.xlsx.write(res);
    res.end();
  } catch (error) {
    console.error('Error exporting tasks:', error);
    res.status(500).json({ message: 'Error exporting tasks' });
  }
});

// Upload bulk tasks
router.post('/bulk-upload', authenticateToken, upload.single('file'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }

    const filePath = req.file.path;
    const tasks = [];
    let errors = [];

    if (req.file.mimetype === 'text/csv') {
      // Handle CSV file
      await new Promise((resolve, reject) => {
        fs.createReadStream(filePath)
          .pipe(csv())
          .on('data', (row) => {
            try {
              const task = {
                title: row.title || row.Title,
                description: row.description || row.Description || '',
                effort_days: parseInt(row.effort_days || row['Effort (Days)'] || row.effort || 1),
                due_date: new Date(row.due_date || row['Due Date']).toISOString().split('T')[0]
              };

              if (!task.title || !task.due_date || isNaN(task.effort_days)) {
                errors.push(`Invalid row data: ${JSON.stringify(row)}`);
              } else {
                tasks.push(task);
              }
            } catch (error) {
              errors.push(`Error processing row: ${JSON.stringify(row)} - ${error.message}`);
            }
          })
          .on('end', resolve)
          .on('error', reject);
      });
    } else {
      // Handle Excel file
      const workbook = new ExcelJS.Workbook();
      await workbook.xlsx.readFile(filePath);
      const worksheet = workbook.getWorksheet(1);

      worksheet.eachRow((row, rowNumber) => {
        if (rowNumber === 1) return; // Skip header row

        try {
          const task = {
            title: row.getCell(1).value,
            description: row.getCell(2).value || '',
            effort_days: parseInt(row.getCell(3).value) || 1,
            due_date: new Date(row.getCell(4).value).toISOString().split('T')[0]
          };

          if (!task.title || !task.due_date || isNaN(task.effort_days)) {
            errors.push(`Invalid data in row ${rowNumber}`);
          } else {
            tasks.push(task);
          }
        } catch (error) {
          errors.push(`Error processing row ${rowNumber}: ${error.message}`);
        }
      });
    }

    // Clean up uploaded file
    fs.unlinkSync(filePath);

    if (tasks.length === 0) {
      return res.status(400).json({ 
        message: 'No valid tasks found in the file',
        errors 
      });
    }

    // Insert tasks into database
    const insertedTasks = [];
    for (const task of tasks) {
      try {
        const [result] = await pool.promise().execute(
          'INSERT INTO tasks (user_id, title, description, effort_days, due_date) VALUES (?, ?, ?, ?, ?)',
          [req.user.id, task.title, task.description, task.effort_days, task.due_date]
        );
        insertedTasks.push({ ...task, id: result.insertId });
      } catch (error) {
        errors.push(`Failed to insert task "${task.title}": ${error.message}`);
      }
    }

    res.json({
      message: `Successfully imported ${insertedTasks.length} tasks`,
      imported: insertedTasks.length,
      errors: errors.length > 0 ? errors : undefined
    });
  } catch (error) {
    console.error('Error uploading bulk tasks:', error);
    
    // Clean up file if it exists
    if (req.file && fs.existsSync(req.file.path)) {
      fs.unlinkSync(req.file.path);
    }
    
    res.status(500).json({ message: 'Error processing bulk upload' });
  }
});

module.exports = router;