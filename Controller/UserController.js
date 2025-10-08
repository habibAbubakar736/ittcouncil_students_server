const pool = require('../Config/db_pool');
const jwt = require('jsonwebtoken');
require("dotenv").config();

exports.Login = async (req, res) => {
    const { student_pnr, login_password } = req.body;
    try {
        const [rows] = await pool.execute(
            'SELECT * FROM users WHERE student_pnr = ? AND login_password = ?',
            [student_pnr, login_password]
        );

        if (!rows?.length) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        const student = rows[0];

        const token = jwt.sign(
            { id: student.student_id },
            process.env.TOKEN_SECRET,
            { expiresIn: process.env.TOKEN_EXPIRES_IN }
        );

        student.token = token;

        res.json({
            success: true,
            message: 'Login successful',
            data: student
        });

    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
};