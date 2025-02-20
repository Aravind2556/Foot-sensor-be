const express = require('express')
const Register = require('../model/Register')



const router = express.Router();


// // API endpoint for creating a new user registration.
router.post('/Create-Account', async (req, res) => {
    try {
        let user = await Register.find({})
        let id;
        if (user.length > 0) {
            let last_product_array = user.slice(-1);
            let last_product = last_product_array[0];
            id = last_product.Id + 1;
        } else {
            id = 1
        }
        const { name, email, contact, password, confirmPassword , age , dob , gender } = req.body
        console.log(name, email, contact, password, confirmPassword, age , dob , gender)

        if (password !== confirmPassword) {
            return res.json({ success: false, message: "email is not matched" })
        }
        if (name && email && contact && password && age && dob && gender) {
            const oneuser = await Register.findOne({ Email: email })
            if (oneuser) {
                return res.send({ success: false, message: "A user with this email already exists. Please use a different email to register." })
            }
            const newuser = new Register({ Id: id, Name: name, Email: email, Password: password, Contact: contact, Age : age , Dob : dob , Gender : gender, Role: "User" })
            req.session.profile = {
                Id: newuser.Id,
                Name: newuser.Name,
                Email: newuser.Email,
                Role: newuser.Role,
            };
            const saveuser = await newuser.save()
            if (saveuser) {
                return res.send({ success: true, message: "User registered successfully.", Role : req.session.profile  })
            }
            else {
                return res.send({ success: false, message: "Registration failed. Please try again later." })
            }
        }
        else {
            return res.send({ success: false, message: "All fields are required. Please provide complete user information." })
        }
    }
    catch (err) {
        console.log("Error during user registration:", err)
        return res.send({ success: false, message: "An error occurred during registration. Please contact the developer." })
    }
})



router.post('/Login-User', async (req, res) => {
    try {
        const { email, password } = req.body
        console.log("login value", email, password)

        const isfindLogin = await Register.findOne({ Email: email })
        if (isfindLogin) {
            if (isfindLogin.Password === password) {
                req.session.profile = isfindLogin
                return res.json({ success: true, message: "Login succfully" })

            }
            else {
                return res.json({ success: false, message: "Invalid password" })
            }
        }
        else {
            return res.json({ success: false, message: "invalid user id" })
        }
    }
    catch (err) {
        console.log("Troule error in login", err)
        return res.json({ success: false, message: "Trouble Error to login please contact " })
    }
})




router.get('/username', async (req, res) => {
    try {
        const isRegister = req.session.profile
        if (isRegister) {
            const isfindRegister = await Register.findOne({ Email: req.session.profile.Email })
            if (isRegister) {
                return res.json({ response: "ok", Name: isfindRegister.Name })
            }
            else {
                return res.json({ response: "notok", message: "please login", Name: "profile" })

            }
        }
        else {
            return res.json({ response: "notok", message: "please login", Name: "profile" })
        }
    }
    catch (err) {
        console.log("Trouble error to profileuser", err)
        return res.json({ response: "notok", message: "Troble error to usrename please contact to admin" })
    }
})



router.get('/authentication', async (req, res) => {
    try {
        const isValidSession = req.session.profile
        if (isValidSession) {
            const fetchUser = await Register.findOne({ Email: req.session.profile.Email })
            if (fetchUser) {
                return res.json({ success: true, user: fetchUser })
            }
            else {
                return res.json({ success: false, message: "No User Available " })
            }
        }
        else {
            return res.json({ success: false, message: "User not logged in" })
        }
    }
    catch (err) {
        console.log("Error in checking Authentication: ", err)
        return res.json({ success: false, message: "Troble in checking Authentication, Please contact developer!" })
    }
})



router.get('/logout', async (req, res) => {

    try {

        if (req.session.profile) {
            req.session.destroy()
            return res.json({ success: true, message: "Logout successfully" })
        }
        else {
            return res.json({ success: false, message: "error" })
        }
    }
    catch (err) {
        console.log("Trouble in erro to logout", err)
        return res.json({ response: "notok", message: "Trouble error contact admin" })
    }
})



module.exports = router