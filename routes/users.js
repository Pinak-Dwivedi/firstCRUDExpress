const express = require('express');
const UserModel = require('../models/user');
const ErrorHandler = require('../utils/ErrorHandler')

// const cookieParser = require('cookie-parser'); 
//also works when included in server file (as a global middleware)
//There is no need to use cookie-parser when using express-session
//Express-session since v1.5.0 no longer needs cookie-parser

const { validateCreateUser, validateLoginUser } = require("../config/validation");

const router = express.Router();

// router.use(cookieParser()); //also works when included in server file


//Instantiating UserModel
const userModel = new UserModel();

const isAuthenticated = (req, res, next) => {

    // just cookies
    // if(req.cookies.token)
    // return next();

    //session
    if(req.session.isAuthenticated)
    return next();

    // console.log(req.session)
    return res.redirect('/users/login');
}


//New User Form

router.get('/new', (req, res) => {
    // console.log(req.cookies)

    //just cookies
    // if(!req.cookies.token)           //now using isAuthenticated
    // {
    //     // res.redirect('/users/login');        
    //     //For learning:- This gives "cannot set headers after they are sent to the client"
    //     return res.render('createUser'); // This doesn't because of return
    // }

    if(req.session.isAuthenticated)
    return res.redirect('/users/')

    res.render('createUser');
});


//Login User Form

router.get('/login', (req, res) => {

    // just cookies
    // if(req.cookies.token)
    // {
    //    return res.redirect('/users')
    // }

    //session
    if(req.session.isAuthenticated)
    return res.redirect('/users')

    res.render('loginUser');
});


//Logout User

router.get('/logout', isAuthenticated, (req, res) => {


    //just cookies
    // res.cookie('token', null, {
    //     httpOnly: true,
    //     expires: new Date(Date.now())
    // })

    //session
    req.session.destroy();
    res.clearCookie('session.id')

    res.redirect('/users/login');
});



// Get User With ID (update user form)

router.get('/:id', isAuthenticated, (req, res) => {

    userModel.getUserWithId(req.params.id)
    .then( result => {

    // console.log(result[0].name, result[0].profession); 

    res.render('updateUser', {id: req.params.id, name: result[0].name, profession: result[0].profession});

    })
    .catch( err => {
        next(err)
        // console.log(err)
    });
});

//Get All Users

router.get('/', isAuthenticated, async (req, res) => {

    // console.log("heeeeeelo")

    //just cookies
    // if(!req.cookies.token)
    // {
    //     // res.redirect('/users/login');        
    //     //For learning:- This gives "cannot set headers after they are sent to the client"

    //     return res.redirect('/users/login');  // But this doesn't because of return
    // }


    // console.log(req.cookies, "hello")
    // const results = await userModel.getUsers();  //promise version

    userModel.getUsers((err, results) => {               //callBack version

        if(err)
        // throw err;
        next(new ErrorHandler(err.message, 500))


        res.render('users', { usersData : results, isLoggedIn : true, isAtUsersPage: true });
    });

    // console.log(results);
    

    // res.render('users', { usersData : results });

    // if(results.length > 0)
    // {
    //     let usersData = '';

    //      for(row of result)
    //      {
    //       usersData += `<tr><td> ${row.id} </td> <td> ${row.name} </td> <td> ${row.profession} </td></tr>`
    //      };
    //         res.render('users', { usersData : usersData });
    // }
});


//Create New User

