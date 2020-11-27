const router = require('express').Router();
const artistController = require('../controllers/artist.controller')
const { auth } = require('../utils/auth')

router.route('/').get(auth, artistController.list);
router.route('/:artistId').get(auth, artistController.show);

router.route('/').post(artistController.create);
router.route('/login').post(artistController.login);
router.route('/:artistId').put(artistController.update);
router.route('/:artistId').delete(artistController.destroy);



module.exports = router;


