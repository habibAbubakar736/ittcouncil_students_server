const pool = require("../Config/db_pool");
const { global } = require("../Config/global");
const { PaginationQuery } = require("./Helper/QueryHelper");

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


exports.GetExamInfo = async (req, res) => {
    try {

        const { student_subject_id } = req.query;

        if (!student_subject_id) {
            return res.json({ success: false, message: "student_subject_id is required" });
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
        WHERE students__subjects.student_subject_id = ? AND students__subjects.exam_status = 1
        `

        const [info] = await pool.query(query, [student_subject_id]);
        return res.json({ success: true, data: info[0] })

    } catch (error) {
        console.log("error", error);
        return res.json({ success: false, message: "Internal server server", error });
    }
}

exports.GetStudentsProgram = async (req, res) => {
    try {

        const { student_id } = req.headers;

        let query = `SELECT 


         students__programs.student_program_id,
         students__programs.program_id,
         students__programs.student_id,
         students__programs.franchise_id,

         programs.*,
         masters__programs.*

         FROM students__programs
         LEFT JOIN programs ON students__programs.program_id = programs.program_id
         LEFT JOIN masters__programs ON programs.master_program_id = masters__programs.master_program_id
         WHERE student_id = ?`

        const [rows] = await pool.query(query, [student_id]);
        return res.json({ success: true, data: rows })

    } catch (error) {
        console.log("error : ", error);
        return res.json({ success: false, message: "Internal server error" })
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


exports.GetPassOutSubjects = async (req, res) => {
    try {
        const { student_id, limit, page } = req.query;

        if (!student_id) {
            return res.status(400).json({ success: false, message: "student_id is required" });
        }

        let query_count = `SELECT COUNT(*) AS total_records FROM students__subjects WHERE student_id = ? AND exam_status = 2`;
        let query = `
            SELECT 
                students__subjects.student_subject_id,
                students__subjects.student_program_id,
                students__subjects.exam_status,
                students__subjects.total_marks,
                students__subjects.obtain_marks,
                students__subjects.master_subject_id,
                masters__subjects.subject_title
            FROM students__subjects
            LEFT JOIN masters__subjects 
                ON students__subjects.master_subject_id = masters__subjects.master_subject_id
            WHERE students__subjects.student_id = ? AND students__subjects.exam_status = 2
        `;

        // If you need additional dynamic conditions in the future:
        let conditionValues = [student_id]; // matches first ?

        // Correct ORDER BY
        query += ` ORDER BY students__subjects.student_subject_id DESC `;
        query += ` LIMIT ?, ?`;

        const response = await PaginationQuery(query_count, query, conditionValues, limit, page);
        return res.status(200).json(response);

    } catch (error) {
        console.error(error);
        return res.status(500).json({ success: false, message: "Internal server error", error });
    }
};

exports.GetFailedOutSubjects = async (req, res) => {
    try {
        const { student_id, limit, page } = req.query;

        if (!student_id) {
            return res.status(400).json({ success: false, message: "student_id is required" });
        }

        let query_count = `SELECT COUNT(*) AS total_records FROM students__subjects WHERE student_id = ? AND exam_status = 3`;
        let query = `
            SELECT 
                students__subjects.student_subject_id,
                students__subjects.student_program_id,
                students__subjects.exam_status,
                students__subjects.total_marks,
                students__subjects.obtain_marks,
                students__subjects.master_subject_id,
                masters__subjects.subject_title
            FROM students__subjects
            LEFT JOIN masters__subjects 
                ON students__subjects.master_subject_id = masters__subjects.master_subject_id
            WHERE students__subjects.student_id = ? AND students__subjects.exam_status = 3
        `;

        // If you need additional dynamic conditions in the future:
        let conditionValues = [student_id]; // matches first ?

        // Correct ORDER BY
        query += ` ORDER BY students__subjects.student_subject_id DESC `;
        query += ` LIMIT ?, ?`;

        const response = await PaginationQuery(query_count, query, conditionValues, limit, page);
        return res.status(200).json(response);

    } catch (error) {
        console.error(error);
        return res.status(500).json({ success: false, message: "Internal server error", error });
    }
};

