const { Router } = require('express');
const router = Router();
const { body, validationResult } = require('express-validator');
const { genSalt, hash, compare } = require('bcryptjs');
const pkg = require('jsonwebtoken');
const { sign } = pkg;
const fetchuser = require('../middleware/fetchuser.js');
const JWT_SIGN = process.env.JWT_SIGN;
const User = require('../models/Users.js');
const dotenv = require('dotenv');
dotenv.config();
 

const validate = validations => {
  return async (req, res, next) => {
    // sequential processing, stops running validations chain if one fails.
    for (const validation of validations) {
      await validation.run(req);
    }
    next();
  };
};
router.post('/signup', validate([
  body('name', 'Name cannot be less than 3 characters').isLength({ 'min': 3 }),
  body('email', 'Enter a valid email address').isEmail(),
  body('password', 'Length should be greater than or equal to 6').isLength({ 'min': 6 })
]), async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({"success":false, errors: errors.array() });
    }
    const auser = await User.findOne({"success":false, email: req.body.email });
    if (auser) {
      return res.status(400).json({ "success":false,error: 'A user with this email already exist.' })
    }
    const salt = await genSalt(10);
    const secpass = await hash(req.body.password, salt);

    const user = await User.create({
      name: req.body.name,
      email: req.body.email,
      password: secpass,
      role:req.role
    })
    const data = {
      user: {
        id: user.id,
        role:user.role
      }
    }
    var token = sign(data, JWT_SIGN);
    res.json({"success":true,'authtoken':token})
  } catch (error) {
    console.error(error.message);
    res.status(500).send('Internal Server Error');
  }
})

router.post('/login', validate([
  body('email', 'Enter a valid email address').isEmail(),
  body('password', 'Password Cannot be blank').exists(),
]), async (req, res) => {
  try {
    const { email, password } = req.body;
    const auser = await User.findOne({ email });
    if (!auser) {
      return res.status(400).json({"success":false, error: 'Please enter correct credentials.' })
    }
    const passcompare = await compare(password, auser.password);
    if (!passcompare) {
      return res.status(400).json({"success":false, error: 'Please enter correct credentials.' })
    }
    const data = {
      user: {
        id: auser.id,
        role:auser.role
      }
    }
    var token = sign(data, JWT_SIGN);
    res.json({"success":true, "authtoken": token })

  } catch (error) {
    console.error(error);
    res.status(500).send('Internal Server Error');
  }

})

router.get('/getuser', fetchuser, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    res.json(user);
  } catch (error) {
    console.error(error.message);
    res.status(500).send('Internal Server Error');
  }
});

module.exports =  router;