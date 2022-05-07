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
    const gadgetsCollection = client.db('GadgetArena').collection('Gadget')
    
    app.get('/inventory', async (req,res)=>{
      const query ={}
    const cursor = gadgetsCollection.find(query)
    const allGadgets = await cursor.toArray()
    res.send(allGadgets)
    })

    app.get('/inventoy/:id', async (req,res)=>{
      const id = req.params.id
      const query ={_id:ObjectId(id)}
    
      const singleGadget = await gadgetsCollection.findOne(query)
      res.send(singleGadget)
    })

    app.post('/inventory', async (req,res)=>{
      const newGadget = req.body;
      const result = await gadgetsCollection.insertOne(newGadget);
      res.send(result)
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