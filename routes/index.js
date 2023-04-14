const express = require('express');
const router = express.Router();


router.get('/', (req, res) => {
    // res.send("Welcome to my CRUD application")

    // if(req.cookies.token)
    // return res.redirect('/users/')
    if(req.session.isAuthenticated)
    return res.redirect('/users/')
    
    res.render('index', {isAtHomePage: true});
});

router.get('/favicon.ico', (req, res) => {
    // console.log('favicon');
    res.status(204);
});


module.exports = router;