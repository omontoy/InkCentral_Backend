const { create } = require('../models/payment.model')
const Payment = require('../models/payment.model')
const Artist = require('../models/artist.model')
const Client = require('../models/client.model')
const { list } = require('./artist.controller')

module.exports = {
  async create(req, res){
    try{
      const clientId = req.userId
      const { artistId } = req.params
      const client = await Client.findById( clientId )
      const artist = await Artist.findById( artistId )
      const payment = await Payment.create({...req.body, provider: artist, consumer: client } )
      client.payments.push( payment )
      artist.payments.push( payment )
      await client.save( { validateBeforeSave: false } )
      await artist.save( { validateBeforeSave: false } )
      res.status(201).json( { message: 'Payment Created', data: payment } )  
    }
    catch (err){
      res.status(400).json( { message: err.message } )
    }
  },
  async destroy(req, res){
    try{
      const { paymentId } = req.params;
      const payment =  await Payment.findByIdAndDelete( paymentId );
      if(!payment){
        throw new Error('Payment not found')
      }
      res.status(200).json( { message: 'Payment Deleted', data: payment })
    }
    catch (err){
      res.status(400).json( { message: err.message } )
    }
  }
}