const fs = require('fs');
const multer = require('multer');

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        if (!fs.existsSync('./uploadFolder')) {
            fs.mkdirSync('./uploadFolder');
        }
        cb(null, './uploadFolder');
    },
    filename: (req, file, cb) => {
        cb(null, file.originalname);
    }
});

const fileFilter = (req, file, cb) => {
    const whiteListFormat = ['image/png', 'image/jpg', 'image/jpeg', 'image/heic', 'image/webp' , 'video/mp4' , 'video/x-matroska'];
    console.log(file.mimetype)
    if (!whiteListFormat.includes(file.mimetype)) {
        console.log('Invalid format detected');
        return cb(null, false);
    }
    cb(null, true);
};

const upload = multer({ storage , fileFilter , limits : {fileSize : 100000000}});

module.exports = {
    upload
}