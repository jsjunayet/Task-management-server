const express = require('express')
require('dotenv').config()
const app = express()
const cors = require('cors')
const { MongoClient, ServerApiVersion,ObjectId } = require('mongodb');
const port = process.env.PORT || 5000;

app.use(cors())
app.use(express.json())




const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.l4anbhy.mongodb.net/?retryWrites=true&w=majority`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    // await client.connect();
    const userCollection = client.db('TaskMangement').collection('users')
    const userTask = client.db('TaskMangement').collection('tasks')


    app.post('/users',async(req,res)=>{
        const user = req.body
        console.log(user);
        const query = {email: user.email}
        const isexist = await userCollection.findOne(query)
        if(isexist)
        {
          return res.send({message: 'user already exists', insertedId:null})
        }
        const result = await userCollection.insertOne(user)
        res.send(result)
      })

      app.get('/tasks', async (req, res) => {
        const email = req.query.email
        const query = {email:email}
          const result = await userTask.find(query).toArray();
          res.send(result) 
      });
      app.get('/alltasks', async (req, res) => {
          const result = await userTask.find().toArray();
          console.log(result);
          res.send(result) 
      });
      app.get('/users', async (req, res) => {
        const email= req.query.email
        const query = {email:email}
          const result = await userCollection.findOne(query)
          res.send(result) 
      });
      
      app.post('/tasks', async (req, res) => {
          const newTask = req.body;
          const result = await userTask.insertOne(newTask);
          const savedTask = await userTask.findOne({ _id: result.insertedId });
          res.send(savedTask);
      
      });
      app.put('/update/:id', async(req,res)=>{
        const item = req.body;
        const id = req.params.id;
        const query = {_id : new ObjectId(id)}
        const updateDoc={
          $set:{
            title:item.title,
            description:item.description,
            deadline:item.deadline,
            priority:item.priority
          }
        }
        console.log(updateDoc);
        const result = await userTask.updateOne(query,updateDoc)
        res.send(result)
      })
      
      app.patch('/tasks/:id', async (req, res) => {
      
          const taskId = new ObjectId(req.params.id);
          const updatedTask = await userTask.findOneAndUpdate(
            { _id: taskId },
            { $set: req.body },
            { returnDocument: 'after' }
          );
          res.send(updatedTask.value);
       
      });
      
      app.delete('/tasks/:id', async (req, res) => {
          const taskId = new ObjectId(req.params.id);
          const deletedTask = await userTask.findOneAndDelete({ _id: taskId });
          res.send(deletedTask.value);
      });
      app.get('/tasks/:id', async (req, res) => {
          const id = req.params.id
          const query = {_id : new ObjectId(id)}
          const result = await userTask.findOne(query)
          res.send(result);
      });



    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
   
  }
}
run().catch(console.dir);



app.get('/', (req, res) => {
    res.send('Hello World!')
  })
  
  app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
  })