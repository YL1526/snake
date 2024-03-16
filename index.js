// 引入所需的模块
const express = require('express');
const bodyParser = require('body-parser');
const mysql = require('mysql');
const fs = require('fs');
const path = require('path');

// 创建Express应用
const app = express();
const port = 3000;

app.use(bodyParser.json());

// 创建与数据库的连接
const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'root',
    database: 'snake',
    insecureAuth: true
});

connection.connect();

// 贪吃蛇游戏
app.get('/snake', (req, res) => {
    const filePath = path.join(__dirname, 'SnakeGame.html');
    fs.readFile(filePath, (err, data) => {
        if (err) {
            res.status(500).send('Error reading SnakeGame.html');
        } else {
            res.setHeader('Content-Type', 'text/html');
            res.send(data);
        }
    });
});

// 处理POST请求，将分数存储到数据库
app.post('/saveScore', (req, res) => {
    const { playerName, score } = req.body;
    const sql = `INSERT INTO scores (playerName, score) VALUES ('${playerName}', ${score})`;

    connection.query(sql, (error, results) => {
        if (error) {
            res.status(500).send('Error saving score to database');
        } else {
            res.status(200).send('Score saved successfully');
        }
    });
});

// 启动服务器
app.listen(port, () => {
    console.log(`服务正在使用 ${port} 端口运行`);
});