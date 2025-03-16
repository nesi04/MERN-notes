require('dotenv').config();

const config = require('./config.json');
const mongoose = require('mongoose');

mongoose.connect(config.connectionString);

const User = require('./models/user.model');
const Note = require('./models/note.model');

const express = require('express');
const cors = require('cors');

const app = express();

const jwt = require('jsonwebtoken');
const {authenticateToken} = require('./utilities');

app.use(express.json());

app.use(cors({
    origin:'*'
}));
app.get('/',(req,res)=>{
    res.json({data:'Hello'});
})

//
//create account 

app.post('/create-account',async(req,res)=>{
    const {fullName,email,password} = req.body;
    if(!fullName){
        return res.status(400).json({message:'fullName is required'});
    }
    if(!email){
        return res.status(400).json({message:'email is required'});
    }
    if(!password){
        return res.status(400).json({message:'password is required'});
    }
    const isUser = await User.findOne({email:email});
    if(isUser){
        return res.status(400).json({message:'User already exists',error:true,});
    }
    const user = new User({
        fullName,
        email,
        password,
    });
    await user.save();
    const accessToken = jwt.sign({user},process.env.ACCESS_TOKEN_SECRET,{expiresIn:"3600m",});
    return res.json({
        error:false,
        user,
        accessToken,
        message:'User created successfully',
    })
});

app.post('/login',async(req,res)=>{
    const {email,password} = req.body;
    if(!email){
        return res.status(400).json({message:'email is required'});
    }
    if(!password){
        return res.status(400).json({message:'password is required'});
    }
    const userInfo = await User.findOne({email:email});
   if(!userInfo){
       return res.status(400).json({message:'User not found',error:true});
   }
   if(userInfo.email===email && userInfo.password===password){
       const user = {user:userInfo};
       const accessToken = jwt.sign(user,process.env.ACCESS_TOKEN_SECRET,{expiresIn:"36000m",});
       return res.json({error:false,email,accessToken,message:'Login successful'});
   }else{
       return res.status(400).json({message:'Invalid credentials',error:true});
   };
});

app.get('/get-user',authenticateToken,async (req,res)=>{
    const {user}=req.user;
    const isUser =await User.findOne({_id:user._id});
    if(!isUser){
        return res.sendStatus(401);
    }
    return res.json({
        user:{fullName:isUser.fullName,email:isUser.email,"_id":isUser._id},
        messages:'',
    });
});

app.post('/add-note',authenticateToken,async (req,res)=>{
    
  const {title,content,tags} = req.body;
  const {user}=req.user;
  if(!title){
      return res.status(400).json({message:'title is required'});
  }
  if(!content){
      return res.status(400).json({message:'content is required'});
  }
  try{
        const note = new Note({
            title,
            content,
            tags:tags||[],
            userId:user._id,
        });
        await note.save();
        return res.json({error:false,note,message:'Note added successfully'});
  }catch(err){
      return res.status(500).json({message:err.message,error:true});
  }
});

app.put('/edit-note/:noteId',authenticateToken,async(req,res)=>{
    const noteId = req.params.noteId;
    const {title,content,tags,isPinned}=req.body;
    const {user} = req.user;
    if(!title &&!content&&!tags){
        return res.status(400).json({message:'title,content or tags is required',error:true});
    }
    try{
        const note = await Note.findOne({_id:noteId,userId:user._id});
        if(!note){
            return res.status(400).json({message:'Note not found',error:true});
        }
        if(title){
            note.title=title;
        }
        if(content){
            note.content=content;
        }
        if(tags){
            note.tags=tags;
        }
        if(isPinned){
            note.isPinned=isPinned;
        }
        await note.save();
        return res.json({error:false,note,message:'Note updated successfully'}); 
    }
    catch(err){
        return res.status(500).json({message:err.message,error:true});
    }
});
app.get('/get-notes',authenticateToken,async(req,res)=>{

    const {user}=req.user;
    try{
        const notes = await Note.find({userId:user._id}).sort({isPinned:-1});
        return res.json({error:false,notes,message:'Notes fetched successfully'});
    }catch(err){
        return res.status(500).json({message:err.message,error:true});
    }
});

app.delete('/delete-note/:noteId',authenticateToken,async(req,res)=>{
    const noteId = req.params.noteId;
    const {user}=req.user;
    try{
        const note = await Note.findOne({_id:noteId,userId:user._id});
        if(!note){
            return res.status(400).json({message:'Note not found',error:true});
        }
        await Note.deleteOne({_id:noteId,userId:user._id});
        return res.json({error:false,message:'Note deleted successfully'});
    }catch(err){
        return res.status(500).json({message:err.message,error:true});
    }
});

app.put('/update-note-pinned/:noteId', authenticateToken, async (req, res) => {
    const noteId = req.params.noteId;
    const { isPinned } = req.body;
    const { user } = req.user;

    console.log("Received isPinned:", isPinned);

    if (isPinned === undefined) {
        return res.status(400).json({ message: 'isPinned is required', error: true });
    }

    try {
        const note = await Note.findOne({ _id: noteId, userId: user._id });

        if (!note) {
            return res.status(400).json({ message: 'Note not found', error: true });
        }

        console.log("Before update:", note.isPinned);

        // Ensure that `false` is properly saved
        note.isPinned = isPinned;
        await note.save();

        const updatedNote = await Note.findById(noteId);  // Fetch the latest value
        console.log("After update (DB Check):", updatedNote.isPinned);  

        return res.json({ error: false, note: updatedNote, message: 'Note pinned updated successfully' });
    } catch (err) {
        return res.status(500).json({ message: err.message, error: true });
    }
});

app.get('/search-notes/',authenticateToken,async(req,res)=>{
    const {user}=req.user;
    const {query}=req.query;
    if(!query){
        return res.status(400).json({error:true,message:"Search query is required"});

    }
    try {
        const matchingNotes = await Note.find({
            userId:user._id,
            $or:[
                {title:{$regex: new RegExp(query,'i')}},
                {content:{$regex: new RegExp(query,'i')}},

            ],
        });
        return res.json({
            error:false,
            notes:matchingNotes,
            message:"Matching notes retrieved"
        });
        
    } catch (error) {
        return res.status(500).json({error:true,message:"Internal Server Error"});
    }
});
app.listen(8000);
module.exports=app;