const express = require('express');
const { Sequelize, DataTypes } = require('sequelize');
const path = require('path');

const app = express();
const port = 3000;

app.use(express.static('public'));
app.use(express.urlencoded({ extended: false }));

const sequelize = new Sequelize('postgres://postgres:123@localhost:5432/photocenter');

const Records = sequelize.define('Records', {
  FIO: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  phone: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  date: {
    type: DataTypes.DATE,
    allowNull: false
  },
  time: {
    type: DataTypes.TIME,
    allowNull: false
  }
});

app.get('/', (req, res) => {
  res.sendFile('./index.html', {
    root: path.join(__dirname, './')
  })
})

app.get('/record', (req, res) => {
  res.sendFile('./record.html', {
    root: path.join(__dirname, './')
  })
})

app.post('/record', async(req, res) => {
  try {
    await sequelize.authenticate();
    console.log('Connection has been established successfully.');
  } catch (error) {
    console.error('Unable to connect to the database:', error);
  }
  const records = new Records();
  records.FIO = req.body.name;
  records.phone = req.body.phone;
  records.date = req.body.date;
  records.time = req.body.time;
  await records.save();
  res.redirect('/record')
})

Records.sync();

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});