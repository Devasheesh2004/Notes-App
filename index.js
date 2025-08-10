const express = require('express');
const path = require('path');
const fs = require('fs')

const port = 3000;

const app = express();

app.set("view engine", "ejs");

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(express.static(path.join(__dirname,"public")));

app.get('/', (req,res) => {
    fs.readdir(`./tasks`,(err,files)=>{
        res.render("index",{files: files});
    })
});

app.post('/create', (req,res) => {
    fs.writeFile(`./tasks/${req.body.title.split(' ').join('')}.txt`,req.body.details,(err)=>{
        res.redirect("/")
    })
});

app.post('/delete', (req, res) => {
    fs.rm(`./tasks/${req.body.filename}`, (err) => {
        if (err) {
            console.error(err);
            return res.status(500).send("Error deleting file");
        }
        res.redirect("/");
    });
});


app.get('/file/:filename', (req,res) => {
    fs.readFile(`./tasks/${req.params.filename}`, "utf-8",(err,filedata)=>{
        res.render('show',{filename: req.params.filename, filedata: filedata})
    })
});


app.get('/edit/:filename', (req,res) => {
    res.render('edit',{filename:req.params.filename})
});

app.post('/editname', (req,res) => {
    fs.rename(`./tasks/${req.body.prevname}`,`./tasks/${req.body.newname}`,()=>{
        res.redirect('/')
    })
    
});

app.listen(port, () => {
    console.log(`App is listening at port ${port}`);
});