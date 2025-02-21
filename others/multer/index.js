const express = require('express');
const app = express();

const path = require('path');

const {upload} = require('./middleware/main')

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/static', express.static('uploadFolder'));

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'form.html'));
});

// uploading file and file validation ---------------------------------

app.post('/uploads', upload.single('image') ,(req, res, next) => {
    if (!req.file) return res.status(400).send('No file uploaded or invalid format.');
    res.send(req.file);
});


// 404, Error and server handler ---------------------------------

app.use((req, res) => {
    res.status(404).send({ statusCode: 404, message: 'Route not found' });
});

app.use((error, req, res, next) => {
    res.status(500).send({ error: error.message });
});

app.listen(3000, () => {
    console.log('Server is running on port 3000');
});
