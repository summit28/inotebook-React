const express = require('express');
const User = require('../models/User');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
var fetchuser = require('../middleware/fetchuser')
const JWT_SECRET = 'Jon banega Don'


//Route1:create a user using post "/api/auth/createuser" no login require
router.post('/createuser', [
   body('name', 'Enter a valid name').isLength({ min: 3 }),
   body('email', 'Enter a valid email').isEmail(),
   body('password', 'Password must be atleast 6 charcter').isLength({ min: 5 }),
], async (req, res) => {
   let success = false;
   //If there are errors, return bad request and the errors
   const errors = validationResult(req);
   if (!errors.isEmpty()) {
      return res.status(400).json({ success, errors: errors.array() });
   }
   try {
      //check whether the user with this email exists already 
      let user = await User.findOne({ email: req.body.email })
      if (user) {
         return res.status(400).json({ success, error: "Sorry a user with this email this already exists" })
      }
      const salt = await bcrypt.genSalt(10);
      secPass = await bcrypt.hash(req.body.password, salt);
      //create a new user
      user = await User.create({
         name: req.body.name,
         password: secPass,
         email: req.body.email,
      });
      const data = {
         user: {
            id: user.id
         }
      }
      const authtoken = jwt.sign(data, JWT_SECRET);
      success = true;
      res.json({ success, authtoken })

   } catch (error) {
      console.error(error.message);
      res.status(500).send("Internal error occured");
   }
})

//Route:2 Authenticate a user using POST "/api/auth/login" no login require
router.post('/login', [
   body('email', 'Enter a valid email').isEmail(),
   body('password', 'Password cannot be blank').exists(),
], async (req, res) => {
   let success = false;
   //If there are errors, return bad request and the errors
   const errors = validationResult(req);
   if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
   }
   const { email, password } = req.body;
   try {
      let user = await User.findOne({ email });
      if (!user) {
         success = false;
         return res.status(400).json({ error: "please try to login with correct credentials" })
      }
      const passwordCompare = await bcrypt.compare(password, user.password);
      if (!passwordCompare) {
         success = false;
         return res.status(400).json({ success, error: "please try to login with correct credentials" })
      }

      const data = {
         user: {
            id: user.id
         }
      }
      const authtoken = jwt.sign(data, JWT_SECRET);
      success = true;
      res.json({ success, authtoken })
   }
   catch (error) {
      console.error(error.message);
      res.status(500).send("Internal error occured");
   }
});
//Route 3: Get logging user details using POST "/api/auth/getuser"login require
router.post('/getuser', fetchuser, async (req, res) => {
   try {
      userId = req.user.id;
      const user = await User.findById(userId).select("-password")
      res.send(user)
   } catch (error) {
      console.error(error.message);
      res.status(500).send("Internal error occured");
   }
})

module.exports = router