const express = require('express');
const router = express.Router();

router.get('/', handleLogout);
router.post('/', handleLogout);

function handleLogout(req, res) {
  req.session.destroy((err) => {
    if (err) {
      return res.status(500).send('Could not log out. Try again later.');
    }
    res.redirect('/');
  });
}


module.exports = router;
