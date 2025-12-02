const dotenv = require('dotenv');
dotenv.config(); 
const {connect} = require('mongoose');

const connectMongo = async ()=>{
    try{
        await connect(process.env.MONGODB_URI);
        console.log('MongoDB Connected Sucessfully.')
    }
    catch(err){
        console.error(err);
    }
} 

module.exports = connectMongo;