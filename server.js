const express=require('express');
const app=express();
const bodyParser=require('body-parser');
const MongoClient=require('mongodb').MongoClient;
var db;
var s;
MongoClient.connect('mongodb://localhost:27017/Inventorydetails', (err,database) =>
{
    if(err) return console.log(err)
    db=database.db('Inventorydetails')
    app.listen(3201, ()=>{
        console.log('Listening on port 3201')
    })
})

app.set('view engine','ejs')
app.use(bodyParser.urlencoded({extended: true}))
app.use(bodyParser.json())
app.use(express.static('public'))

app.get('/',(req,res) =>{
    db.collection('icecream').find().toArray((err,result)=>{
        if(err) return console.log(err)
    res.render('home.ejs', {data:result})
    })     
})


app.get('/create', (req,res)=>{
    res.render('add.ejs')
})

app.get('/updateitems', (req,res)=>{
    res.render('update.ejs')
})

app.get('/deleteitems', (req,res)=>{
    res.render('delete.ejs')
})

app.post('/adddata',(req,res)=>{
    db.collection('icecream').save(req.body,(err,result)=>{
        if(err) return console.log(err)
    res.redirect('/')
    })
})

app.post('/update',(req,res)=>{
   db.collection('icecream').find().toArray((err,result)=>{
       if(err)
         return console.log(err)
       for(var i=0;i<result.length;i++)
       {
           if(result[i].p_id==req.body.id)
           {
               s=result[i].stock
               break
           }
       }
       db.collection('icecream').findOneAndUpdate({p_id: req.body.id},{
        $set:{stock:parseInt(s)+parseInt(req.body.stock)}}, {sort:{_id:-1}},
        (err,result)=>{
            if(err)
                return res.send(err)
            console.log(req.body.id+'stock is updated')
            res.redirect('/')
        })
       //)
   })
})

app.post('/delete',(req,res)=>{
    db.collection('icecream').findOneAndDelete({p_id :req.body.id}, (err,result)=>{
        if(err) 
          return console.log(err)
        res.redirect('/')
    })
})

