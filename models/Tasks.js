const mongoose= require('mongoose');
const { model } = require('mongoose');
const { Schema } = mongoose;

const Task = new Schema({
  user:{
    type: mongoose.Schema.Types.ObjectId,
    ref:'user'
  },
  title: {
    type:String,
    required:true
  },
  description: {
    type:String
  },
  priority: {
    type:String,
    required:true,
    default: 'Medium'
  },
  status: {
    type:String,
    required:true,
    default: 'In Progress'
  },
  date: {
    type:Date,
    default:Date.now
  },
});

const Tasks = mongoose.model('tasks',Task);

module.exports =  Tasks;