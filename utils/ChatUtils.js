module.exports.logMessage = (pool, userId, roomId, message) => {
    let sql = "INSERT INTO chatlogs (sectionId, message, studentId) VALUES (?, ?, ?)";
    pool.query(sql, [roomId, message, userId], (err, results) => {
        if(err) throw err;
        //We don't really need to do anything else here at the moment
    });
}