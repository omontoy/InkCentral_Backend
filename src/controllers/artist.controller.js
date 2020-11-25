const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const Artist = require('../models/artist.model')

module.exports = {
  list(req, res){
    Artist
      .find()
      .then(artists => {
        res.status(200).json({ message: 'Artists Found', data: artists })
      })
      .catch(err => {
        res.status(404).json({ message: 'Artists not Found' })
      });
  },
  async create(req, res){
    try {
      const { email, password, nickname, location, phone, name } = req.body;
      const encPassword = await bcrypt.hash(password, 8);
      const artist = await Artist.create({ email, password: encPassword, nickname, location, phone, name })

      res.status(201).json({ message: 'Artist Created', data: artist })
    } catch (err){
      res.status(400).json(err.errors.email.message)   
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
      res.status(200).json({ token })
    } catch(err){
      res.status(401).json({ message: err.message })
    }
    
  },
  show(req, res){
    const { artistId } = req.params;

    Artist
      .findById(artistId)
      .then( artist => {
        res.status(200).json({ message: 'Artist found', data: artist })
      })
      .catch(err => {
        res.status(404).json({ message: 'Artist Not Found'})
      })

  },
  update(req, res){
    const { artistId } = req.params;
    Artist
      .findByIdAndUpdate( artistId, req.body, { new: true } )
      .then(artist => {
        res.status(200).json({ message: 'Artist Updated', data: artist })
      })
      .catch(err => {
        res.status(400).json({ message: 'Aritst could not be updated '})
      });
  },
  destroy(req, res){
    const { artistId } = req.params;
    Artist
      .findByIdAndDelete(artistId)
      .then(artist => {
        res.status(200).json({ message: 'Artist Deleted', data: artist })
      })
      .catch(err => {
        res.status(400).json({ message: 'Artist could not be deleted'})
      });
  }
}