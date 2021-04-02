module.exports.logMessage = (pool, userId, roomId, message) => {
    let sql = "INSERT INTO chatlogs (sectionId, message, studentId) VALUES (?, ?, ?)";
    pool.query(sql, [roomId, message, userId], (err, results) => {
        if(err) throw err;
        //We don't really need to do anything else here at the moment
    });
}

module.exports.getPreviousMessages = (pool, roomId, amount, callback) => {
    let sql = "SELECT c.message, c.time, c.studentId, u.firstName, u.lastName FROM chatlogs c INNER JOIN users u ON c.studentId = u.id WHERE c.sectionId=? ORDER BY messageId DESC LIMIT ?";
    pool.query(sql, [roomId, amount], (err, results) => {
        if(err) throw err;
        if(results.length > 0) {
            let messages = [];
            for(let i = 0; i < results.length; i++) {
                messages.push({
                    message: results[i].message,
                    name: results[i].firstName + " " + results[i].lastName,
                    time: results[i].time,
                    studentId: results[i].studentId
                })
            }
            callback(messages);
        } else {
            callback(null);
        }
    });
}