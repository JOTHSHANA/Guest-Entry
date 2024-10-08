const express = require('express');
const router = express.Router();
const { createGuest, updateGuest, getCompletedGuests, getDraftGuests, getGuest } = require("../controllers/formDetailsController")

router.post('/createGuest', createGuest);
router.post('/updateGuest', updateGuest);
router.get('/getCompletedGuests', getCompletedGuests);
router.get('/getDraftGuests', getDraftGuests);
router.get('/guest', getGuest);

module.exports = router;
