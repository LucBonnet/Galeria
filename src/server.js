const express = require('express');
const server = express();

const fetch = require('node-fetch');
require('dotenv/config');

server.use(express.static("public"));

const nunjucks = require('nunjucks');
nunjucks.configure('src/views', {
    express: server,
    noCache: true
})

function dataFormatter(data){
    // console.log(data);
    // let dia = data.getDay() + '';
    // let mes = data.getMonth() + '';
    // let ano = data.getFullYear() + '';

    // dia = dia.length == 1?'0'+dia:dia;
    // mes = mes.length == 1?'0'+mes:mes;
    // console.log(`${dia}/${mes}/${ano}`)
    // return `${dia}/${mes}/${ano}`;

    let dia = data.substring(8, 10);
    let mes = data.substring(5, 7);
    let ano = data.substring(0, 4);
    let formattedDate = dia + '/' + mes + '/' + ano;

    return formattedDate;
}

server.get("/", (req, res) => {
    const url = `https://api.unsplash.com/photos/random?client_id=${process.env.ACCESS_TOKEN}&orientation=landscape&count=12`;

    fetch(url)
    .then( res => res.json() )
    .then( images => {
        for(image of images){
            //const data = new Date(image.created_at);
            image.created_at = dataFormatter(image.created_at);
        }

        return res.render("index.html", { images: images });
    })
})



server.listen(3000);