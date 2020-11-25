const bcrypt = require('bcrypt');
const Client = require('../models/client.model');

module.exports = {
  async create(req, res){
    try {
      const { email, password } = req.body;
      const encPassword = await bcrypt.hash(password, 8);
      const client = await Client.create( { email, password: encPassword })
      res.status(201).json({ message: 'Client Created', data: client })
    } catch (err){
      res.status(400).json(err.errors.email.message)
    };
  },
  async show(req, res){
    try{
      const { clientId } = req.params;
      const client = await Client.findById( clientId );
      if( !client ){
        throw new Error( 'Invalid ID' )
      }
      res.status(200).json( {message: "Encontrado", data: client} );      
    } catch (err){
      res.status(400).json( err.message );
    }
  }, 
  async update(req, res){
    try {
      const { clientId } = req.params;
      const client = await Client.findByIdAndUpdate( clientId, req.body, { new: true, runValidators: true});
      if( !client ){
        throw new Error( 'Invalid ID' )
      }
      res.status(200).json( { message: 'Client updated', data: client} );  
    } catch (err) {
      res.status(400).json( err.message )
    }
  },
  async destroy(req, res){
    try{
      const { clientId } = req.params;
      const client = await Client.findByIdAndDelete( clientId );
      if( !client ){
        throw new Error( 'Invalid ID' )
      }
    } catch (err){
      res.status(400).json( err.message )
    }                    
  }
}