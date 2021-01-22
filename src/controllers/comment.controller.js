const Artist = require('../models/artist.model');
const Client = require('../models/client.model');
const Comment = require('../models/comment.model');

module.exports = {
  async list(req, res){
    try {
      const comments = await Comment.find().populate('clientAuthor', 'email').catch(err => {
        res.status(500).json(err)
      });
      res.status(200).json( { message: 'Comments found', data: comments } )
    } catch (err){
      res.status(400).json( { message: err.message } )
    };
  },
  async create(req, res){
    try {
      const clientId = req.userId
      const { artistId } = req.params
      const client = await Client.findById( clientId );
      const artist = await Artist.findById( artistId );
      if(!client){
        throw new Error( 'Invalid Client')
      }
      const comment = await Comment.create( { ...req.body, clientAuthor: client, artistDestination: artist } )
      client.notes.unshift( comment );
      artist.notes.unshift( comment );
      await client.save( { validateBeforeSave: false } );
      await artist.save ( { validateBeforeSave: false } );
      res.status(201).json( { message: 'Message Created', data: comment } )
    } catch(err){
      res.status(400).json( { message: err.message } )
    };
  },
  async update(req, res){
    try{
      const clientId = req.userId;
      const { commentId } = req.params;
      const searchcomment = await Comment.findById( commentId );  
      const clientAuthorId = searchcomment.clientAuthor.toString()     
      if( clientAuthorId === clientId){
        const comment = await Comment.findByIdAndUpdate( commentId, req.body, { new: true } );
        res.status(200).json( { message: 'Comment Updated', data: comment } );
      }else{
        throw new Error('Invalid Author')
      }      
    }catch(err){
      res.status(400).json( { message: err.message } )
    }
  },
  async destroy(req, res){
    try{
      const clientId = req.userId;
      const { commentId } = req.params;
      const searchcomment = await Comment.findById( commentId );  
      const clientAuthorId = searchcomment.clientAuthor.toString()     
      if( clientAuthorId === clientId){
        const comment = await Comment.findByIdAndDelete( commentId );
        res.status(200).json( { message: 'Comment Deleted', data: comment } );
      }else{
        throw new Error('Invalid Author')
      }                  
    }catch (err){
      res.status(400).json( { message: err.message } )
    }
  }
}