import express from 'express';
import bodyParser from 'body-parser';
import { MongoClient } from 'mongodb'
import multer from 'multer';
import session from 'express-session';
import 'dotenv/config'

var app = express();

app.use(session({
    secret: 'secret',
    resave: true,
    saveUninitialized: true
}));

//Middleware to parse JSON bodies
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());





app.get('*', (req, res) => {
    res.send('404-Page not found');
}
)

app.get('api/test', (req, res) => {
    database.collection('testagain').find().toArray((err, result) => {
        if (err) {
            return console.log(err);
        }
        res.send(result);
    })})


var database;
app.listen(8080, () => {
    MongoClient.connect(process.env.DB_CONNECTION_STRING, (err, client) => {
       // database = client.db(process.env.DATABASE_NAME);
        database = client.db('TestingDB');
        console.log('Connected to database');
    }
    )
    console.log('Server is running on port 8080');

    console.log('Click here to open the app: http://localhost:8080');
}
)


