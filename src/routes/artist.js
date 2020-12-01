const router = require('express').Router();
const artistController = require('../controllers/artist.controller')
const { auth } = require('../utils/auth')


router.route('/profile').get(auth, artistController.show);
router.route('/profile').put(auth, artistController.update);
router.route('/:artistId').delete(auth, artistController.destroy);

router.route('/').get(artistController.list);
router.route('/').post(artistController.create);
router.route('/login').post(artistController.login);



module.exports = router;
