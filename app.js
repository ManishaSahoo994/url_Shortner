import { createServer } from "http";
import { readFile } from "fs/promises";
import path from "path";

const server = createServer(async (req, res) =>{
    if(req.method === "GET"){
        if(req.url === "/"){
            try {
                const data = await readFile(path.join("public","index.html"));
                res.writeHead(200,{"Content-Type": "text/html"});
                res.end(data);
            } catch (error) {
                res.writeHead(404,{"Content-Type":"text/html"});
                res.end("404 page not found");
            }
        }else if(req.method === "GET"){
        if(req.url === "/style.css"){
            try {
                const data = await readFile(path.join("public","style.css"));
                res.writeHead(200,{"Content-Type": "text/css"});
                res.end(data);
            } catch (error) {
                res.writeHead(404,{"Content-Type":"text/html"});
                res.end("404 page not found");
            }
        }
        else {
            res.writeHead(404, { "Content-Type": "text/plain" });
            res.end("404 - Page Not Found");
    }
}else {
        res.writeHead(405, { "Content-Type": "text/plain" });
        res.end("405 - Method Not Allowed");
}
    }
});

const PORT = 3002;
server.listen(PORT,()=>{
    console.log(`server running at https://localhost:${PORT}`);
});