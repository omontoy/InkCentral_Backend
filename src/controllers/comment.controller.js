const { json } = require('express');
const jwt = require('jsonwebtoken');
const { create, update } = require('../models/comment.model');
const Comment = require('../models/comment.model');
const { show } = require('./artist.controller');

module.exports = {
  async list(req, res){
    try {
      const comments = await Comment.find();
      res.status(200).json( { message: 'Comments found', data: comments } )
    } catch (err){
      res.status(400).json( { message: err.message } )
    };
  },
  async create(req, res){
    try {
      const { mensaje, artistid, clientid } = req.body
      const comment = await Comment.create( { mensaje, artistid, clientid, new: true, published: Date.now() } )
      res.status(201).json( { message: 'Message Created', data: comment } )
    } catch(err){
      res.status(400).json( { message: err.message } )
    };
  },
  async show(req, res){
    try{
      const { commentId } = req.params;
      const comment = await Comment.findById( commentId );
      res.status(200).json( { message: 'Comment found', data: comment } );
    } catch(err){
      res.status(400).json ( { message: err.message } )
    }
  },
  async update(req, res){
    try{
      const { commentId } = req.params;
      const comment = await Comment.findByIdAndUpdate( commentId, req.body, { new: true } );
      res.status(200).json( { message: 'Comment Updated', data: comment } );
    }catch(err){
      res.status(400).json( { message: err.message } )
    }
  },
  async destroy(req, res){
    try{
      const { commentId } = req.params;
      const comment = await Comment.findByIdAndDelete( commentId );
    }catch (err){
      res.status(400).json( { message: err.message } )
    }
  }
}

