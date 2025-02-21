const connection = require('../utils/db')

async function getAllData(){
    const DB = await connection.getConnect();
    const data = await DB.find({}).toArray();      
    return new Promise((resolve , reject) => {
        resolve(data)
    })
} 

async function getById(req , res) {
    return new Promise(async (resolve , reject) => {

        const queryId = req.url.split('/')[3].split('?')[0];
        if(isNaN(queryId)){
            res.writeHead(404 , {"Content-Type" : "text/plain"})
            res.end('your query is not number')
        }

        const id = parseInt(queryId , 10 );
        const DB = await connection.getConnect();

        const itemById = await DB.findOne({id});
        if(!itemById) {
            res.writeHead(404 , {"Content-Type" : "text/plain"})
            res.end('the item does not exist')
        }

        resolve(itemById)
    })
}
const model = {
    getAllData,
    getById
}

module.exports = model