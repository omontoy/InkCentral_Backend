const router = require('express').Router();
const commentController = require('../controllers/comment.controller')

router.route('/').get(commentController.list);
router.route('/').post(commentController.create);
router.route('/:commentId').get(commentController.show);

module.exports = router;
