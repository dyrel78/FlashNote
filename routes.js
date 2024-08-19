import Router from 'express';
const router = Router();
const index = require('./index.js'); 



router.get('api/test', (req, res) => {
    database.collection('testagain').find().toArray((err, result) => {
        if (err) {
            return console.log(err);
        }
        res.send(result);
    })
})


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







