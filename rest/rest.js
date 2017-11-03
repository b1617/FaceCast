var express = require('express');
var router = express.Router();
var path = require('path');
var fs = require('fs');
var model = require('../models/modelJson');
var objectId = require('mongoose').Types.ObjectId;

router.get('/', function (req, res, next) {
    res.send('Hi Rest , Try : /offre or  /figurant or /candidature');
});


// Offre
router.get('/offre', function (req, res, next) {
    model.Offre.find({}, function (err, offres) {
        if (err) throw err;
        res.json(offres);
    });
});
router.get('/offre/:nb', function (req, res, next) {

    model.Offre.find({}, function (err, offres) {
        if (err) throw err;
        if (req.params.nb == 0) {
            res.json(offres[0]);
        }
        else {
            res.json(offres.splice(0, req.params.nb));
        }
    });
});

// Figurant
router.get('/figurant', function (req, res, next) {
    model.Figurant.find({}, function (err, figurants) {
        if (err) throw err;
        res.json(figurants);
    });
});

// inscription 
router.post('/figurant', function (req, res, next) {
    var figurant = new model.Figurant({
        nom: req.body.nom,
        prenom: req.body.prenom,
        age: req.body.age,
        sexe: req.body.sexe,
        role: req.body.role
    });
    figurant.save(function (err) {
        if (err) throw err;
        res.json(figurant);
    });
});


// candidature
router.get('/candidature', function (req, res, next) {
    model.Candidature.find({}, function (err, candidatures) {
        if (err) throw err;
        res.json(candidatures);
    });
});

// candidature 
router.post('/candidature', function (req, res, next) {
    var candidature = new model.Candidature({
        statut: req.body.statut,
        idOffre: req.body.idOffre,
        idFigurant: req.body.idFigurant
    });
    candidature.save(function (err) {
        if (err) throw err;
        res.json(candidature);
    });
});

// Mes Candidatures
router.get('/candidature/:idFigurant', function (req, res, next) {
    model.Candidature.aggregate([
        {
            $match: { idFigurant: objectId(req.params.idFigurant) }
        },
        {
            $lookup: {
                from: "offreCollection",
                localField: "idOffre",
                foreignField: "_id",
                as: "offre"
            }
        }]).exec(function (err, candidature) {
            res.json(candidature);
    });
});


module.exports = router;