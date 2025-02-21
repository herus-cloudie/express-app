const { body, validationResult, query } = require("express-validator")

const listOfValidation = () => [
    body('newField').isLength({min : 6 , max : 9}),
    body('email').isEmail().withMessage('your email is invalid'),
    body('phoneNumber').isMobilePhone('fa-IR').withMessage('phone number format is invalid'),
    body('customVal').custom((value , aaa) => {
        console.log(aaa)
        if(value != 'specific'){
            throw 'its not specific';
        }
        return true
    })
]

const expressValidator = (req , res , next) => {
    const {errors} = validationResult(req);
    
    if(errors.length > 0){
        let validationErrors = {};

        errors.forEach(element => {
            validationErrors[element.path] = element.msg;
        });

        return res.status(403).send({
            statusCode : res.statusCode,
            message : 'your entry is not valid!',
            validationErrors
        })
    }else{
        next()
    }
}

const queryValidation = () => [
    query('id').isLength({max : 100}).withMessage('your id should not be over 100'),
    query('title').isLength({min : 3}).withMessage('your title length should be over 3'),
    query('body').custom((value , {req}) => {
        if(value == req.query.title){
            throw 'your body should not be as same as your title'
        }
        return true
    })
]

module.exports = {listOfValidation , expressValidator , queryValidation}