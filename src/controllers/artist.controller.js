const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const Artist = require('../models/artist.model')
const cryptoRandomString = require('crypto-random-string');

const { 
  transporter, 
  welcome, 
  updateConfirmation,
  hideConfirmation,
  enableConfirmation,
  sendArtistResetEmail
} = require('../utils/mailer');

module.exports = {

  async list(req, res){
    try{
      const { inputSearch } = req.query
      const querySearch = inputSearch ? {location: `${inputSearch}`, enable: true} : {enable: true}
      const artists = await Artist.find(querySearch)
                                  .select('-password')
                                  .populate( {  path: 'notes', select: 'note -_id' } )
                                  .populate( {  path: 'payments', 
                                                select: 'consumer amount service createdAt invoiceNumber',
                                                populate: {
                                                path: 'consumer',
                                                select:'name email'
                                                }
                                              }
                                            );
      res.status(200).json( { message: 'Artists found', data: artists } )
    }
    catch(err){
      res.status(404).json( { message: err.message } );
    }
  },
  async create(req, res){
    try {
      const { email, password, nickname, location, phone, name } = req.body;
      if(password.length < 4 || password.length > 8 ){
        throw new Error('Your password must be between 4 and 8 characters')
      }
      const encPassword = await bcrypt.hash(password, 8);
      const artist = await Artist.create({ email, password: encPassword, nickname, location, phone, name })

      const token = jwt.sign(
        { id: artist._id },
        process.env.SECRET,
        { expiresIn: 60 * 60 * 24 },
      );
      await transporter.sendMail(welcome(artist))
      res.status(201).json({ token });
    }
    catch(err){
      res.status(400).json( { message: err.message } )
    }
  },
  async login(req, res){
    try {
      const { email, password } = req.body;
      const artist = await Artist.findOne({ email });
      if(!artist){
        throw new Error('Invalid email or password')
      }
      const isValid = await bcrypt.compare(password, artist.password);

      if(!isValid){
        throw new Error('Invalid email or password')
      }
      const token = jwt.sign(
        { id: artist._id },
        process.env.SECRET,
        { expiresIn: 60 * 60 * 24 }
      );
      res.status(200).json( { token } )
    }
    catch(err){
      res.status(401).json( { message: err.message } )
    }
  },
  async show(req, res){
    try{
      const id  = req.userId;
      const artist = await Artist.findById(id)
                                 .select('-password')
                                 .populate( { path: 'notes', select: 'note -_id' } )
                                 .populate( { path: 'payments', 
                                              select: 'consumer amount service createdAt invoiceNumber schedule',
                                              populate: {
                                                path: 'consumer',
                                                select:'name email'
                                              }
                                            }
                                          );
      if(!artist){
        throw new Error('Artist Not Found')
      }
      res.status(200).json( { message: 'Artist Found', data: artist } )
    }
    catch(err){
      res.status(404).json( { message: err.message } )
    }
  },
  async showChosen(req, res){
    try{
      const { artistId } = req.params;
      const artist = await Artist.findById(artistId)
                                 .select('-password')
                                 .populate({ 
                                    path: 'notes', 
                                    select: '-artistDestination -__v -createdAt',
                                    populate: {
                                      path: 'clientAuthor',
                                      select: 'name email'
                                    } 
                                 })                                 
                                 .populate({
                                   path: 'payments',
                                   select: 'schedule'
                                 })                                
      if(!artist){
        throw new Error('Artist Not Found')
      }
      res.status(200).json( { message: 'Artist Found', data: artist } )
    }
    catch(err){
      res.status(404).json( { message: err.message } )
    }
  },
  
  async update(req, res){
    try {
      const id = req.userId;
      const artist = await Artist.findByIdAndUpdate( id, req.body, { new: true, runValidators: true } )
                                 .select('-password')
      if(!artist){
        throw new Error('Artist Not Found')
      }
      await transporter.sendMail(updateConfirmation(artist))
      res.status(200).json( { message: 'Artist Found', data: artist } )
    }
    catch(err){
      res.status(400).json( { message: err.message } )
    }
  },
  async hide(req, res){
    try {
      const { artistId } = req.params;
      const artist = await Artist.findByIdAndUpdate(
                                   artistId,
                                   req.body,
                                   { new: true, runValidators: true } )
                                 .select('-password');
      if(!artist){
        throw new Error('Artist Not Found')
      }
      await transporter.sendMail(hideConfirmation(artist.email))
      res.status(200).json( { message: 'Artist Hidden', data: artist } )
    }
    catch(err){
      res.status(400).json( { message: err.message } )
    }
  },
  async enable(req, res){
    try {
      const { artistId } = req.params;
      const artist = await Artist.findByIdAndUpdate(
                                   artistId,
                                   req.body,
                                   { new: true, runValidators: true } )
                                 .select('-password');
      if(!artist){
        throw new Error('Artist Not Found')
      }
      await transporter.sendMail(enableConfirmation(artist.email))
      res.status(200).json( { message: 'Artist Visible', data: artist } )
    }
    catch(err){
      res.status(400).json( { message: err.message } )
    }
  },
  async showPayments(req, res){
    try{
      const id  = req.userId;
      const artist = await Artist.findById(id)
                                 .select('-password')
                                 .populate( { path: 'payments', 
                                              select: 'consumer amount service -_id',
                                              populate: {
                                                path: 'consumer',
                                                select: 'name email'
                                              } 
                                            } 
                                          );
      if(!artist){
        throw new Error('Artist Not Found')
      }
      res.status(200).json( { message: 'Artist Found', data: artist } )
    }
    catch(err){
      res.status(404).json( { message: err.message } )
    }
  },
  async resetEmail(req, res){
    if(req.body.email === ''){
      res.status(400).send('email required')
    }
    try{
      const token = cryptoRandomString({length: 10});
      const artist = await Artist.findOneAndUpdate( 
        { email: req.body.email }, 
        { resetPasswordToken: token }
      )
      if(!artist){
        throw new Error('email not found in database')
      }
      else {
        await transporter.sendMail(sendArtistResetEmail(artist, token));
        res.status(200).json('recovery email sent')
      }

    }
    catch (err){
      res.status(400).json({ message: err.message } )
    }
    
  },
  async resetConfirm(req, res){
    try{
      const { resetPasswordToken } = req.params;
      const artist = await Artist.findOne( { resetPasswordToken } )
      if(!artist){
        throw new Error('password reset is invalid or has expired');
      }
      res.status(200).json({ message: 'password reset link ok',  data: artist.email })

    }
    catch (err) {
      res.status(400).json({ message: err.message })
    }
  },
  async updatePassword(req,res){
    const { email, password } = req.body;
    try {
      if(password.length < 4 || password.length > 8){
        throw new Error( 'Your password must be between 4 and 8 characters' )
      }
      const artist = await Artist.findOne( { email })                           
      if( !artist ){
        throw new Error( 'Invalid Email' )
      } 
      else {
        const encPassword = await bcrypt.hash(password, 8);
        const updatedArtist = await artist.update({
          password: encPassword,
          resetPasswordToken: null,
        })
      }
      
      res.status(200).json( { message: 'Password Updated' } );
    }
    catch (err) {
      res.status(400).json( { message: err.message } )
    }
  }

}
