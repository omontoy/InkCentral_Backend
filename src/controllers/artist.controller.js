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
  create(req, res){
    const data = req.body;
    
    Artist
      .create(data)
      .then(artist => {
        res.status(201).json({ message: 'Artist Created', data: artist })
      })
      .catch(err => {
        res.status(400).json({ message: 'Artist could not be created' })
      });
  
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