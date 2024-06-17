const express=require("express")
const path=require("path");
const app=express();
const mongoose = require("mongoose"); 
const bodyparser=require("body-parser");

//database connection
mongoose
  .connect("mongodb://localhost/contactDance", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.error("Failed to connect to MongoDB", err));

const port=8000;

//defind mongoose schema
const contactSchema = new mongoose.Schema({
    name: String,
    phone: String,
    email: String,
    address: String,
    desc: String
  });
  const Contact = mongoose.model('Contact',contactSchema);

//Express Specific stuff
app.use('/static',express.static('static'))//for serving static file
app.use(express.urlencoded())
// app.use(bodyParser.urlencoded({ extended: true })); // Parse URL-encoded bodies

//pug specific stuff
app.set('view engine', 'pug')//set the template engine as pug
app.set('views',path.join(__dirname,'views'))//set the views directory

//endpoints
app.get('/',(req,res)=>{
    const params={}
    res.status(200).render('home.pug',params);
})

app.get('/contact',(req,res)=>{
    const params={}
    res.status(200).render('contact.pug',params);
})

app.post('/contact',(req,res)=>{
    // const params={}
    var myData=new Contact(req.body);
    myData.save().then(()=>{
        res.send("this items has been saved to the database")
    }).catch(()=>{
        res.status(400).send("Item was not saved to the database")
    });
    // res.status(200).render('contact.pug');
});

//start the server
app.listen(port,()=>{
    console.log(`The application started successfully on port ${port}`)
})

