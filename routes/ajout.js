var express = require('express');
var router = express.Router();
var model = require('../models/modelJson');



/* Home Page */
router.get('/', function (req, res, next) {

  res.render('ajout.pug')

});

/*Ajout d'une offre */ 
router.post('/ajouter', function (req, res) {

  var objetOffre = new model.Offre({
    nomEvenement: req.body.nomEvenement,
    typeEvenement: req.body.typeEvenement,
    dateDebut: req.body.dateDebut,
    nbJours: req.body.nbJours,
    role: req.body.role,
    nbFigurant: req.body.nbFigurant
  });
  objetOffre.save(function (err) {
    if (err) {
      res.send("Erreur d'ajout");
    }
    else {
      // Redirection 
      res.redirect("/offre");
    }
  });
});
module.exports = router;
