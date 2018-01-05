var express = require('express');
var router = express.Router();
var model = require('../models/modelJson');

/* GET home page. */
router.get('/', function (req, res, next) {
  model.Candidature.aggregate([
    {
      $lookup: {
        from: "offreCollection",
        localField: "idOffre",
        foreignField: "_id",
        as: "offre"
      }
    },
    {
      $lookup: {
        from: "figurantCollection",
        localField: "apiKey",
        foreignField: "apiKey",
        as: "figurant"
      }
    }
  ]).exec(function (err, candidature) {
    if (err) throw err;
   res.render('candidature', { candidatureList: candidature });
   // res.json(candidature)
  });
});


// Update candidature
router.post('/update/:id', function (req, res, next) {
  model.Candidature.findByIdAndUpdate(req.params.id, {
    statut: req.body.statut
  }, function (err, doc) {
    if (err) {
      console.log('erreur ');
    }
    else {
      res.redirect('/candidature');
      console.log(doc);
    }
  });
});


module.exports = router;
