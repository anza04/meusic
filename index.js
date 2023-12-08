/*CONFIGURATION***********************************************************************************************************************************/

const axios = require('axios');
const express = require('express');

const app = express();
app.use(express.json());
app.use(function(req, res, next) {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
    next();
});

app.listen(3000, ()=>{
  console.log("LISTENING");
})


/*METHODS*****************************************************************************************************************************************/

app.get("/isUp", async(req, res)=>{
    res.send("connesso");
})

app.get("/FindSongByParams/", async(req, res) =>{
    
    const {query, secretKey} = req.body;

    if(CheckKey(secretKey))
        res.send(await FindSongByParams(query))
    else    
        res.send("You're not allowed to use this method")
})

app.get("/FindAlbumByParams/", async(req, res) =>{
    
  const {query, secretKey} = req.body;

  if(CheckKey(secretKey))
      res.send(await findAlbumByParams(query))
  else    
      res.send("You're not allowed to use this method")
})

/*FUNCTIONS***************************************************************************************************************************************/

async function FindSongByParams(query) {
    const clientId = 'TuoClientID';
    const clientSecret = 'TuoClientSecret';
    const token = await getToken(clientId, clientSecret);

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
      imgUrl: track.album.images[0].url, 
      searchUrl: track.href
    }));
  }

async function findAlbumByParams(query) {
    const clientId = 'TuoClientID';
    const clientSecret = 'TuoClientSecret';
    const token = await getToken(clientId, clientSecret);

    const searchUrl = 'https://api.spotify.com/v1/search';
    const response = await axios.get(searchUrl, {
      params: {
        q: query,
        type: 'album',
      },
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return response.data.albums.items.map((album) => ({
      title: album.name,
      artist: album.artists[0].name,
      spotiLink: album.external_urls.spotify,
      imgUrl: album.images[0].url, 
      searchUrl: album.href
    }));
}

async function getToken(clientId, clientSecret) {
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

function CheckKey(key)
{
  if(key="14565406587494068402164640684840313064650436")
    return true
  else
    return false
}

