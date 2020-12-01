const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const Artist = require('../models/artist.model')

module.exports = {

  async list(req, res){
    try{
      const artists = await Artist.find().select('-password');
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
      const artist = await Artist.findById(id).select('-password')
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
      const artist = await Artist.findByIdAndUpdate( id, req.body, { new: true, runValidators: true } ).select('-password')
      if(!artist){
        throw new Error('Artist Not Found')
      }
      res.status(200).json( { message: 'Artist Found', data: artist } )
    }
    catch(err){
      res.status(400).json( { message: err.message } )
    }
  },
  async destroy(req, res){
    try {
      const { artistId } = req.params;
      const artist = await Artist.findByIdAndDelete(artistId).select('-password');
      if(!artist){
        throw new Error('Artist Not Found')
      }
      res.status(200).json( { message: 'Artist Deleted', data: artist } )
    }
    catch(err){
      res.status(400).json( { message: err.message } )
    }
  }
}
