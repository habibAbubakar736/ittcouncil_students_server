const pool = require("../Config/db_pool");
const { global } = require("../Config/global");

exports.GetStudentsProfile = async (req, res) => {
    try {
        const { student_id } = req.query;

        const [student_info] = await pool.query(`SELECT *,
             CONCAT('${global.base_file_server_url}public/StudentsPicture/', photo) AS student_profile_url
             FROM students WHERE student_id = ?`, [student_id])
        return res.json({ success: true, data: student_info })

    } catch (error) {
        console.log("Get Student profile error : ", error);
        return res.json({ success: false, message: "Internal server error : ", error });
    }
}

// ------------------------- upcoming exam ------------------------- // 
exports.GetUpcomingExam = async (req, res) => {
    try {

        const { student_id } = req.headers;

        if (!student_id) {
            return res.json({ success: false, message: "student_id is required" })
        }

        const query = `
        SELECT
        students__subjects.*,
        masters__subjects.*,
        masters__programs.program_title,
        masters__programs.program_short_title,
        masters__programs.program_duration
        FROM students__subjects
        LEFT JOIN programs ON students__subjects.program_id = programs.program_id
        LEFT JOIN masters__programs ON programs.master_program_id = masters__programs.master_program_id
        LEFT JOIN masters__subjects ON students__subjects.master_subject_id = masters__subjects.master_subject_id
        WHERE students__subjects.student_id = ? AND students__subjects.exam_status = 1
        `

        const [rows] = await pool.query(query, [student_id]);
        return res.json({ success: true, data: rows })

    } catch (error) {
        console.log("error", error);
        return res.json({ success: false, message: "Internal server server", error });
    }
}

exports.ExamQuestion = async (req, res) => {
    try {

        const { master_subject_id } = req.query;

        const [rows] = await pool.query(`SELECT * FROM exams__questions WHERE master_subject_id = ?`, [master_subject_id])
        return res.json({ success: true, data: rows })

    } catch (error) {
        console.log(error);
        return res.json({ success: false, message: "Internal server error", error });
    }
} 