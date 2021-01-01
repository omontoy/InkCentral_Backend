const router = require('express').Router();
const paymentController = require('../controllers/payment.controller')
const  { auth } = require('../utils/auth')

router.route('/:artistId').post(auth, paymentController.create);
router.route('/:paymentId').delete(paymentController.destroy);

module.exports = router;