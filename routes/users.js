const express = require('express');
const router = express.Router();
const userService = require('../services/userService');
const jwt = require('jsonwebtoken');
const AuthenticateWithJWT = require('../middlewares/authenticateWithJWT');

let userID = [];
let userEmail = [];
let userPassword = [];
let userOperations = [];


router.post('/register', async (req, res) => {
    try {
        // Register user with the new payload structure
        const userId = await userService.registerUser(req.body);

        res.status(201).json({ message: "User registered successfully", userId });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
})

router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        console.log("In user.js  @@  email, password  == ", email, password )
        const user = await userService.loginUser(email, password);
        console.log(user);
        if (user) {
            userID.push(user.id);
            userEmail.push(user.email);
            userPassword.push(user.password);
            userOperations.push("Login");
            // create the JWT token
            const token = jwt.sign({
                userId: user.id
            }, process.env.JWT_SECRET, {
                expiresIn: '1h'
            });

            res.json({
                'message': 'Logged in successful',
                token
            })

        } else {
            throw new Error("Unable to get user");
        }
    } catch (e) {
        console.log(e);
        res.status(400).json({
            'message': 'Unable to log in',
            'error': e.m
        })
    }
    console.log(userID, userEmail, userPassword, userOperations);
})

router.post('/logoff', async (req, res) => {

    function checkInArray(ID, IDArray) {
        return IDArray.includes(ID);
    }  //  function checkInArray(ID, IDArray) {
    function popFromArray(ID, IDArray) {
        if (checkInArray(ID, IDArray)) {
          const index = IDArray.indexOf(ID);
          if (index > -1) {
            IDArray.splice(index, 1);  // Removes the element at the found index
            return true;  // ID was removed
          }
        }
        console.log("Not Found");
        return false;  // ID was not found
      }  //  function popFromArray(ID, IDArray) {
      

    try {
        const { email, password } = req.body;
        const user = await userService.loginUser(email, password);
        if (user) {

            // create the JWT token
            const token = jwt.sign({
                userId: user.id
            }, process.env.JWT_SECRET, {
                expiresIn: '0h'
            });
            // popFromArray(user.id, userID);
            // popFromArray(user.email, userEmail);
            // popFromArray(user.password, userPassword);
            userID.push(user.id);
            userEmail.push(user.email);
            userPassword.push(user.password);
            userOperations.push("Logoff");
            console.log(userID, userEmail, userPassword, userOperations);

            console.log(userID, userEmail, userPassword);
                        

            res.json({
                'message': 'Logged off successful',
                token
            })

        } else {
            throw new Error("Unable to get user");
        }
    } catch (e) {
        console.log(e);
        res.status(400).json({
            'message': 'Unable to log off',
            'error': e.m
        })
    }
})

router.post('/password',  async (req, res) => {
    try {
        const { email, password, passwordNew1, passwordNew2 } = req.body;
        console.log("In users.js @@ req.body  ==  ", req.body)
        console.log("In users.js @@ email, password  ==  ", email, password)
        console.log("In users.js @@ passwordNew1, passwordNew2", passwordNew1, passwordNew2)
        const user = await userService.passwordChangeUser(email, password, passwordNew1, passwordNew2);

        console.log(user);
        if (user) {
            userID.push(user.id);
            userEmail.push(user.email);
            userPassword.push(user.password);
            userOperations.push("Password");
            // create the JWT token
            const token = jwt.sign({
                userId: user.id
            }, process.env.JWT_SECRET, {
                expiresIn: '1h'
            });

            res.json({
                'message': 'Logged in successful',
                token
            })

        } else {
            throw new Error("Unable to get user");
        }
    } catch (e) {
        console.log(e);
        res.status(400).json({
            'message': 'Unable to log in',
            'error': e.m
        })
    }
    console.log("In users.js  @@  userID, userEmail, userPassword, userOperations  ==  ", userID, userEmail, userPassword, userOperations);
})

// get the details of the current logged-in user from a JWT
router.get('/me', AuthenticateWithJWT, async (req, res) => {
    console.log("req.body  ==  ", req.body);
    try {
        const user = await userService.getUserDetailsById(req.userId);
        console.log("user  ==  ", user);
        if (!user) {
            return res.status(404).json({
                message: "User is not found"
            })
        }

        const {password, ...userWithOutPassword} = user;

        res.json({
            'user': userWithOutPassword
        });


    } catch (e) {
        res.status(500).json({
            message: e.message
        })
    }

})

// update the details of the current logged-in user
router.put('/me', AuthenticateWithJWT, async (req, res) => {
    console.log("req.body  ==  ", req.body);
    try {
        // todo: validate if all the keys in req.body exists
        if (req.body.name && req.body.email && req.body.salutation && req.body.marketingPreferences || !req.body.country) {
            return res.status(401).json({
                'error':'Invalid payload or missing keys'
            })
        }
        const userId = req.body.id;
        console.log(userId);
        await userService.updateUserDetails(userId, req.body);
        res.json({
            'message':'User details updated'
        })
        

    } catch (e) {   
        console.log(e);
        res.status(500).json({
            'message':'Internal server error'
        })

    }
    // userID.push(user.id);
    // userEmail.push(user.email);
    // userPassword.push(user.password);
    // userOperations.push("Password Change");
    // console.log(userID, userEmail, userPassword, userOperations);
})

// delete the current user
router.delete('/me', AuthenticateWithJWT, async (req, res) => {
   try {
     await userService.deleteUserAccount(req.userId);
     res.json({
        'message': "User account deleted"
     })
   } catch (e) {
     console.log(e);
     res.status(500).json({
        'message':'Internal Server Error'
     })
   }
//    userID.push(user.id);
//    userEmail.push(user.email);
//    userPassword.push(user.password);
//    userOperations.push("User deleted");
//    console.log(userID, userEmail, userPassword, userOperations);
})

module.exports = router;