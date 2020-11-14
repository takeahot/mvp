const http = require('http');
const url = require('url');

http.createServer(function (req, res) {
    res.writeHead(200, {'Content-Type': 'text/plain'});
    let d = new Date();
    console.log(d+"\n\r");
    let queryData = url.parse(req.url,true);
    console.log('url_data\n\r');
    console.log(JSON.parse(JSON.stringify(queryData.query)));
    console.log('\n\rbody_data\n\r')
    let data = "";
    req.on('data',chunk => {
        data += chunk.toString();
    }
    );
    req.on('end', () => {
        data ? console.log(JSON.parse(data)) : console.log('no data')
        console.log("\n\r");
    });
    res.end('http request done');
}).listen(3000,'0.0.0.0');

// ssh -R \*:13001:localhost:3000 -p 3022 -N -l itspecies@outlook.com 79.111.13.238