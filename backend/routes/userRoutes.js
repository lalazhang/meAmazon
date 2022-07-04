import express from 'express';
import User from '../models/userModel.js';
import expressAsyncHandler from 'express-async-handler';
import bcrypt from 'bcrypt';
import { generateToken } from '../util.js';
const userRouter = express.Router();

userRouter.post(
  '/signin',
  expressAsyncHandler(async (req, res) => {
    //await
    const i = await req.body;
    const user = await User.findOne({ email: req.body.email });
    console.log('request: ', i);
    console.log('user found', user);

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
      }
      //res.send(user);
      //error setting header without res.end()
      res.end();
    } else {
      res.status(401).send({ message: 'invalid email or password' });
    }
  })
);
userRouter.post(
  '/signup',
  expressAsyncHandler(async (req, res) => {
    //await
    console.log(req.body.password);
    console.log(bcrypt.hashSync(req.body.password, 10));
    const newUser = new User({
      name: req.body.name,
      email: req.body.email,
      //error creating password, fix bcrypt,
      //fixed by adding salt:10 seen in data.js
      password: bcrypt.hashSync(req.body.password, 10),

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

export default userRouter;
