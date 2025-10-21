const express = require('express');
const app = express();
require('dotenv').config();
const cors = require('cors');
const path = require('path');
require("dotenv").config();
const body_parser = require("body-parser")

const PORT = process.env.PORT || 3300;

app.use(body_parser.json());
app.use(body_parser.urlencoded({ extended: true, }));
app.use('/public', express.static(path.join(__dirname, 'public')));

app.use(cors({ origin: '*' }));


const UsersRouter = require('./Router/UsersRouter');
const StudentsRouter = require('./Router/StudentsRouter');

app.use('/Users', UsersRouter);
app.use('/Students', StudentsRouter);



app.get('/', (req, res) => {
    res.send('hii i am habib abubakar ... !');
});

app.listen(PORT, (error) => {
    if (error) {
        console.error('Error starting server:', error);
    } else {
        console.log(`Server is running on port ${PORT}`);
    }
});