// server.js
const express = require('express');
const { exec } = require('child_process');

const app = express();
const port = 3000; // Use an appropriate port

app.get('/execute-bat', (req, res) => {
    // Path to your .bat file
    const batFilePath = 'C:\\path\\to\\your\\script.bat';

    // Execute the .bat file
    exec(`cmd.exe /c "${batFilePath}"`, (error, stdout, stderr) => {
        if (error) {
            console.error(`Error executing batch file: ${error}`);
            return res.status(500).send(`Error: ${error.message}`);
        }

        if (stderr) {
            console.error(`Batch file stderr: ${stderr}`);
            return res.status(500).send(`Stderr: ${stderr}`);
        }

        console.log(`Batch file output: ${stdout}`);
        res.send(`Batch file executed successfully: ${stdout}`);
    });
});

app.listen(port, () => {
    console.log(`Server listening on http://localhost:${port}`);
});
