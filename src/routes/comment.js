const router = require('express').Router();
const commentController = require('../controllers/comment.controller')
//const { auth } = require('../utils/auth')

router.route('/').get(commentController.list);
router.route('/:clientId').post(commentController.create);

router.route('/:commentId').get(commentController.show);/*
router.route('/:commentId').put(auth, commentController.update);
router.route('/:commentId').delete(auth, commentController.destroy);*/

module.exports = router;
