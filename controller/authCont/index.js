const usertable = require('../../helper/sqlDBconnection')
const config = require('../../config');
const genhash = require('../../helper/bcrypt').genhash;
const verifyhash = require('../../helper/bcrypt').verify;


//User Login API
exports.loginapi = async (req, res) => {
    try {
        if (req.body.email && req.body.password) {
            data = [req.body.email];

            usertable.query('select ID,email,password from UserTable where email = ? ', data, async (err, result) => {
                if (err) throw err;
                else if (!result.length > 0) {
                    res.json({
                        "code": 200,
                        "status": "Error",
                        "message": config.accountNotExistsMessage
                    });
                    return;
                }
                else {
                    const checkpassword = await verifyhash(req.body.password, result[0].password)

                    if (checkpassword) {
                        let accesstokentoken = config.genToken(result[0].email)
                        let refreshtoken = config.genToken(result[0].email, "7d")
                        res.json({
                            "code": config.successCode,
                            "accesstoken": accesstokentoken,
                            "refreshtoken": refreshtoken,
                            "status": config.successMessage
                        });
                        return;
                    } else {
                        res.json({
                            "code": 200,
                            "status": "Error",
                            "message": config.wrongPassMessage
                        });
                        return;
                    }
                }
            })
        } else {
            res.json({
                "code": config.errCode,
                "status": "Error",
                "message": config.reqEmailNPasswordMessage
            });
            return;
        }
    } catch (err) {
        res.json({
            "code": config.errCode,
            "status": config.errorStatus,
            "message": err.message
        });
        return;
    }
}

//Sending Mail for Forgetpassword
exports.sendmail = async (req, res) => {
    try {
        if (req.body.email) {
            usertable.query(`select * from UserTable where email = "${req.body.email}"`, (err, result) => {
                if (err) throw err;
                else {
                    if (result.length !== 0) {
                        let token = config.genToken(req.body.email, "10m")
                        config.mail(req.body.email, token)
                        res.json({
                            "code": config.successCode,
                            "message": "Mail is sended to your account follow that link to change your Password",
                            "status": config.successMessage
                        });
                        return;
                    } else {
                        res.json({
                            "code": config.errCode,
                            "status": "Error",
                            "message": config.notRegEmailMessage
                        });
                        return;
                    }
                }
            })
        } else {
            res.json({
                "code": config.errCode,
                "status": "Error",
                "message": config.errMessage
            });
            return;
        }
    } catch (err) {
        res.json({
            "code": config.errCode,
            "status": config.errorStatus,
            "message": err.message
        });
        return;
    }
}

//API for Setting Forget Password
exports.setforgetpassword = async (req, res) => {
    try {
        if (req.body.password) {
            let hashcode = await genhash(10, req.body.password) //function for Generating the hashtoken
            let data = [hashcode, res.valid.data]
            usertable.query('update UserTable SET password = ? where email = ?', data, (err) => {
                if (err) throw err;
                else {
                    res.json({
                        "code": config.successCode,
                        "message": "Password is Changed Now Login Again with New Password",
                        "status": config.successMessage
                    });
                    return;
                }
            })
        } else {
            res.json({
                "code": config.errCode,
                "status": "Error",
                "message": config.reqPasswordMessage
            });
            return;
        }
    } catch (err) {
        res.json({
            "code": config.errCode,
            "status": config.errorStatus,
            "message": err.message
        });
        return;
    }
}

//Change Password API
exports.changepassword = async (req, res) => {
    try {
        var receivedValues = req.body;
        if (
            JSON.stringify(receivedValues) === '{}' ||
            receivedValues === undefined ||
            receivedValues === null ||
            receivedValues === '' || receivedValues.oldpassword === undefined || receivedValues.newpassword === undefined) {
            res.json({
                "code": config.errCode,
                "status": "Error",
                "message": config.reqPasswordMessage
            });
            return;
        } else {
            usertable.query("select * from UserTable where ID = ?", req.body.id, async (err, result) => {
                if (err) throw err;
                else {
                    const checkpassword = await verifyhash(req.body.oldpassword, result[0].password)
                    if (checkpassword) {
                        let hashcode = await genhash(10, req.body.newpassword)
                        usertable.query(`update UserTable SET password = "${hashcode}" where ID = ${req.body.id}`, (err, result) => {
                            if (err) throw err;
                            else {
                                res.json({
                                    "code": config.successCode,
                                    "message": "Password is Changed",
                                    "status": config.successMessage
                                });
                                return;
                            }
                        })
                    } else {
                        res.json({
                            "code": config.errCode,
                            "message": "Old Password didn't Match ! You can't Change Password with this",
                            "status": config.errorStatus
                        });
                        return;
                    }
                }
            })
        }
    } catch (err) {
        res.json({
            "code": config.errCode,
            "status": config.errorStatus,
            "message": err.message
        });
        return;
    }
}

//User Registering API
exports.userregister = async (req, res) => {
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
                        "status": "Error",
                        "message": config.allFieldsReqMessage
                    });
                    return;
                } else {
                    let hashpassword = await genhash(10, receivedValues.password)
                    let data = [
                        receivedValues.firstName,
                        receivedValues.lastName,
                        receivedValues.email,
                        hashpassword,
                        receivedValues.mobileNo,
                        req.file.filename
                    ]
                    usertable.query('insert into UserTable SET firstName = ?,lastName = ?,email = ?,password = ?,mobileNo = ?,userImage=?', data, (err, result) => {
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