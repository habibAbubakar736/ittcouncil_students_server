const pool = require('../Config/db_pool');
const jwt = require('jsonwebtoken');


const ValidateHeader = async (header) => {
    try {

        if (!header.token || header.token === "") {
            return { success: false, message: "Token should not be null" };
        }

        const { student_id } = header;

        if (student_id) {
            const [student] = await pool.query(
                `SELECT * FROM students WHERE student_id = ?`,
                [student_id]
            );

            if (student.length === 0) {
                return { success: false, message: "Student Not Found...!" };
            } else {
                return { success: true, student_id, token: header.token };
            }
        } else {
            return { success: false, message: 'Invalid Header (student_id missing)' };
        }

    } catch (error) {
        throw error;
    }
};


exports.AuthMiddleware = async (req, res, next) => {
    const validate = await ValidateHeader(req.headers);

    if (!validate.success) return res.json({ success: false, message: validate.message });

    jwt.verify(validate.token, process.env.TOKEN_SECRET, (err, decoded) => {
        if (err) {
            return res.json({ success: false, message: "This token has expired" });
        } else {
            req.decoded = decoded;
            req.student_id = validate.student_id;
            next();
        }
    });
}