import { createServer } from "http";
import { readFile } from "fs/promises";
import { writeFile } from "fs/promises";
import crypto from "crypto";
import path from "path";
import { writeFile } from "fs";


const DATA_FILE = path.join("data", "links.json");
//use a function for without repetation
const serveFile = async (res, filePath, contentType) => {
    try {
        const data = await readFile(filePath);
        res.writeHead(200, { "Content-Type": contentType });
        res.end(data);
    } catch (error) {
        res.writeHead(404, { "Content-Type": "text/plain" });
        res.end("404 page not found");
    }
};

const loadLinks = async () =>{
    try {
        const data = await readFile(DATA_FILE, 'utf-8');
        return JSON.parse(data);
    } catch (error) {
        if(error.code === "ENOENT"){
        await writeFile(DATA_FILE, JSON.stringify({}));
        return {};
        }
        throw error;
    }
};

const server = createServer(async(req, res) => {
    if (req.method === "GET") {
        if (req.url === "/") {
            return serveFile(res, path.join("public", "index.html"), "text/html");
        } else if (req.url === "/style.css") {
                return serveFile(res, path.join("public", "style.css"), "text/css");
            }
            else {
                res.writeHead(404, { "Content-Type": "text/plain" });
                res.end("404 - Page Not Found");
            }
        } else {
            res.writeHead(405, { "Content-Type": "text/plain" });
            res.end("405 - Method Not Allowed");
        }

        if(req.method === "POST" && req.url === "/shorten"){

            const links = await loadLinks();

            let body="";
            req.on("data", (chunk)=>{
                body = body+chunk;
            });
            req.on("end", ()=>{
                console.log(body);
                const {url, shortCode} = JSON.parse(body);

                if(!url){
                    res.writeHead(400, {"Content-Type": "text/plain"});
                    return res.end("URL is required");
                }
                const finalShortCode = shortCode || crypto.randomBytes(4).toString("hex");

                if(links[finalShortCode]){
                    res.writeHead(400, {"Content-Type": "text/plane"});
                    return res.end("Short code already exists. Please choose another.");
                }

            });
        }
    });

//here repetation shown 

// const server = createServer(async (req, res) =>{
//     if(req.method === "GET"){
//         if(req.url === "/"){
//             try {
//                 const data = await readFile(path.join("public","index.html"));
//                 res.writeHead(200,{"Content-Type": "text/html"});
//                 res.end(data);
//             } catch (error) {
//                 res.writeHead(404,{"Content-Type":"text/html"});
//                 res.end("404 page not found");
//             }
//         }else if(req.method === "GET"){
//         if(req.url === "/style.css"){
//             try {
//                 const data = await readFile(path.join("public","style.css"));
//                 res.writeHead(200,{"Content-Type": "text/css"});
//                 res.end(data);
//             } catch (error) {
//                 res.writeHead(404,{"Content-Type":"text/html"});
//                 res.end("404 page not found");
//             }
//         }
//         else {
//             res.writeHead(404, { "Content-Type": "text/plain" });
//             res.end("404 - Page Not Found");
//     }
// }else {
//         res.writeHead(405, { "Content-Type": "text/plain" });
//         res.end("405 - Method Not Allowed");
// }
//     }
// });

const PORT = 3002;
server.listen(PORT, () => {
    console.log(`server running at https://localhost:${PORT}`);
});