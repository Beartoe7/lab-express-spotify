require('dotenv').config();

const express = require('express');
const hbs = require('hbs');

// require spotify-web-api-node package here:
const SpotifyWebApi = require('spotify-web-api-node');


const app = express();

app.set('view engine', 'hbs');
app.set('views', __dirname + '/views');
app.use(express.static(__dirname + '/public'));

// setting the spotify-api goes here:
const spotifyApi = new SpotifyWebApi({
    clientId: process.env.CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET
  });
  
  // Retrieve an access token
  spotifyApi
    .clientCredentialsGrant()
    .then(data => spotifyApi.setAccessToken(data.body['access_token']))
    .catch(error => console.log('Something went wrong when retrieving an access token', error));



// Our routes go here:
app.get("/", (req,res,next)=>{
    res.render("index");
});

app.get("/artist-search", (req,res, next)=>{
    let artist = req.query.artist;
    spotifyApi
  .searchArtists(artist)
  .then(data => {
    console.log('The received data from the API: ', data.body);
    // ----> 'HERE'S WHAT WE WANT TO DO AFTER RECEIVING THE DATA FROM THE API'
    const artistsData = data.body.artists.items;
   //res.send(artistsData)
     res.render('artist-search-results', {artists: artistsData})
})
  .catch(err => console.log('The error while searching artists occurred: ', err));

})

app.get("/albums/:id", (req, res, next) => {
  const id = req.params.id;
  spotifyApi.getArtistAlbums(id)
  .then(function(data) {
    spotifyApi.getArtist(id)
    .then(function(data2) {
      const artistName = data2.body.name
      const albums = data.body.items
      console.log(albums)
       res.render("albums", {artistName, albums})
    })
    

  }).catch(err => console.log(err))

})

app.get("/view-tracks/:id", (req, res, next) => {
  const id = req.params.id
  spotifyApi.getAlbumTracks(id)
  .then((data) => {
    const tracks = data.body.items
    res.render("tracks", {tracks})
  }).catch(err => console.log(err))
})


app.listen(3000, () => console.log('My Spotify project running on port 3000 🎧 🥁 🎸 🔊'));
