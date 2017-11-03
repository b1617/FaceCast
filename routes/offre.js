var express = require('express');
var router = express.Router();
var model = require('../models/modelJson');



// Recupération des offres
router.get('/', function (req, res, next) {
  model.Offre.find({}, function (err, offres) {
    if (err) throw err;
    res.render('offre', { offreList: offres });
  });
});

// Suppression d'une offre
router.get('/supprimer/:id', function (req, res, next) {

  model.Offre.findByIdAndRemove(req.params.id, function (err) {
    if (err) {
      console.log('erreur suppression ');
    }
    else {
      res.redirect('/offre');
    }
  });
});

// Récuperation des données d'une offre pour remplir le formulaire 
router.get('/update/:id', function (req, res, next) {
  model.Offre.findById(req.params.id, function (err, offre) {
    if (err) {
      console.log('erreur recup id');
      res.send("erreur");
    }
    else {
      res.render('update', { offreData: offre });
    }
  });
});


// Update d'une offre
router.post('/update/:id/check', function (req, res, next) {
  model.Offre.findByIdAndUpdate(req.params.id, {
    nomEvenement: req.body.nomEvenement,
    typeEvenement: req.body.typeEvenement,
    dateDebut: req.body.dateDebut,
    nbJours: req.body.nbJours,
    role: req.body.role,
    nbFigurant: req.body.nbFigurant
  }, function (err, doc) {
    if (err) {
      console.log('erreur ');
    }
    else {
      res.redirect('/offre');
      console.log(doc);
    }
  });
});


module.exports = router;

