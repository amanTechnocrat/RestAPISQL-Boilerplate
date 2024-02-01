const usertable = require('../../helper/sqlDBconnection')
const config = require('../../config');
const genhash = require('../../helper/bcrypt').genhash;
const fs = require('fs');


//User Getting API
exports.getuserdetails = async (req, res) => {
    try {
        let from = req.query.from || 0
        let pageSize = req.query.pageSize || 10
        usertable.query('select * from UserTable', (err, data) => {
            if (err) throw err;
            else {
                const total = data.length
                usertable.query(`select * from UserTable where ID > ${from} order by ID limit ${pageSize}`, (err, result) => {
                    if (err) console.log(err);
                    else {
                        res.json({
                            "code": config.successCode,
                            "data": result,
                            "status": config.successMessage,
                            totaldata: total
                        });
                        return
                    }
                })
            }
        })

    } catch (err) {
        res.json({
            "code": config.errCode,
            "status": config.errorStatus,
            "message": err.message
        });
        return;
    }
}

//User Getting API By ID
exports.getuserdetailsbyid = async (req, res) => {
    try {
        usertable.query("select * from UserTable where ID = ?", req.params.id, (err, result) => {
            if (err) throw err;
            else {
                res.json({
                    "code": config.successCode,
                    "data": result,
                    "status": config.successMessage
                });
            }
        })
        return;
    } catch (err) {
        res.json({
            "code": config.errCode,
            "status": config.errorStatus,
            "message": err.message
        });
        return;
    }
}

//User Updating API
exports.updateuserdetails = async (req, res) => {
    try {
        //Function for Image Upload
        config.upload.single("profileimg")(req, res, async (err) => {
            if (err) {
                res.json({
                    "code": config.errCode,
                    "status": config.errorStatus,
                    "message": err.message
                });
                return
            } else {
                var receivedValues = req.body;
                if (
                    JSON.stringify(receivedValues) === '{}' ||
                    receivedValues === undefined ||
                    receivedValues === null ||
                    receivedValues === '') {
                    res.json({
                        "code": config.errCode,
                        "status": config.errorStatus,
                        "message": config.allFieldsReqMessage
                    });
                    return;
                } else {
                    let data = [
                        receivedValues.firstName,
                        receivedValues.lastName,
                        receivedValues.email,
                        receivedValues.mobileNo,
                        req.file.filename,
                        req.params.id
                    ]
                    usertable.query('update UserTable SET firstName = ?,lastName = ?,email = ?,mobileNo = ?,userImage=? where ID  = ?', data, (err, result) => {
                        if (err) {
                            res.json({
                                "code": config.errCode,
                                "status": config.errorStatus,
                                "message": err.message
                            });
                            return;
                        }
                        else {
                            res.json({
                                "code": config.successCode,
                                "data": result,
                                "status": config.successMessage
                            });
                            return;
                        }
                    })
                }
            }
        })
    } catch (err) {
        res.json({
            "code": config.errCode,
            "status": config.errorStatus,
            "message": err.message
        });
        return;
    }

}

//User Deleting API
exports.deleteuserbyid = async (req, res) => {
    try {
        usertable.query(`delete from UserTable where ID = ${req.params.id}`, (err, result) => {
            if (err) throw err;
            else {
                res.json({
                    "code": config.successCode,
                    "data": result,
                    "status": config.successMessage
                });
            }
        })
        return;
    } catch (err) {
        res.json({
            "code": config.errCode,
            "status": config.errorStatus,
            "message": err.message
        });
        return;
    }
}

//Getting Profile Image API
exports.viewimage = (req, res) => {
    try {
        const path = `./images/profileimg/${req.params.id}`
        //Creating the Reading Stream for Image  
        const file = fs.createReadStream(path)
        file.pipe(res)
    } catch (err) {
        res.json({
            "code": config.errCode,
            "status": config.errorStatus,
            "message": err.message
        });
        return;
    }
}




