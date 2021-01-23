const router = require('express').Router();
const artistController = require('../controllers/artist.controller')
const { auth } = require('../utils/auth')
const formData = require('../utils/formData')

router.route('/updatePassword').put(artistController.updatePassword);

router.route('/profile').get(auth, artistController.show);
router.route('/profile/:artistId').get(auth, artistController.showChosen);

router.route('/profile').put(auth, formData, artistController.update);
router.route('/:artistId').put(auth, artistController.hide);
router.route('/enable/:artistId').put(auth, artistController.enable);

router.route('/').get(artistController.list);
router.route('/').post(artistController.create);
router.route('/login').post(artistController.login);

router.route('/forgotPassword').post(artistController.resetEmail);
router.route('/reset/:resetPasswordToken').get(artistController.resetConfirm);



module.exports = router;
