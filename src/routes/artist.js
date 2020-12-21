const router = require('express').Router();
const artistController = require('../controllers/artist.controller')
const { auth } = require('../utils/auth')
const formData = require('../utils/formData')


router.route('/profile').get(auth, artistController.show);
router.route('/profile/:artistId').get(auth, artistController.showChosen);

router.route('/profile').put(auth, formData, artistController.update);
router.route('/:artistId').delete(auth, artistController.destroy);

router.route('/').get(artistController.list);
router.route('/').post(artistController.create);
router.route('/login').post(artistController.login);



module.exports = router;
