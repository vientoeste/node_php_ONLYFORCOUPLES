import * as express from 'express';
import { ChildProcess, spawn } from 'child_process';

const app = express.default();

app.get('/exampleRouter', (req, res) => {
    const process = spawn('php', ["./ex.php", req.query.query]);
    process.stdout.on('data', (data) => {
        res.send(data.toString());
    });
});

app.listen(3001);