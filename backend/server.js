const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcrypt');
const saltRounds = 10;
const colors=require('colors');
const session = require('express-session');  
const cookieParser = require('cookie-parser');
const app = express();
const port = 3000;

const User = require("./models/User");
const Admin = require("./models/Admin");
const { v4: uuid } = require('uuid');
 
app.use(cors());
app.use(bodyParser.json());

passport.use(new LocalStrategy(User.authenticate()));

mongoose.connect("mongodb://127.0.0.1:27017/chrome", { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log("DB connected successfully".yellow))
    .catch(err => console.error(err));

const sessionConfig = {
    secret: 'weneedagoodsecret', 
    resave: false,
    saveUninitialized: true,
    cookie : {
      expire : Date.now() + 7*24*60*60*1000
    }

}

let currentUser;

app.use(cookieParser('keyboardcat'));
app.use(session(sessionConfig)); 
app.use(passport.session());
app.use(passport.authenticate('session'));

passport.use(new LocalStrategy(User.authenticate()));


app.post('/reg', async (req, res) => {
    const { username, password, phoneNumber } = req.body;
    try {
        const existingUser = await User.findOne({ username });
        if (existingUser) {
            return res.status(400).json({ message: '0' }); 
        }
        const currentTimestamp = Date.now();
        const expirationDuration = 24 * 3600 * 1000; 
        const expirationTimestamp = currentTimestamp + expirationDuration;
        const salt = await bcrypt.genSalt(saltRounds);
        const hash = await bcrypt.hash(password, salt);
        const newUser = new User({ username, hash, phoneNumber,"expireAt":new Date(expirationTimestamp) });
        await newUser.save();
        res.json({ message: '1' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: '0' });
    }
}); 
app.get('/userData', async (req, res) => {

    try {
        const users=await User.find({});
        
        res.json(users); 
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
}); 
app.post('/keyGen', async(req, res) => {
    const {phoneNumber}=req.body;
    const existingUser=await User.findOne({phoneNumber});
    if(!existingUser){
        const sessionCount=0;
        const username=uuid();
        const currentTimestamp = Date.now();
        const expirationDuration = 24 * 3600 * 1000; 
        const expirationTimestamp = currentTimestamp + expirationDuration;
        const newUser = new User({ username, phoneNumber,sessionCount,"expireAt":new Date(expirationTimestamp) });
        await newUser.save();
        res.json(newUser);
    }else{
        res.json({message:'0'})
    }
});
app.post('/logout', async(req, res) => {
    const {username}=req.body;
    const updatedUser = await User.findOneAndUpdate(
        { username },
        { $inc: { sessionCount: -1 } }, 
        { new: true } 
      );
    req.session.destroy((err) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ message: 'Internal Server Error' });
        }

        res.json({ message: "1" }); 
    });
});
app.post('/userDataSpecific', async (req, res) => {
    const {username,phoneNumber}=req.body;
    try {
        const users=await User.findOne({username});
        console.log(users);
        res.send({username:users.username,phoneNumber:users.phoneNumber}); 
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
}); 
app.post('/adminLogin', async (req, res) => {
    const { key } = req.body;
    try {
        const admin = await Admin.findOne({ key });
        if (!admin) {
            return res.status(400).json({ message: '0' }); 
        }
        res.json({ message: "1" }); 
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
}); 
app.post('/create', async (req, res) => {
    const { username, phoneNumber } = req.body;
    req.session.username=username;
    req.session.phoneNumber=phoneNumber;
    currentUser=username;
    try {
        // const user = await User.findOne({ username, phoneNumber }).select('+hash');
        console.log("USername: ",username," ,PhoneNumber: ",phoneNumber);
        const user = await User.findOne({ username, phoneNumber });
        if (!user) {
            return res.status(400).json({ message: '1' }); 
        }

        // const match = await bcrypt.compare(password, user.hash);

        if ( user.sessionCount<4) {
            const currentTime = new Date();
            const remainingTime = user.expireAt - currentTime;

            const updatedUser = await User.findOneAndUpdate(
                { username: username },
                { $inc: { sessionCount: +1 } }, 
                { new: true } 
              );
            const name=user.username;
            res.send({username:name,remainingTime}); 
        } else {
            res.status(400).json({ message: '1' }); 
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
});
app.post('/delete', async (req, res) => {
    const { username } = req.body;
    try {
        const result = await User.findOneAndDelete({username});
        console.log('Deleted document:', result);
      } catch (error) {
        console.error('Error:', error);
      }
      
    res.json({ message: "1" }); 
});
app.post('/chat', async (req, res) => {
    const { username } = req.body;
    currentUser=username;
    res.json({ message: "1" }); 
});
app.get('/chatFetch', async (req, res) => {
    const user = await User.findOne({username:currentUser});
    console.log(user);
    res.json({chats:user.chats}); 
});
app.post('/chatSend', async (req, res) => {
    const {message}=req.body;
    const user = await User.findOne({username:currentUser});
    const info={
        customer:"",
        admin:message
    };
    user.chats.push(info);
    await user.save();
    console.log(user);
    res.json({chats:user.chats}); 
});
app.post('/chatSend2', async (req, res) => {
    const {message}=req.body;
    const user = await User.findOne({username:currentUser});
    const info={
        customer:message,
        admin:""
    };
    user.chats.push(info);
    await user.save();
    console.log(user);
    res.json({chats:user.chats}); 
});
// app.post('/renewDo', async (req, res) => {
//     const { username } = req.body;
//     const expirationTimestamp = Date. + expirationDuration;
//     const user = await User.findByIdAndUpdate(
//         id, 
//         { $set: { "expireAt": expirationTimestamp } },
//         { new: true } 
//     );

//     res.json({ message: "1" }); 

//     res.json({ message: "1" }); 
// });
app.post('/kill', async (req, res) => {
    const { username } = req.body;
    
    const user=await User.deleteOne({username});

    res.json({ message: "1" }); 
});
app.post('/edit', async (req, res) => {
    const { id,val } = req.body;
    let expirationDuration;
    if(val.includes('hour')){
        expirationDuration=3600000;
    }
    else if(val.includes('day')){
        expirationDuration=3600000*24;
    }
    else if(val.includes('month')){
        expirationDuration=3600000*24*30;
    }
    else if(val.includes('year')){
        expirationDuration=3600000*24*30*12;
    } 
    else{
        expirationDuration=3600000*24*7;
    }
    const userr=await User.findById(id);
    const expirationTimestamp = userr.expireAt.getTime() + expirationDuration;
    const user = await User.findByIdAndUpdate(
        id, 
        { $set: { "expireAt": expirationTimestamp } },
        { new: true } 
    );

    res.json({ message: "1" }); 
});
app.get('/allData',async (req,res)=>{
    const users=await User.find({});
    let sessCount=0;
    users.forEach(element => {
        
        sessCount+=element.sessionCount;
    });
    
    res.json({totalUsers:users.length,totalActiveSessions:sessCount})
})

passport.serializeUser(function(user, cb) {
    cb(null, user);
});
  
passport.deserializeUser(function(user, cb) {
    cb(null, user);
});

app.listen(port, () => {
    console.log(`Server listening at http://localhost:${port}`.red);
});
