const express = require('express');
const app = express();

const morgan = require('morgan');
const path = require('path');
const posts = require('./data.json');

app.use(morgan('common'));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.set('view engine', 'pug');
app.set('views', path.join(__dirname, 'views'));

app.use('/randomName' , express.static('public'))

// app.get('/', (req, res) => {
//     res.render('index' , {
//         alai : 'man ali hastam',
//         posts,
//         sectionNumb : 5
//     });
// });

app.get('/products/:id?', (req, res) => { 
    const { id } = req.params;
    const itemById = posts.find(item => item.id == id);
    
    id 
        ? res.status(201).json({ itemById })
        : res.status(201).json({ posts });
});

// function checkAuth(req, res, next) {
//     if (Number(req.params.id) === 2) {
//         next();
//     } else {
//         res.status(403).send('Unauthorized');
//     }
// }

// app.post('/body/:id', checkAuth, (req, res) => {
//     if (!req.params.id) return res.status(400).send('ID is required');

//     const body = req.body;
//     res.status(201).send(body);
// });

app.get('/posts/:title?/:desc?', (req, res) => {
    const { title = '', desc = '' } = req.params;

    const filtered = posts.filter(
        item => item.title.includes(title) || item.body.includes(desc)
    );

    res.status(200).json({ filtered });
});

app.use((err, req, res, next) => {
    console.log('Error logger work!', err.message);
    res.status(500).json({ error: err.message || 'Internal Server Error' });
});

app.use((req, res) => {
    res.status(404).send('<h2 style="color:red;">Incorrect path</h2>');
});

app.listen(3000, () => {
    console.log('Server running on port 3000' , '---- http://localhost:3000/');
});
