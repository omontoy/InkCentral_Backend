const router = require('express').Router();
const clientController = require('../controllers/client.controller')
const { auth } = require('../utils/auth')

router.route('/').get(clientController.list);
router.route('/:clientId').get(auth, clientController.show);

router.route('/').post(clientController.create);
router.route('/login').post(clientController.login);

router.route('/:clientId').put(auth, clientController.update);
router.route('/:clientId').delete(auth, clientController.destroy);

module.exports = router;