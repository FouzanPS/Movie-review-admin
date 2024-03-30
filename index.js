import express, { response } from "express";
import bodyParser from "body-parser";
import pg from "pg";
import axios from "axios";

const app = express();
const port = 3000;
const API_KEY = process.env.API_KEY

const db = new pg.Client({
    host: 'localhost',
    user: 'postgres',
    databse: 'movies',
    password: 'fouzan@14',
    port: 5432
})

db.connect()

app.use(bodyParser.urlencoded({ extended: true }))
app.use(express.static("public"));

// app.get('/recommend', async (req, res) => {
//     try{
//         const searchText = req.query.movieName;
//         const result = await axios.get(`http://www.omdbapi.com/?t=${searchText}&apikey=${API_KEY}`);
//         const data = result.data;
//         if (data.Title){
//             res.status(200).json([data.Title]);
//         }
//         else{
//             res.status(500).json({error: "Error in fetching"})
//         }
//     }
//     catch(err){
//         console.error( "Error:", err)
//         res.json({ error: "Error in fetching" });
//     }
//     res.render("index.ejs");
// })
app.get('/' , async (req,res) => {
    try{
        res.render("index.ejs")
    }
    catch(err){
        res.sendError(err);
    }
    
})

app.post('/submit', async (req,res) => {
    try{
        const searchText = req.query.movieName;
        const summary = req.query.summary;
        const date = req.query.dateWatched;
        const rating = req.query.rating;
        const result = await axios.get(`http://www.omdbapi.com/?t=${searchText}&apikey=${API_KEY}`);
        const data = result.data;
        
        res.render("index.ejs")
    }
    catch(err){
        res.send("Error Occured");
    }
})

app.listen(port, () => {
    console.log("The server is listening on port " + port);
})