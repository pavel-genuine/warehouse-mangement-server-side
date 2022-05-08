const express = require('express');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const secretTicket ='shhh'
require('dotenv').config();
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');

const port = process.env.PORT || 5000
const app = express();


//middlewire

app.use(cors());
app.use(express.json());


function verifyJWT(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader) {
      return res.status(401).send({ message: 'unauthorized access' });
  }
  const token = authHeader.split(' ')[1];
  jwt.verify(token,secretTicket, (err, decoded) => {
      if (err) {
          return res.status(403).send({ message: 'Forbidden access' });
      }
      console.log('decoded', decoded);
      req.decoded = decoded;
      next();
  })
}

const uri = `mongodb+srv://pavelahmad:FYUMGoCarwC24jIZ@cluster0.nhqu8.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });


async function run(){

  try{

    await client.connect()
    const gadgetsCollection = client.db('GadgetArena').collection('Gadget')

    app.post('/sign-in', async (req, res) => {
      const user = req.body;
      const accessToken = jwt.sign(user,secretTicket, {
          expiresIn: '1d'
      });
      res.send({ accessToken });
  })
    
    app.get('/inventory', async (req,res)=>{
      const query ={}
    const cursor = gadgetsCollection.find(query)
    const allGadgets = await cursor.toArray()
    console.log(process.env);
    res.send(allGadgets)
    })

    app.get('/inventory/:id', async (req,res)=>{
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

    app.delete('/inventory/:id', async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectId(id)};
      const result = await gadgetsCollection.deleteOne(query);
      res.send(result);
  })

  app.put('/inventory/:id', async(req, res) =>{
    const id = req.params.id;
    const gadget = req.body;
    const filter = {_id: ObjectId(id)};
    const options = { upsert: true };
    const updatedDoc = {
        $set: {
          quantity: gadget.quantity,
        }
    };
    const result = await gadgetsCollection.updateOne(filter, updatedDoc, options);
    res.send(result);
  
  })


  app.get('/user-items', verifyJWT, async (req, res) => {
    const decodedEmail = req.decoded.email;
    const email = req.query.email;
    if (email === decodedEmail) {
        const query = { email: email };
        const cursor = gadgetsCollection.find(query);
        const result = await cursor.toArray();
        res.send(result);
    }
    else{
        res.status(403).send({message: 'forbidden access'})
    }
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