const express = require("express");
const path = require("path");
const fs = require("fs");
const data = require("./db/db.json");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static('public'));

// HTML Routes
app.get("/notes", function(req, res) {
    res.sendFile(path.join(__dirname, "./public/notes.html"));
});

app.get("/", function(req, res) {
    res.sendFile(path.join(__dirname, "./public/index.html"));
});

// API Routes
app.get("/api/notes", function(req, res) {
    
    res.json(data);
    // console.log("app.get");
});

app.post("/api/notes", function(req, res) {
    const newNote = req.body;
    let id;
    if (!data.length) id = 0
    else id = data[data.length -1].id + 1;
    newNote.id = id;
    data.push(newNote);
    // console.log(data);
    res.json(data);
    fs.writeFile(__dirname + "/db/db.json", JSON.stringify(data), "utf8", function(err) {
        if (err) throw err;
    });
});

// DELETE `/api/notes/:id` - Should recieve a query paramter containing the id of a note to delete. This means you'll need to find a way to give each note a unique `id` when it's saved. In order to delete a note, you'll need to read all notes from the `db.json` file, remove the note with the given `id` property, and then rewrite the notes to the `db.json` file.

app.delete("/api/notes/:id",function(req, res){
    var chosen = parseInt(req.params.id);
    // console.log(req.params.id + " app.delete");

    for (var i = 0; i < data.length; i++) {
        
        if (chosen === data[i].id) {
            console.log("DATA BEFORE:", data);
            data.splice(i, 1);
            console.log("DATA AFTER:", data);
            fs.writeFile(__dirname + "/db/db.json", JSON.stringify(data), "utf8", function(err) {
                if (err) throw err;
            });
        }
    }
    res.json({deleted: true})
    
});

// app.get("/api/notes/:id", function(req, res) {
//     let reqDelete = req.params.id;
//     console.log(reqDelete);
//     res.json(data);
    
// });

// loop through array
// take the id from their click, match the object with that id
// and then delete it from the array
// and THEN update the frontend

app.listen(PORT, function() {
    console.log(`app listening on port ${PORT}`);
});


