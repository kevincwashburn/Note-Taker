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
    res.json({deleted: true}) //res.json just needs an object. this object is 'mary poppins'
    
});

app.listen(PORT, function() {
    console.log(`app listening on port ${PORT}`);
});


