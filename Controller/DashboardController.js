const pool = require("../Config/db_pool");

exports.GetDashboardStates = async (req, res) => {
    try {

        const { student_id } = req.headers;

        if (!student_id) {
            return res.json({ success: false, message: "student_id is required" })
        }

        const total_pending_exam_query = `SELECT COUNT(*) AS total_pending_exam FROM students__subjects WHERE student_id = ? AND exam_status = 1`

        const [rows] = await pool.query(total_pending_exam_query, [student_id]);

        return res.json({
            success: true,
            data: {
                total_pending_exam: rows[0]?.total_pending_exam
            }
        })

    } catch (error) {
        console.log("Get Student profile error : ", error);
        return res.json({ success: false, message: "Internal server error : ", error });
    }
}