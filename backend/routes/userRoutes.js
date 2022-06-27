import express from 'express';
import User from '../models/userModel.js';
import expressAsyncHandler from 'express-async-handler';
import bcrypt from 'bcrypt';
import { generateToken } from '../util.js';
const userRouter = express.Router();
userRouter.post(
  '/test',
  expressAsyncHandler(async (req, res) => {
    //await
    const i = await req.body;
    const user = await User.findOne({ email: req.body.email });
    console.log('request: ', i);
    if (user) {
      if (bcrypt.compareSync(req.body.passWord, user.passWord)) {
        res.send({
          _id: user._id,
          name: user.name,
          email: user.email,
          isAdmin: user.isAdmin,
          passWord: user.passWord,
          token: generateToken(user),
        });
        //error setting header without return
        return;
      }
      res.send(user);
      //error setting header without res.end()
      res.end();
    } else {
      res.status(401).send({ message: 'invalid email or password' });
    }
  })
);

export default userRouter;
