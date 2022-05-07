const express = require('express');
const cors = require('cors');
require('dotenv').config();
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');

const port = process.env.PORT || 5000
const app = express();


//middlewire

app.use(cors());
app.use(express.json());



const uri = "mongodb+srv://pavelahmad:FYUMGoCarwC24jIZ@cluster0.nhqu8.mongodb.net/myFirstDatabase?retryWrites=true&w=majority";
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });


async function run(){

  try{

    await client.connect()
    const gearsCollection = client.db('fashion-style').collection('gear')
    
    app.get('/gear', async (req,res)=>{
      const query ={}
    const cursor = gearsCollection.find(query)
    const allGears = await cursor.toArray()
    res.send(allGears)
    })

    app.get('/gear/:id', async (req,res)=>{
      const id = req.params.id
      const query ={_id:ObjectId(id)}
    
      const singleGear = await gearsCollection.findOne(query)
      res.send(singleGear)
    })



  }
  finally{

  }

}

run().catch(console.dir)



app.get('/', (req, res) => {
  res.send('full-stack-11-server running')
});

app.listen(port, () => {
  console.log('listening', port);
});