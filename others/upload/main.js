const http = require('http')
const multiparty = require('multiparty')
const fs = require('fs')

http.createServer((req , res) => { 

    const {url , method} = req;
    
    if(url == '/' && method == 'POST'){
        const doesFileExist = fs.existsSync('./store');
        const form = new multiparty.Form();
        
        if(!doesFileExist) {
            fs.mkdirSync('store');
        }
            
        form.on('part' , async (part) => {
            const dedicatedName = part.filename.split('.');
            const chosenPath = fs.createWriteStream(`./store/${part.filename}.${dedicatedName[dedicatedName.length-1]}`)
            part.pipe(chosenPath).on('close' , () => {
                res.writeHead(200 , {"content-type" : "text/html"})
                res.end(`
                    <h2>
                    your file <strong> <  ${part.filename}  > </strong> uploaded successfully!
                    </h2>  
                `)
            })

        })
        form.parse(req)
    }else{
        res.writeHead(200 , {"content-type" : "text/html"})
        res.end(`
            <form action="/" enctype="multipart/form-data" method="POST">
               <button type="submit" style="border: none; background-color: blue; color:white; border-radius : 10px; padding : 10px;"> UPLOAD </button>
               <input type="file" name="file"/>
            </form>  
        `)

    }
}).listen(3000)