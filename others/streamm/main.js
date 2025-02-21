

const {createReadStream , statSync} = require('fs')
const http = require('http');

const fileName = './nn.MP4';

http.createServer((req , res) => {

    const video = createReadStream(fileName);
    const {size} = statSync(fileName);
    const range = req.headers.range;

    const piping = (response) => video.pipe(response);

    if(range){
        let [start , end] = range?.replace(/bytes=/, '').split('-')
        start = parseInt(start , 10);
        end = end? parseInt(end , 10) : size - 1;

        res.writeHead(206 ,
            {
                "content-range" : `bytes ${start}-${end}/${size}`,
                "content-type" : 'video/mp4',
                "content-length" : (start-end) + 1,
                "accept-ranges" : 'bytes'
            })
        piping(res)

    }else{
        res.writeHead(206 , {"content-type" : 'video/mp4',"content-length" : size})
        piping(res);
    }

}).listen(3000)

console.log('server is running')