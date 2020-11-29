const router = require('express').Router();
const artistController = require('../controllers/artist.controller')
const { auth } = require('../utils/auth')

router.route('/').get(artistController.list);
router.route('/:artistId').get(auth, artistController.show);

router.route('/').post(artistController.create);
router.route('/login').post(artistController.login);

router.route('/:artistId').put(auth, artistController.update);
router.route('/:artistId').delete(auth, artistController.destroy);



module.exports = router;


