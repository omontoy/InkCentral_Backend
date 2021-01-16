const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const Client = require('../models/client.model');
const { transporter, welcome, updateConfirmation } = require('../utils/mailer');

module.exports = {
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
      await transporter.sendMail(welcome(client))
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
      const id  = req.userId;
      const client = await Client.findById( id )
                                 .select('-password')
                                 .populate( { path: 'notes', select: 'note -_id' } )
                                 .populate( { path: 'payments',                                               
                                              select: 'provider amount service createdAt invoiceNumber',
                                              populate: {
                                                path: 'provider',
                                                select: 'name email'
                                              } 
                                            } 
                                          )
      if( !client ){
        throw new Error( 'Client Not Found' )
      }
      res.status(200).json( { message: "Client Found", data: client } );
    }
    catch (err){
      res.status(400).json( { message: err.message } )
    }
  },
  async update(req, res){
    try {
      const id = req.userId;
      const client = await Client.findByIdAndUpdate(
                                        id, req.body,
                                        { new: true, runValidators: true})
                                        .select('-password');
      if( !client ){
        throw new Error( 'Invalid ID' )
      }
      res.status(200).json( { message: 'Client Updated', data: client} );
      await transporter.sendMail(updateConfirmation(client))

    }
    catch (err) {
      res.status(400).json( { message: err.message } )
    }
  },
  async destroy(req, res){
    try{
      const id = req.userId;
      const client = await Client.findByIdAndDelete( id ).select('-password');
      if( !client ){
        throw new Error( 'Invalid ID' )
      }
    }
    catch (err){
      res.status(400).json( { message: err.message } )
    }
  }
}
