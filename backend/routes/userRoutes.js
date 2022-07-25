import express from 'express';
import User from '../models/userModel.js';
import expressAsyncHandler from 'express-async-handler';
import bcrypt from 'bcrypt';
import { generateToken } from '../util.js';
import { isAuth } from '../util.js';

const saltRounds = 10;
const userRouter = express.Router();

userRouter.post(
  '/signin',
  expressAsyncHandler(async (req, res) => {
    //await
    const i = await req.body;
    const user = await User.findOne({ email: req.body.email });
    console.log('request: ', i);
    console.log('user found', user);
    if (user === null) {
      res.status(402).send({ message: 'Invalid email address' });
      return;
    }
    console.log(
      'password match ',
      bcrypt.compareSync(req.body.password, user.password)
    );
    if (user) {
      if (bcrypt.compareSync(req.body.password, user.password)) {
        res.send({
          _id: user._id,
          name: user.name,
          email: user.email,
          isAdmin: user.isAdmin,
          password: user.passWord,
          token: generateToken(user),
        });
        //error setting header without return
        return;
      } else {
        res.status(403).send({ message: 'Wrong Password' });
      }
      //res.send(user);
      //error setting header without res.end()
    } else {
      console.log('invalid email');
      res.status(401).send({ message: 'invalid email or password' });
    }
  })
);
userRouter.post(
  '/signup',
  expressAsyncHandler(async (req, res) => {
    //await
    console.log(req.body.password);
    console.log(bcrypt.hashSync(req.body.password, saltRounds));
    const newUser = new User({
      name: req.body.name,
      email: req.body.email,
      //error creating password, fix bcrypt,
      //fixed by adding salt:10 seen in data.js
      password: bcrypt.hashSync(req.body.password, saltRounds),

      //password: req.body.password,
    });

    const user = await newUser.save();
    console.log('new user created', user);

    res.send({
      _id: user._id,
      name: user.name,
      email: user.email,
      isAdmin: user.isAdmin,
      password: user.passWord,
      token: generateToken(user),
    });
    //res.send('created');
    //error setting header without return
    // return;
    //res.send(user);
    //error setting header without res.end()

    //res.end();
  })
);
userRouter.put(
  '/profile',
  isAuth,
  expressAsyncHandler(async (req, res) => {
    //console.log(req.body);

    console.log(req.user._id);
    const user = await User.findById(req.user._id);
    if (user) {
      user.name = req.body.name || user.name;
      user.email = req.body.email || user.email;
      if (req.body.password) {
        user.password = bycrpt.hashSync(req.body.passWord, saltRounds);
      }
    } else {
      console.log('user not found');
    }
    const updateUser = await user.save();
    res.send({
      id: updateUser._id,
      name: updateUser.name,
      email: updateUser.email,
      isAdmin: updateUser.isAdmin,
      token: generateToken(updateUser),
    });
    res.end();
    console.log('update user', updateUser);
  })
);
export default userRouter;
