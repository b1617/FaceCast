var express = require('express');
var router = express.Router();
var path = require('path');
var fs = require('fs');
var model = require('../models/modelJson');
var objectId = require('mongoose').Types.ObjectId;

router.get('/', function (req, res, next) {
    res.send('Hi Rest , Try : /offre or  /figurant or /candidature');
});

// Tous les Offres 
router.get('/offre', function (req, res, next) {
    model.Offre.find({}, function (err, offres) {
        if (err) throw err;
        res.json(offres);
    });
});

// Offre du moment
router.get('/offre/enCour/:apiKey', function (req, res, next) {
    model.Figurant.find({ apiKey: req.params.apiKey }, function (err, figurant) {
        if (err) {
            throw err;
        }
        else if (Object.keys(figurant).length == 1) {

            model.Offre.aggregate([
                {
                    $match: { dateDebut: { $gte: new Date() } }
                },
                {
                    $lookup: {
                        from: "candidatureCollection",
                        localField: "_id",
                        foreignField: "idOffre",
                        as: "candidature"
                    }
                },
                {
                    $project: {
                        "_id": 1,
                        "nomEvenement": 1,
                        "typeEvenement": 1,
                        "dateDebut": 1,
                        "nbJours": 1,
                        "role": 1,
                        "nbFigurant": 1,

                        "candidature": {
                            $filter: {
                                "input": "$candidature",
                                "as": "mesCandidatures",
                                "cond": { "$eq": ["$$mesCandidatures.apiKey", req.params.apiKey] }
                            }
                        }
                    }
                }]).exec(function (err, candidature) {
                    res.json(candidature);
                });
        }
        else {
            res.send("erreur");
        }
    });
});


// Offre passée
router.get('/offre/fini/:apiKey', function (req, res, next) {
    model.Figurant.find({ apiKey: req.params.apiKey }, function (err, figurant) {
        if (err) {
            throw err;
        }
        else if (Object.keys(figurant).length == 1) {

            model.Offre.aggregate([
                {
                    $match: { dateDebut: { $lte: new Date() } }
                },
                {
                    $lookup: {
                        from: "candidatureCollection",
                        localField: "_id",
                        foreignField: "idOffre",
                        as: "candidature"
                    }
                },
                {
                    $project: {
                        "_id": 1,
                        "nomEvenement": 1,
                        "typeEvenement": 1,
                        "dateDebut": 1,
                        "nbJours": 1,
                        "role": 1,
                        "nbFigurant": 1,

                        "candidature": {
                            $filter: {
                                "input": "$candidature",
                                "as": "mesCandidatures",
                                "cond": { "$eq": ["$$mesCandidatures.apiKey", req.params.apiKey] }
                            }
                        }
                    }
                }]).exec(function (err, candidature) {
                    res.json(candidature);
                });
        
        }
        else {
            res.send("erreur");
        }
    });
});

// nombre d'offre a retourné
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

//  Tous les Figurants
router.get('/figurant', function (req, res, next) {
    model.Figurant.find({}, function (err, figurants) {
        if (err) throw err;
        res.json(figurants);
    });
});

// inscription d'un figurant
router.post('/figurant', function (req, res, next) {
    var figurant = new model.Figurant({
        apiKey: req.body.apiKey,
        nom: req.body.nom,
        prenom: req.body.prenom,
        email : req.body.email,
        age: req.body.age,
        sexe: req.body.sexe,
        role: req.body.role
    });
    figurant.save(function (err) {
        if (err) throw err;
        res.json(figurant);
    });
});



// ajouter une candidature 

router.post('/candidature/ajout/:apiKey', function (req, res, next) {
    model.Figurant.find({ apiKey: req.params.apiKey }, function (err, figurant) {
        if (err) {
            throw err;
        }
        else if (Object.keys(figurant).length == 1) {

            var candidature = new model.Candidature({
                statut: "enAttente",
                apiKey: req.body.apiKey,
                idOffre: req.body.idOffre,
                idFigurant: objectId(figurant._id)
            });
            candidature.save(function (err) {
                if (err) throw err;
                res.json(candidature);
            });
        }
        else {
            res.send("erreur");
        }
    });


});




//Get tous les Candidatures avec l'apiKey d'un figurant 
router.get('/candidature/:apiKey', function (req, res, next) {
    model.Figurant.find({ apiKey: req.params.apiKey }, function (err, figurant) {
        if (err) {
            throw err;
        }
        else if (Object.keys(figurant).length == 1) {
            model.Candidature.aggregate([
                {
                    $match: { apiKey: String(req.params.apiKey) }
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
        }
        else {
            res.send("erreur");
        }
    });
});

// Get candidature en cour avec l'apiKey d'un figurant
router.get('/candidature/enCour/:apiKey', function (req, res, next) {
    model.Figurant.find({ apiKey: req.params.apiKey }, function (err, figurant) {
        if (err) {
            throw err;
        }
        else if (Object.keys(figurant).length == 1) {
            model.Candidature.aggregate([
                {
                    $match: { apiKey: String(req.params.apiKey), statut: "enAttente" }
                },
                {
                    $lookup: {
                        from: "offreCollection",
                        localField: "idOffre",
                        foreignField: "_id",
                        as: "offre"
                    }
                }
                , {
                    $lookup: {
                        from: "figurantCollection",
                        localField: "apiKey",
                        foreignField: "apiKey",
                        as: "figurant"
                    }
                }
            ]).exec(function (err, candidature) {
                res.json(candidature);
            });
        }
        else {
            res.send("erreur");
        }
    });
});


// Get candidature resultat avec l'apikey d'un figurant

router.get('/candidature/resultat/:apiKey', function (req, res, next) {

    model.Figurant.find({ apiKey: req.params.apiKey }, function (err, figurant) {
        if (err) {
            throw err;
        }
        else if (Object.keys(figurant).length == 1) {
            model.Candidature.aggregate([
                {
                    $match: { apiKey: String(req.params.apiKey), statut: { $ne: "enAttente" } }
                },
                {
                    $lookup: {
                        from: "offreCollection",
                        localField: "idOffre",
                        foreignField: "_id",
                        as: "offre"
                    }
                }
                , {
                    $lookup: {
                        from: "figurantCollection",
                        localField: "apiKey",
                        foreignField: "apiKey",
                        as: "figurant"
                    }
                }
            ]).exec(function (err, candidature) {
                res.json(candidature);
            });
        }
        else {
            res.send("erreur");
        }
    });
});



// Tous les candidatures 
router.get('/candidature', function (req, res, next) {
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
        // res.render('candidature', { candidatureList: candidature });
        res.json(candidature)
    });
});

// Get Figurant avec l'email

router.get('/figurant/email/:email', function (req, res, next) {
    model.Figurant.find({ email: req.params.email }, function (err, figurant) {
        if (err) {
            throw err;
        }
        else {
            res.json(figurant);
        }
    });
});

module.exports = router;