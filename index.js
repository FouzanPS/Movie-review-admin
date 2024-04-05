import express, { response } from "express";
import bodyParser from "body-parser";
import pg from "pg";
import axios from "axios";
import dotenv from 'dotenv';

dotenv.config(); 

const app = express();
const port = 3000;
const API_KEY = process.env.API_KEY

const db = new pg.Client({
    host: 'localhost',
    user: 'postgres',
    database: 'movies',
    password: 'fouzan@14',
    port: 5432
})

db.connect()

app.use(bodyParser.urlencoded({ extended: true }))
app.use(express.static("public"));

app.get('/' , async (req,res) => {
    try{
        res.render("index.ejs")
    }
    catch(err){
        res.sendError(err);
    }
    
})

app.post('/submit', async (req, res) => {
    try {
        const { movieName, summary, dateWatched, rating } = req.body;

        const result = await axios.get(`http://www.omdbapi.com/?t=${movieName}&apikey=${API_KEY}`);
        const data = result.data;
        
        if (data.Response === 'True') {
            const name = data.Title;
            const poster = data.Poster;
    
            await db.query(`INSERT INTO mymovies (name, poster, summary, watcheddate, rating) VALUES ($1, $2, $3, $4, $5)`, [name, poster, summary, dateWatched, rating]);
            res.render("index.ejs", { movieFound: true });
        } else {
            res.render("index.ejs", { movieFound: false });
        }
    } catch (err) {
        console.error("Error:", err);
        res.status(500).send("No Movies found in that name, kindly check for the exact name");
    }
});


app.listen(port, () => {
    console.log("The server is listening on port " + port);
})