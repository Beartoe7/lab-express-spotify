require('dotenv').config();

const express = require('express');
const app = express();

const hbs = require('hbs');

// require spotify-web-api-node package here:
const SpotifyWebApi = require('spotify-web-api-node');

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


app.get("/", (req, res, ext)=>{
  res.render("home");
});

app.get("/artist-search", async (req, res, next)=>{
    
  try {
    const {artist} = req.query;
    let response = await spotifyApi
    .searchArtists(artist);
    const artists = response.body && response.body.artists && response.body.artists.items && Array.isArray(response.body.artists.items) ? response.body.artists.items : [];
    return res.render('artist-search-results', {data : artists});
    // return res.send({success: true, data : response.body})
  } catch (error) {
    return res.send({error: "Something went wrong", er : error})
  }


    // .then(data => {
    //   console.log('The received data from the API: ', data.body);
      
    //   // ----> 'HERE'S WHAT WE WANT TO DO AFTER RECEIVING THE DATA FROM THE API'
    // })
    // .catch(err => console.log('The error while searching artists occurred: ', err));

  }); 

// app.get(
//   "/albums/:artistId", 
//   (req,res, next)=>{
    


// })


  app.get("/albums/:artistId", async (req, res, next) => {
    try {
      const {artistId} = req.params;
      let response = await spotifyApi
      .getArtistAlbums(artistId);

      const albums = response.body && response.body.items && response.body.items && Array.isArray(response.body.items) ? response.body.items : [];
    return res.render('albums', {data : albums});
    

      return res.send({status: true, data: response.body})
    } catch (error) {
      return res.send({message: " Something went  wrong.", error})
    }
   
    // .then(data => {
    //   console.log('The received data from the API: ', data.body);
    //   })
    //   .catch(err => console.log('The error while searching albums occurred: ', err));
    });

 app.get("/track-info/:albumId", async (req, res, next)=>{

  try {
    
    const {albumId} = req.params;
     let response = await spotifyApi.getAlbumTracks(albumId);
     return res.send({ status: true, data : response.body})
  } catch (error) {
    return res.send({status: 'something went wrong.'})
  }

  // .then(function(data) {
  //   console.log(data.body);
  // }, function(err) {
  //   console.log('Something went wrong!', err);
  // })
  // .catch(err => console.log('The error while searching tracks occurred: ', err));
 });

app.listen(3000, () => console.log('My Spotify project running on port 3000 🎧 🥁 🎸 🔊'));
