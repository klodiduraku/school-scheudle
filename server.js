//******************* IMPORTANT

// you have to update teachers.xls when change anything

// delete old file and upload new file with updated info

//********************** */

const express = require('express');
const XLSX = require('xlsx');
const path = require('path');
const fs = require('fs');

const app = express();
const port = 3000;

// Middleware to log all requests
app.use((req, res, next) => {
    console.log(`Request received: ${req.method} ${req.url}`);
    next();
});

// Serve static files from the root directory
app.use(express.static(__dirname, {
    setHeaders: (res, path, stat) => {
        console.log(`Serving static file: ${path}`);
    }
}));

// API endpoint to get teacher data
app.get('/api/teachers', (req, res) => {
    try {
        const excelPath = path.join(__dirname, 'teachers.xlsx');
        console.log(`Attempting to read Excel file from: ${excelPath}`);
        if (fs.existsSync(excelPath)) {
            const workbook = XLSX.readFile(excelPath);
            const sheetName = workbook.SheetNames[0];
            const worksheet = workbook.Sheets[sheetName];
            const teachers = XLSX.utils.sheet_to_json(worksheet, {raw: false, defval: ""});
            res.json(teachers);
        } else {
            console.error('Excel file not found');
            res.status(404).json({ error: 'Teacher data file not found' });
        }
    } catch (error) {
        console.error('Error reading Excel file:', error);
        res.status(500).json({ error: 'Error reading teacher data' });
    }
});

// Serve the HTML file
app.get('/', (req, res) => {
    const indexPath = path.join(__dirname, 'index.html');
    console.log(`Attempting to serve index.html from: ${indexPath}`);
    if (fs.existsSync(indexPath)) {
        res.sendFile(indexPath);
    } else {
        console.error('index.html not found');
        res.status(404).send('index.html not found');
    }
});

// Catch-all route for debugging
app.use((req, res) => {
    console.log(`404 - Route not found: ${req.method} ${req.url}`);
    res.status(404).send('Route not found');
});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
    console.log(`Serving files from: ${__dirname}`);
    console.log(`index.html expected location: ${path.join(__dirname, 'index.html')}`);
    console.log(`teachers.xlsx expected location: ${path.join(__dirname, 'teachers.xlsx')}`);
    
    // List files in the current directory
    console.log('Files in the current directory:');
    fs.readdirSync(__dirname).forEach(file => {
        console.log(file);
    });
});