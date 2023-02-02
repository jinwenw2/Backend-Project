/*Tools: code editor, browser, command line utility, 
application and server utility, API platform
*/
const express = require('express');
const app = express();
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
var musicList = [
    {Name: "Shake It Off", Genre: "Pop", Month: "August", Year: "2014"},
    {Name: "Beneath the Mask", Genre: "Jazz", Month: "January", Year: "2017"},
    {Name: "Down in the Valley", Genre: "Pop", Month: "April", Year: "2011"},
    {Name: "Sunflower", Genre: "Hip Hop", Month: "October", Year: "2018"},
    {Name: "You Make My Dreams", Genre: "Rock", Month: "April", Year: "1981"},
    {Name: "Stressed Out", Genre: "Rap", Month: "November", Year: "2015"},
    {Name: "Crazy Blues", Genre: "Blues", Month: "August", Year: "1920"},
    {Name: "Alt-Wiener Tanzweisen: No. 2, Liebesleid", Genre: "Classical", Month: "August", Year: "1920"},
    {Name: "Love U", Genre: "Electronic", Month: "March", Year: "2016"},
];
//Assigns every song an ID. Map takes each song in the array and sets the ID to 1 more than the index of the song in the array.
musicList = musicList.map((song, ind) =>
{
    return ({id: ind + 1, ...song})
})

//=========== ROUTES FOR HTTP GET REQUESTS ==========
app.get('/', (req,res) => {
    res.send('Music App \nJinwen Wu Even Days');
});

app.get('/api/musicList' , (req, res) => {
    let tempList = musicList;
    if (tempList.length === 0)
    {
        res.status(404).send("Nothing was found!");
        return;
    }
    if (req.body.Month && req.body.Year)
    {
        tempList = musicList.filter(c=> c.Month === req.body.Month && c.Year === req.body.Year);
    }
    else if (req.body.Month)
    {
        tempList = musicList.filter(c=> c.Month === req.body.Month);
    }
    else if (req.body.Year)
    {
        tempList = musicList.filter(c=> c.Year === req.body.Year);
    }

    res.send(tempList);
})

app.get('/api/musicList/:id', (req,res) => {
    const tempList = musicList.find(c=> c.id === parseInt(req.params.id));
    //Checks for ID, 404 not found error if not found
    if(!tempList)
    {
        res.status(404).send("The song with the given ID was not found");
        return;
    }
    res.send(tempList);
});

//=========== ROUTES FOR HTTP POST REQUESTS ==========
app.post('/api/musicList', (req, res) => {
    //Various checks on user side for Missing Names and invalid character lengths
    if (!req.body.Genre && !req.body.Name)
    {
        res.status(400).send("Missing a song genre and name!");
        return;
    }
    else if (!req.body.Genre)
    {
        res.status(400).send("Missing a song genre!");
        return;
    }
    else if (!req.body.Name)
    {
        res.status(400).send("Missing a song name!");
        return;
    }

    if (req.body.Name.length < 3)
    {
        res.status(400).send("Name length must have at least 3 characters long!");
        return;
    }

    if (req.body.Genre.length < 3)
    {
        res.status(400).send("Genre length must have at least 3 characters long!");
        return;
    }
    //Adds new song with correct ID
    let newSong = {
        id: musicList.length + 1, Name: req.body.Name, Genre: req.body.Genre,
    }
    musicList.push(newSong);
    res.status(200).send(musicList);
});

//=========== ROUTES FOR HTTP PUT REQUESTS ==========
app.put('/api/musicList/:id', (req, res) => {
    //Various checks for certain specifications like missing names or character lengths.
    if (!req.body.Genre && !req.body.Name)
    {
        res.status(400).send("Missing a song genre and name!");
        return;
    }
    else if (!req.body.Genre)
    {
        res.status(400).send("Missing a song genre!");
        return;
    }
    else if (!req.body.Name)
    {
        res.status(400).send("Missing a song name!");
        return;
    }

    if (req.body.Name.length < 3)
    {
        res.status(400).send("Name length must be at least 3 characters long!");
        return;
    }

    if (req.body.Genre.length < 3)
    {
        res.status(400).send("Genre length must be at least 3 characters long!");
        return;
    }

//Various checks for out of bound IDs.
    if (req.params.id > musicList.length)
    {
        res.status(404).send("ID not found! The ID is above the length of the list!");
        return;
    }
    else if (req.params.id < 0)
    {
        res.status(404).send("ID not found! The ID is below the length of the list!");
        return;
    }
    //updates IDs after new song is inserted
    musicList[req.params.id-1] = {
        id: parseInt(req.params.id), Name: req.body.Name, Genre: req.body.Genre,
    }
    res.status(200).send(musicList[req.params.id-1]);
});

//=========== ROUTES FOR HTTP DELETE REQUESTS ==========
app.delete('/api/musicList/:id', (req, res) => {
    const selection = musicList.find(c => c.id === parseInt(req.params.id));
    let ind = musicList.indexOf(selection); 
    //Checks for whether or not the song is found in the list.
    if (!selection)
    {
        res.status(404).send("The selected song is not on the list!");
        return;
    }
    //Rearranges IDs properly
    musicList.splice(ind, 1);
    musicList.forEach((song, newID) =>
    {
        song.id = newID + 1;
    })
    res.status(200).send("Deleted");

});


//Listening
app.listen(3000, () =>
{
console.log("Listening on port 3000");
})


/*Jinwen Wu Even Days
Comments

1. Programs communicate with each other through the frontend and the backend. The frontend consists of the interface that users interact with
and use to request data from the backend. The backend handles these requests, stores data, and sends the properly requested data when prompted to.
Using Postman, the backend is interacted with using the GET, POST, PUT, and DELETE requests.

2. Through this project, I learned that the websites that we interact with on a daily basis may seem simple on the front end but obtaining the data from the
backend is very different. I got a better perspective on how websites work.
I was able to learn about some basic backend development through the GET, POST, PUT, and DELETE requests for website communications.
GET is used to obtain data, POST to add new data, PUT to change data or alter something, and DELETE to delete data.

3. A possible extension could be to include an option to create multiple user profiles. This will make the project more like an actual app that can be found
on the store. This is also logical because users should not share the same profiles. Music tastes are different.
Maybe an option to create and store playlists full of songs can be useful to enhance our music app too. Playlists are definitely essential in a music app.
*/