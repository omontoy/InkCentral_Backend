const router = require('express').Router();
const commentController = require('../controllers/comment.controller')
const { auth } = require('../utils/auth')

router.route('/').get(auth, commentController.list);
router.route('/:artistId').post(auth, commentController.create);

router.route('/:commentId').put(auth, commentController.update);
router.route('/:commentId').delete(auth, commentController.destroy);

module.exports = router;
