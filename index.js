const axios = require('axios');
const express = require('express');

const app = express();
   
app.use(express.json());

app.use(function(req, res, next) {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
    next();
});

app.get("/prova", async(req, res)=>{
    res.send("connesso");
})


app.get("/cercaCanzone/", async(req, res) =>{
    
    const {query, secretKey} = req.body;

    if(secretKey == "14565406587494068402164640684840313064650436")
        res.send(await cercaCanzone(query))
    else    
        res.send("You're not allowed to use this method")
})

async function cercaCanzone(query) {
    const clientId = 'TuoClientID';
    const clientSecret = 'TuoClientSecret';
    const token = await ottieniToken(clientId, clientSecret);

    const searchUrl = 'https://api.spotify.com/v1/search';
    const response = await axios.get(searchUrl, {
      params: {
        q: query,
        type: 'track',
      },
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return response.data.tracks.items.map((track) => ({
      title: track.name,
      artist: track.artists[0].name,
      spotiLink: track.external_urls.spotify,
      imgUrl: track.album.images[0].url
    }));
  }


async function ottieniToken(clientId, clientSecret) {
    const tokenUrl = 'https://accounts.spotify.com/api/token';
    const response = await axios.post(
      tokenUrl,
      new URLSearchParams({
        grant_type: 'client_credentials',
        client_id: 'b05083805dbc4805bdea75760752cda5',
        client_secret: '0ff2935bcf51459193fee336d51ccda2',
      }),
      {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      }
    ); 
    return response.data.access_token;
}

app.listen(3000, ()=>{
    console.log("LISTENING");
})