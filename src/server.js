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
    let dia = data.substring(8, 10);
    let mes = data.substring(5, 7);
    let ano = data.substring(0, 4);
    let formattedDate = dia + '/' + mes + '/' + ano;

    return formattedDate;
}

function getImages(url, searched, res){
    fetch(url)
    .then( res => res.json() )
    .then( images => {
        if(searched){
            images = images.results;
        }
        for(image of images){
            image.created_at = dataFormatter(image.created_at);
        }

        return res.render("index.html", { images: images });
    })
}

server.get("/", (req, res) => {
    const search = req.query.search

    let url = "";
    let searched = false;
    if(search){
        url = `https://api.unsplash.com/search/photos?query=${search}&client_id=${process.env.ACCESS_TOKEN}&per_page=12`;
        searched = true;
    }else{
        url = `https://api.unsplash.com/photos/random?client_id=${process.env.ACCESS_TOKEN}&orientation=landscape&count=12`;
        searched = false
    }
    
    return getImages(url, search?true:false, res);
})



server.listen(3000);