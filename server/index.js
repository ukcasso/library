'use strict';
const express = require('express');
const app = express();
const { Sequelize, DataTypes } = require('sequelize');
const env = process.env.NODE_ENV || 'development';
const config = {
  "development": {
    "username": "root",
    "password": ****,
    "database": "library",
    "host": "127.0.0.1",
    "dialect": "mysql"
  },
  "test": {
    "username": "root",
    "password": null,
    "database": "database_test",
    "host": "127.0.0.1",
    "dialect": "mysql"
  },
  "production": {
    "username": "root",
    "password": null,
    "database": "database_production",
    "host": "127.0.0.1",
    "dialect": "mysql"
  }
}[env];

let cors = require('cors')
let http = require('http');
let bodyParser = require('body-parser');
let sequelize;
if (config.use_env_variable) {
  sequelize = new Sequelize(process.env[config.use_env_variable], config);
} else {
  sequelize = new Sequelize(config.database, config.username, config.password, config);
}

const books = sequelize.define('books', {
  title: {
    type: DataTypes.STRING(200),
    allowNull: true,
  },
  content: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  author: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  date: {
    type: DataTypes.STRING,
    allowNull: true,
  }
});


sequelize.sync({ force: false }).then( () => {
  console.log("DB connection is successful");
  
}).catch(err => {
  console.log("DB connection faild");
  console.log(err);
});


app.use(cors())
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended : false}));

app.get('/get', async(req, res) => { 
  await books.findAll().then(result => {
    res.json(result)
  });
});

app.post('/inputBook', async (req, res) => {
  await books.create({
    title : req.body.title,
    content : req.body.content,
    author : req.body.author,
    date : req.body.date
  }).then(result => {
    console.log("Success input data" + result);
    res.redirect('/');
  }).catch(err => {
    console.log("Fail update data" + err);
  });
});

app.post('/edit/:id', async(req, res) => {
  await books.update({
    title : req.body.title,
    content : req.body.content,
    author : req.body.author,
    date : req.body.date
  }, {
    where : {id: req.params.id}
  }).then(result => {
    console.log("Success update data" + result);
    res.redirect('/');
  }).catch(err => {
    console.log("Fail update data" + err)
  })
})

app.delete('/delete/:id', async(req, res) => {
  await books.destroy({
    where: {id: req.params.id}
  }).then(result => {
    console.log(result)
    res.redirect('/');
  }).catch(err => {
    console.log("Fail delete data" + err);
  });
});

http.createServer(app).listen(3000, () => {'Server is running on port 3000...'})
