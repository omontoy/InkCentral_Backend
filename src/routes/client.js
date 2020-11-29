const router = require('express').Router();
const clientController = require('../controllers/client.controller')
const { auth } = require('../utils/auth')

router.route('/:clientId').get(auth, clientController.show);
router.route('/').put(auth, clientController.update);
router.route('/:clientId').delete(auth, clientController.destroy);

router.route('/').get(clientController.list);
router.route('/').post(clientController.create);
router.route('/login').post(clientController.login);




module.exports = router;