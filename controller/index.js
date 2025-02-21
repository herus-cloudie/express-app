const model = require('../model')
const fs = require('fs').promises
const connection = require('../utils/db')

function errHandler(error){
    console.error('Error fetching data:', error);
    res.writeHead(500, { 'Content-Type': 'text/plain' });
    res.end('Internal Server Error');
}

async function get(req, res) {
    try {
        const data = await model.getAllData();
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify(data)); 
    } catch (error) {
        errHandler(error)
    }
}

async function getById(req , res) {
    try {
        const dataById = await model.getById(req, res);

        if(!dataById){
            res.writeHead(404 , { 'Content-Type' : 'text/plain'});
            res.end('you either enter an invalid query or something on the server went wrong!')
        }
        
        res.writeHead(200 , { 'Content-Type' : 'application/json'});
        res.end(JSON.stringify(dataById))
    } catch (error) {
        errHandler(error)
    }
}

async function create(req , res) {
    try {
        const DB = await connection.getConnect();
        await DB.insertOne({
            "id" : 999,
            "name" : "created one",
            "age" : 999
        })

        const data = await model.getAllData();
        
        res.writeHead(201, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify(data)); 
    } catch (error) {
        errHandler(error)
    }
}


async function update(req, res) {
    try {
        const DB = await connection.getConnect();

        const id = parseInt(req.url.split('/')[3]);
        const targetObject = await DB.findOne({id});

        if (!targetObject) {
            res.writeHead(404, { 'Content-Type': 'text/plain' });
            res.end(`the obj with id ${id} does not exist`);
        };

        const urlParts = req.url.split('?');
        const allQuery = urlParts[1].split('&')
        
        const updatedObj = {};
        allQuery.forEach(item => {
            const [Key , Val] = item.split('=');
            updatedObj[Key] = Val;
        })
    
        const updatedOne = await DB.findOneAndUpdate({id} , {$set : updatedObj} , { new: true })
        
        res.writeHead(201, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify(updatedOne));
    } catch (error) {
        errHandler(error);
    }
}

async function remove(req , res) {
    try {
        const allData = await model.getAllData();
        const id = parseInt(req.url.split('/')[3]);

        if(!allData.find(item => item.id == id)){
            res.writeHead(202 , {'Content-Type' : 'text/plain'});
            res.end('product with this id not found');
        }

        const DB = await connection.getConnect();
        await DB.findOneAndDelete({id});
        
        const updatedData = await model.getAllData();

        res.writeHead(202 , {'Content-Type' : 'application/json'});
        res.end(JSON.stringify(updatedData));
    } catch (error) {
        errHandler(error)
    }
}

const controller = {
    get,
    getById,
    create,
    update,
    remove
}

module.exports = controller;