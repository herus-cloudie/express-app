
const {UserModel , BlogsModel} = require('./models/user.model')
const ConnectToDB = require('./utils/connectToDB')

const express = require('express')
const app = express();
const staticBlogs = require('./data.json');

const {listOfValidation , expressValidator , queryValidation } = require('./utils/validator');

app.use(express.json())
app.use(express.urlencoded({extended : true}))

const Error404 = (res , id) => res.send({message : `the product with this id ${id} does not exist!` , statusCode : 404})

app.use(async (req , res , next) => {
    try {
        await ConnectToDB();
        next()
    } catch (error) {
        next(error); 
    }
})

app.get('/products/:id?' , async (req , res) => {
    const {id} = req.params;

    if(id){
        const specificItem = await UserModel.findOne({id});
        if (specificItem) return res.send(specificItem)
        return Error404(res , id)
    }

    const allDocs = await UserModel.find();
    res.send(allDocs)
})

app.get('/insert', async (req, res, next) => {
    try {
        const insertObj = await UserModel.insertOne({
            text : 'its a text',
            status : true,
            age : 18,
            id : 4,
        });
        res.send(insertObj);
    } catch (error) {
        next(error); 
    }
});

app.delete('/remove/:id' , async (req , res , next) => {
    try {
        const {id} = req.params;

        const deleting = await UserModel.findOneAndDelete({id});
        if(!deleting) return Error404(res , id);

        res.send(deleting);
    } catch (error) {
        next(error)
    }
})

app.post('/update/:id' , listOfValidation() , expressValidator , async (req , res) => {
    const {id} = req.params;
    const body = req.body;

    const selectedObj = await UserModel.findOneAndUpdate({id} , {$set : body})
    if(!selectedObj) return Error404(res , id);
    res.send(selectedObj)
})

app.get('/blogs/:id?/:title?/:body?' , queryValidation() , expressValidator , async (req , res , next) => {
    const {id , title , body} = req.query;
    const Blogs = await BlogsModel.find();
    let filtered = Blogs;
    console.log(req.query);

    if(id){
        const specificItem = Blogs.find(item => item.id == id)
        return res.send(specificItem)
    }
    
    if(title) filtered = filtered.filter(item => item.title.includes(title))
    if(body) filtered = filtered.filter(item => item.body.includes(body))

    res.send(filtered)
})

app.post('/blogs/insert' , async (req , res , next) => {
    try {
        const insertedObjs = await BlogsModel.insertMany(staticBlogs)
        res.send(insertedObjs)
    } catch (error) {
        next(error)
    }
})

app.use((err, req, res, next) => {
    console.log('Error logger work!', err.message);
    res.status(500).json({ error: err.message || 'Internal Server Error' });
});

app.use((req , res , next) => {
    res.send({
        statusCode : 404,
        message : `route ${req.url} not found`
    })
});

app.listen(3000 , () => {
    console.log('server is running');
})