router.post('/', (req, res) => {

    // if(req.body.name != null && req.body.name.trim() != '' && req.body.profession != null && req.body.profession.trim() != '' && req.body.password != null && req.body.password.trim() != '')
    // {
    //     userModel.createUser(req)
    //     .then( result => {

    //         //Returning the new created user / as the rest api
    //         // res.redirect(`/users/${result.insertId}`);

    //         //Now redirecting to All Users page
    //         // res.app.locals.successMsg = "User Created Successfully";
    //         res.redirect(`/users/`);
    //     })
    //     .catch( err => console.log(err));
    // }
    // else
    // {
    //     console.log('err')
    //     res.render('createUser', {errMsg : 'Please enter a valid name and profession'});
    // }

    if(req.session.isAuthenticated)
    return res.redirect('/users');
    
    //validation using JOI

    const validationResult = validateCreateUser( req.body )
    let errors = {};

    if(validationResult.error)
    {
        for(let error of validationResult.error.details)
        {
            switch(error.path[0])
            {
                case "name":
                    errors.name = error.message;
                    break;
                case "email":
                    errors.email = error.message;
                    break;
                case "profession":
                    errors.profession = error.message;
                    break;
                case "password": 
                    errors.password = error.message.replace(/"/g, "").replace("p", "P");
                    break;
                case "confirmPassword":
                    errors.confirmPassword = error.message;
                    break;
            }
        }

        res.render('createUser', {
            name: validationResult.value.name,
            email: validationResult.value.email,
            profession: validationResult.value.profession,
            errors,
        })
    }

    //if no validation erros then checking if email is unique
    else
    {
       userModel.getUserWithEmail(validationResult.value.email).then( isEmailUnique => {

            if(!isEmailUnique)
            {
                errors.email = "Email already exists"
                res.render('createUser', {
                    name: validationResult.value.name,
                    email: validationResult.value.email,
                    profession: validationResult.value.profession,
                    errors,
                })
            }
            else
            {
                userModel.createUser(validationResult.value)
                .then( result => {
        
                    //Returning the new created user / as the rest api
                    // res.redirect(`/users/${result.insertId}`);
        
                    //Now redirecting to login user page
                    // res.app.locals.successMsg = "User Created Successfully";
                    res.redirect(`/users/login`);
                })
                .catch( err => {
                    // console.log(err)
                    next(err)
                });
            }
       })
       .catch(err => {
        // console.log(err)
        next(err)
       }) 
    }

    /*  Now using Joi messages() function to create custom error messages

        let arr = [];
        for(err of validationResult.error.details)
        {
            switch(err.type)
            {
                case "any.only":
                    arr.push(err.path[0] + " and password must be same");
                    break;
                case "string.empty":
                    arr.push(err.path[0] + " is required")
                    break;
                default:
                    arr.push(err)
            }
        }
        res.json(arr)
    */
});

router.post('/login', async (req, res) => {

    const validationResult = validateLoginUser( req.body )
    const loginErrors = {};

    if(validationResult.error)
    {
        for(let err of validationResult.error.details)
        {
            switch(err.path[0])
            {
                case "email": 
                    loginErrors.email = err.message;
                    break;

                case "password":
                    loginErrors.password = err.message.replace(/"/g, "").replace("p", "P");
                    break;
            }
        }
        res.render('loginUser', {
            email: validationResult.value.email,
            errors: {
                email: loginErrors.email,
                password: loginErrors.password
            }
        })
    }
    else
    {
        try
        {
            const user = await userModel.loginUser(validationResult.value)
            // return console.log(user)

            //setting cookies
            // res.cookie('token', 'tokenId', {
            //     httpOnly: true,
            //     expires: new Date(Date.now() + 180 * 1000) //cookie expires in 3 minutes after login
            // })

            // setting session
            req.session.isAuthenticated = true;
            req.session.user = user;

            res.redirect('/users/');
        }
        catch(err)
        {
            console.log(err);
            res.render('loginUser', {errMsg : 'Incorrect name or password!'})
        }
    }

    
});


//Update User

router.put('/:id', isAuthenticated, (req, res) => {

    userModel.updateUser({id: req.params.id, name: req.body.userName, profession: req.body.userProfession})
    .then( result => {
        res.redirect(303, '/users/')
    });
});


//Delete User

router.delete('/:id', isAuthenticated, async (req, res) => {

    // console.log('in routes', req.params.id)
    await userModel.deleteUser(req.params.id);

    res.redirect('/users/')

});

module.exports = router;