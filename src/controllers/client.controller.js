const bcrypt = require('bcrypt');
const Client = require('../models/client.models');

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
  show(req, res){
    const { clientId } = req.params;
    Client
      .findById( clientId )
      .then( client => {
          res.status(200).json({ message: 'Client found', data: client })
      })
      .catch(err => {
          res.status(404).json({ message: 'Client Not Found' })
      });
  }, 
  update(req, res){
    const { clientId } = req.params;
    Client
      .findByIdAndUpdate( clientId, req.body, { new: true })
      .then ( client => {
          res.status(200).json({ message: 'Client updated', data: client})
      })
      .catch( err => {
          res.status(400).json({ message: 'Client could not be update'})
      });            
  },
  destroy(req, res){
    const { clientId } = req.params;
    Client
      .findByIdAndDelete(clientId)
      .then( client => {
          res.status(200).json({ message: 'Client Deleted', data: client })
      })
      .catch( err => {
          res.status(400).json({ message: 'Client could not be delete'})
      });
  }
}