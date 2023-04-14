const con = require('../config/db');
const bcrypt = require('bcryptjs');

module.exports = class User {

    // Promise Version of getUsers
    /*
    async getUsers()
    {
        return new Promise( (resolve, reject) => {

            con.query('select * from users', (err, results, fields) => {

                if(err)
                reject(err);
                resolve (results);

            });
        });  
    }
    */

    //CallBack version of getUsers

    getUsers(callBack)
    {
        con.query('SELECT id, name, profession FROM users ORDER BY id ASC', (err, results, fields) => {
            callBack(err, results);
        });  
    }

    createUser(userData)
    {     
        return new Promise( async function (resolve, reject)
        {
            try
            {                
                const hashedPassword = await bcrypt.hash(userData.password, 10);

                con.query('insert into users ( name, email, profession, password) values(?, ?, ?, ?)', [userData.name, userData.email, userData.profession, hashedPassword], (err, result) => 
                {    
                    if(err)
                    reject(err);

                    resolve(result);
                });            
            }
            catch(error)
            {
                reject(error);
            }
        });
    }

    loginUser(loginCredentials)
    {
        return new Promise( function ( resolve, reject) {

            con.query(`Select email, password from users where email = ?`, [loginCredentials.email], async (err, result) =>{
                try
                {
                    if(err)
                    reject(err)

                    if(result.length)
                    {
                        const isPasswordMatching = await bcrypt.compare(loginCredentials.password, result[0].password);

                        isPasswordMatching ? resolve(result[0]) : reject (false);
                    }
                    else
                    reject(false)
                }
                catch(error)
                {
                    reject(error);
                }
                
            });
        });
    }

    getUserWithId(id)
    {
        const promise = new Promise( (resolve, reject) => {

            con.query('Select * from users where id = ?', [id], (err, result) => {
                if( err )
                reject(err);
                
                resolve(result);
            });
        });

        return promise;
    }

    async getUserWithEmail(email)
    {
        return new Promise( (resolve, reject) => {

            con.query(`Select * from users where email = ?`, [email], (err, result) => {

                if(err)
                reject(err);

                if(result.length)
                resolve(false);     //Entered email is not unique

                resolve(true);      //Entered email is unique
            });
        });
    }

    updateUser(userData)
    {
        return new Promise( (resolve, reject) => {
            
            con.query('update users set name = ?, profession = ? where id = ?', [userData.name, userData.profession, userData.id], (err, result) => {

                if(err)
                reject(err)
                resolve(result);
            });
        });
    }

    deleteUser(userId)
    {
        const promise = new Promise( (resolve, reject) => {

            con.query('delete from users where id = ?', [userId], (err, result, fields) => {

                if(err)
                reject(err);
                resolve(result);
            });
        });

        return promise;
    }

}