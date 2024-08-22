import express from 'express';
import User from './models/user.js';
import Note from './models/note.js';
const router = express.Router();




// Example API route
router.get('/api/test', async (req, res) => {
    try {
        const users = await User.find(); // Use the User model to fetch data
        res.send(users);
    } catch (err) {
        console.error(err);
        res.status(500).send("Error retrieving users");
    }
});
router.get('/api/hello', async (req, res) => {
    res.send("Hello, World!");
});


router.post('/api/login', (req, res) => {

    try {
        const { username, password } = req.body;
        database.collection('users').findOne({
            where: {
                username: username,
                password: password
            },
        });
        req.session.save(() => {
            req.session.loggedIn = true;
            req.session.username = username;
            res.session.user = {
                username: username,
                loggedIn: true
            };
            res.send({ success: true });
        });

    } catch (err) {
        res.send({ success: false });
    }
});


router.post('/api/logout', (req, res) => {
    req.session.destroy(() => {
        res.send({ success: true });
    });
}
)

export default router;






