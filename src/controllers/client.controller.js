const bcrypt = require('bcrypt');
const  jwt = require('jsonwebtoken');
const Client = require('../models/client.model');

module.exports = {
  async list(req, res){
    try {
      const clients = await Client.find();
      res.status(200).json( { message: 'Clients found', data: clients } )
    } 
    catch (err){
      res.status(400).json( { message: err.message } )
    };
  },
  async create(req, res){
    try {
      const { email, password } = req.body;
      if(password.length < 4 || password.length > 8){
        throw new Error( 'Your password must be between 4 and 8 characters' )
      }
      const encPassword = await bcrypt.hash(password, 8);
      const client = await Client.create( { email, password: encPassword } )
      
      const token = jwt.sign(
        { id: client._id },
        process.env.SECRET,
        { expiresIn: 60 * 60 * 24 }
      );
      res.status(201).json( { token } );
    } 
    catch (err){
      res.status(400).json( { message: err.message } )
    };
  },
  async login(req, res){
    try{
      const { email, password } = req.body;
      const client = await Client.findOne({ email });
      if( !client ){
        throw new Error( 'Invalid email or password' )
      }
      const isValid = await bcrypt.compare(password, client.password);
      if( !isValid ){
        throw new Error( 'Invalid email or password' )
      }
      const token = jwt.sign(
        { id: client._id },
        process.env.SECRET,
        { expiresIn: 60 * 60 * 24 }
      )
      res.status(200).json( { token } )
    } 
    catch (err){
      res.status(400).json( { message: err.message } )
    };
  },
  async show(req, res){
    try{
      const { clientId } = req.params;
      const client = await Client.findById( clientId );
      if( !client ){
        throw new Error( 'Invalid ID' )
      }
      res.status(200).json( { message: "Client Found", data: client } );      
    } 
    catch (err){
      res.status(400).json( { message: err.message } )
    }
  }, 
  async update(req, res){
    try {
      const { clientId } = req.params;
      const client = await Client.findByIdAndUpdate( clientId, req.body, { new: true, runValidators: true});
      if( !client ){
        throw new Error( 'Invalid ID' )
      }
      res.status(200).json( { message: 'Client Updated', data: client} );  
    } 
    catch (err) {
      res.status(400).json( { message: err.message } )
    }
  },
  async destroy(req, res){
    try{
      const { clientId } = req.params;
      const client = await Client.findByIdAndDelete( clientId );
      if( !client ){
        throw new Error( 'Invalid ID' )
      }
    } 
    catch (err){
      res.status(400).json( { message: err.message } )
    }                    
  }
}