const router = require('express').Router();
const clientController = require('../controllers/client.controller')
const { auth } = require('../utils/auth')

router.route('/:profile').get(auth, clientController.show);
router.route('/profile').put(auth, clientController.update);
router.route('/:clientId').delete(auth, clientController.destroy);

router.route('/').post(clientController.create);
router.route('/login').post(clientController.login);
router.route('/forgotPassword').post(clientController.resetEmail);


module.exports = router;
