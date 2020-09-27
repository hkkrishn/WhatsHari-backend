//Author:Harikrishnan Kuppusamykrishnan
//Project: Whats App Clone backend
//Date: 08/06/2020
//Description: Main Server.js file to handle backend interaction for whatsapp clone

//list of operations
//importing
//app config
//middleware
//DB config
//?????
//api routes
//listener

//importing
import express from "express";
import mongoose from "mongoose"
import {Messages} from './dbMessages.js'
import Pusher from 'pusher'
import Cors from 'cors';

//app config
//create application instance
const app = express();
const port = process.env.PORT ||9000

var pusher = new Pusher({
    appId: '1080648',
    key: 'f398c384f42b94255ef9',
    secret: '5828850d3ed1ea41fbfa',
    cluster: 'us3',
    encrypted: true
  });








//middlewarre
app.use(express.json())
app.use(Cors())

//DBconfig
const connectionUrl = ('mongodb+srv://hari:Hophop12@cluster0.hut1u.mongodb.net/whatsharidb?retryWrites=true&w=majority')
//?????
mongoose.connect(connectionUrl,{
    //this stuff helps mongoose works
    useCreateIndex:true,
    useNewUrlParser:true, // parses the url
    useUnifiedTopology:true
})
const db = mongoose.connection;
db.once('open',()=>{
    console.log('DB conncected')
  const msgCollection = db.collection("messagecontents");
  const changeStream =  msgCollection.watch()
    changeStream.on('change',(change)=>{
        console.log('Inside pusher')
      console.log(change)
      if(change.operationType === "insert"){
          console.log(change.fullDocument)
          const messageDetails = change.fullDocument;

          pusher.trigger("messages","inserted",{
              name:messageDetails.name,
              message:messageDetails.message,
              timeStamp:messageDetails.timeStamp
          });
      } else{
          console.log('Error triggering pusher')
      }
    });
  });


//api routes
app.get('/api/v1/messages/sync',(req,res)=>{
    Messages.find((err,data)=>{
        if(err){
            res.status(500).send(err)
        }else{
            res.status(200).send(data)
        }
    })
})

app.post('/api/v1/messages/new',(req,res)=>{
    express.json()
    const dbMessage =req.body
    Messages.create(dbMessage,(err,data)=>{

        if(err){
            res.status(500).send(err)
        }else{
            console.log(data)
            res.status(201).send(data)

        }
    })
})

//listener

app.listen(port,()=>{
    console.log(`listening on localhost:${port}`)
})


