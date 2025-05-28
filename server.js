const express = require('express');
const mysql = require('mysql2');
const app = express();
const port = 3000;

// MySQL connection
const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'Pasi?ipm??1',  // Use your real password
  database: 'epms'
});

connection.connect((err) => {
  if (err) {
    console.error('❌ Failed to connect to the database');
    console.error(err);
    return;
  }
  console.log('✅ Connected to the database');
});

// Start server
app.listen(port, () => {
  console.log(`✅ App running on http://localhost:${port}`);
});


// Create: Add a new employee
app.post('/eadd', (req, res) => {
  const { fname, lname, position, address, telephone, gender, h_date } = req.body;
  const sql =
    'INSERT INTO employees (fname, lname, position, address, telephone, gender, h_date) VALUES (?, ?, ?, ?, ?, ?, ?)';
  db.query(sql, [fname, lname, position, address, telephone, gender, h_date], (err, result) => {
    if (err) return res.status(404).json('Failed to add employee');
    return res.status(200).json(result);
  });
});

// Read: Get all employees
app.get('/employees', (req, res) => {
  const sql = 'SELECT * FROM employees';
  db.query(sql, (err, result) => {
    if (err) return res.status(404).json('Failed to fetch employees');
    return res.status(200).json(result);
  });
});

// Read: Get a single employee by ID
app.get('/employees/:e_n', (req, res) => {
  const { e_n } = req.params;
  const sql = 'SELECT * FROM employees WHERE e_n = ?';
  db.query(sql, [e_n], (err, result) => {
    if (err) return res.status(404).json('Failed to fetch employee');
    if (result.length === 0) return res.status(404).json('Employee not found');
    return res.status(200).json(result[0]);
  });
});

// Update: Update an employee's details
app.put('/employees/:e_n', (req, res) => {
  const { e_n} = req.params;
  const { fname, lname, position, address, telephone, gender, h_date } = req.body;
  const sql =
    'UPDATE employees SET fname = ?, lname = ?, position = ?, address = ?, telephone = ?, gender = ?, h_date = ? WHERE e_n = ?';
  db.query(sql, [fname, lname, position, address, telephone, gender, h_date, e_n], (err, result) => {
    if (err) return res.status(404).json('Failed to update employee');
    if (result.affectedRows === 0) return res.status(404).json('Employee not found');
    return res.status(200).json('Employee updated successfully');
  });
});

// Delete: Remove an employee
app.delete('/employees/:e_n', (req, res) => {
  const { e_n} = req.params;
  const sql = 'DELETE FROM employees WHERE e_n = ?';
  db.query(sql, [e_n], (err, result) => {
    if (err) return res.status(404).json('Failed to delete employee');
    if (result.affectedRows === 0) return res.status(404).json('Employee not found');
    return res.status(200).json('Employee deleted successfully');
  });
});

//////////////////DEPARTMENT DETAILS //////////////////////

app.get('/departments', (req, res) => {
  db.query('SELECT * FROM department', (err, results) => {
    if (err) throw err;
    res.json(results);
  });
});

// GET department by d_code
app.get('/departments/:d_code', (req, res) => {
  db.query('SELECT * FROM department WHERE d_code = ?', [req.params.d_code], (err, results) => {
    if (err) throw err;
    res.json(results[0]);
  });
});

// POST new department
app.post('/departments', (req, res) => {
  const { d_code, d_name, gross_salary } = req.body;
  const sql = 'INSERT INTO department (d_code, d_name, gross_salary) VALUES (?, ?, ?)';
  db.query(sql, [d_code, d_name, gross_salary], (err, result) => {
    if (err) throw err;
    res.status(201).json({ message: 'Department added', id: result.insertId });
  });
});

///register  

app.post('/register', (req, res) => {
  const { name,password } = req.body;
  const sql = 'INSERT INTO admin (name,password) VALUES (?, ?)';
  db.query(sql, [name,password], (err, result) => {
    if (err) throw err;
    res.status(201).json({ message: 'Department added', id: result.insertId });
  });
});

// PUT update department
app.put('/departments/:d_code', (req, res) => {
  const { d_name, gross_salary } = req.body;
  const sql = 'UPDATE department SET d_name = ?, gross_salary = ? WHERE d_code = ?';
  db.query(sql, [d_name, gross_salary, req.params.d_code], (err) => {
    if (err) throw err;
    res.json({ message: 'Department updated' });
  });
});

// DELETE department
app.delete('/department/:d_code', (req, res) => {
  db.query('DELETE FROM department WHERE d_code = ?', [req.params.d_code], (err) => {
    if (err) throw err;
    res.json({ message: 'Department deleted' });
  });
});



