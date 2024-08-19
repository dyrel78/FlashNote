import express from 'express';
import bodyParser from 'body-parser';
import { MongoClient } from 'mongodb'
import multer from 'multer';
import session from 'express-session';
import 'dotenv/config'
import path from 'path';
import { fileURLToPath } from 'url';


const app = express();
const port = process.env.PORT || 8080;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(session({
    secret: 'secret',
    resave: true,
    saveUninitialized: true
}));


//Middleware to parse JSON bodies
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, '/Frontend/')));



app.get('*', (req, res) => {
    // res.send('index');
    res.sendFile(path.join(__dirname, 'Frontend', 'index.html'));
}
)

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


