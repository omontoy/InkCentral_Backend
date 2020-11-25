const router = require('express').Router();
const artistController = require('../controllers/artist.controller')

router.route('/').get(artistController.list);
router.route('/').post(artistController.create);
router.route('/login').post(artistController.login);
router.route('/:artistId').get(artistController.show);
router.route('/:artistId').put(artistController.update);
router.route('/:artistId').delete(artistController.destroy);



module.exports = router;