/////////////////////salary////////////////
// CREATE: Add a new salary record
app.post('/salaries', (req, res) => {
  let { gross_salary, total_deduction, month } = req.body;

  // Parse inputs
  gloss_salary = parseInt(gross_salary);
  total_deduction = parseInt(total_deduction);
  month = month.replace('-', '');  // assuming month is in format YYYY-MM

  // Validate inputs
  if (
    !Number.isInteger(gross_salary) ||
    !Number.isInteger(total_deduction) ||
    isNaN(month) || month.length !== 6  // Ensures month is in YYYYMM format
  ) {
    return res.status(400).json({ message: 'All fields must be integers and month must be in YYYYMM format' });
  }

  const netSalary = gloss_salary - total_deduction;

  const sql = 'INSERT INTO salary (gloss_salary, total_deduction, netsalary, month) VALUES (?, ?, ?, ?)';
  db.query(sql, [gross_salary, total_deduction, netSalary, month], (err) => {
    if (err) {
      return res.status(500).json({ message: 'Error adding salary', error: err });
    }
    return res.status(201).json({ message: 'Salary added successfully' });
  });
});

// READ: Get all salary records
app.get('/salaries', (req, res) => {
  const sql = 'SELECT * FROM salary';
  db.query(sql, (err, results) => {
    if (err) return res.status(500).json({ message: 'Error fetching salaries', error: err });
    return res.status(200).json(results);
  });
});

// READ: Get a salary record by month
app.get('/salaries/:month', (req, res) => {
  const month = parseInt(req.params.month.replace('-', '')); // Convert month parameter to integer

  const sql = 'SELECT * FROM salary WHERE month = ?';
  db.query(sql, [month], (err, result) => {
    if (err) return res.status(500).json({ message: 'Error fetching salary', error: err });
    if (result.length === 0) return res.status(404).json({ message: 'Salary not found for this month' });
    return res.status(200).json(result[0]);
  });
});

// UPDATE: Update an existing salary record by month
app.put('/salaries/:month', (req, res) => {
  let { gloss_salary, total_deduction } = req.body;
  const month = parseInt(req.params.month.replace('-', '')); // Convert month to integer

  // Ensure gross_salary and total_deduction are integers
  gross_salary = parseInt(gross_salary);
  total_deduction = parseInt(total_deduction);

  // Validate inputs
  if (
    !Number.isInteger(gross_salary) ||
    !Number.isInteger(total_deduction)
  ) {
    return res.status(400).json({ message: 'gross_salary and total_deduction must be integers' });
  }

  const netsalary = gross_salary - total_deduction;

  const sql = 'UPDATE salary SET gloss_salary = ?, total_deduction = ?, netsalary = ? WHERE month = ?';
  db.query(sql, [gross_salary, total_deduction, netsalary, month], (err, result) => {
    if (err) return res.status(500).json({ message: 'Error updating salary', error: err });
    if (result.affectedRows === 0) return res.status(404).json({ message: 'Salary not found for this month' });
    return res.status(200).json({ message: 'Salary updated successfully' });
  });
});

// DELETE: Delete a salary record by month
app.delete('/salaries/:month', (req, res) => {
  const month = parseInt(req.params.month.replace('-', '')); // Convert month to integer

  const sql = 'DELETE FROM salary WHERE month = ?';
  db.query(sql, [month], (err, result) => {
    if (err) return res.status(500).json({ message: 'Error deleting salary', error: err });
    if (result.affectedRows === 0) return res.status(404).json({ message: 'Salary not found for this month' });
    return res.status(200).json({ message: 'Salary deleted successfully' });
  });
});


/////////////////////////


app.post('/login', (req, res) => {
    const sql = "SELECT * FROM admin WHERE name = ? AND password = ?";
    const { name, password } = req.body;

    db.query(sql, [name, password], (err, result) => {
        if (err) {
            console.error("Database error:", err);
            return res.status(500).json({ message: "Database error" });
        }

        if (result.length === 0) {
            return res.status(401).json({ message: "Invalid credentials" });
        }

        return res.status(200).json(result);
    });
});



/////report




app.get('/salary-report', (req, res) => {
  const query = `
    SELECT 
        d.d_name AS department_name,
        s.month,
        s.gross_salary,
        s.total_deduction,
        s.netsalary
    FROM 
        gross_salary s
    JOIN 
        department d ON s.d_code = d.d_code
    ORDER BY 
        s.month, d.d_name;
  `;

  db.query(query, (err, results) => {
    if (err) {
      console.error('Query error:', err.message);
      return res.status(500).json({ error: 'Internal server error' });
    }

    res.json(results);
  });
});


// Start the server
app.listen(3000, () => {
  console.log('App running on http://localhost:3000');
});