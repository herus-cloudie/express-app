const http = require('http')
const controller = require('./controller')

http.createServer(async (req , res) => {

    if(req.url == '/api/product' && req.method == 'GET') return await controller.get(req , res);
    else if (/^\/api\/product\/\d+/.test(req.url) && req.method === 'GET') return await controller.getById(req, res);
    else if(req.url == '/api/create' && req.method == 'POST') return await controller.create(req , res);
    else if (/^\/api\/update\/\d+(\?.*)?$/.test(req.url) && req.method === 'PATCH') return await controller.update(req, res);
    else if (/^\/api\/remove\/\d+/.test(req.url) && req.method === 'DELETE') return await controller.remove(req, res);
    else {
        res.writeHead(200 , {'Content-Type' : 'text/plain'})
        res.end(`route: ${req.url} , method : ${req.method}`) 
    }

}).listen(3000)
