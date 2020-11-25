const router = require('express').Router();
const clientController = require('../controllers/client.controller')

router.route('/').post(clientController.create);
router.route('/:clientId').put(clientController.update);
router.route('/:clientId').delete(clientController.destroy);

module.exports = router;