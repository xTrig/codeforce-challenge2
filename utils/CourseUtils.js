module.exports.getClassesForUser = (pool, userId, callback) => {
    let sql = "SELECT c.id, c.courseName, u.firstName, u.lastName FROM coursesections c INNER JOIN studentsections s ON c.id = s.sectionId INNER JOIN users u ON c.instructorId = u.id WHERE s.studentId=?";
    pool.query(sql, [userId], (err, results) => {
        if(err) throw err;
        if(results.length > 0) {
            callback(results);
        } else {
            callback(null);
        }
    });
}

module.exports.isMemberOfClass = (pool, userId, courseId, callback) => {
    let sql = "SELECT * FROM studentsections WHERE studentId=? AND sectionId=?";

    pool.query(sql, [userId, courseId], (err, results) => {
        if(err) throw err;
        if(results.length > 0) {
            callback(true);
        } else {
            callback(false);
        }
    });
}