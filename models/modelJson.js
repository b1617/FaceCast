var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var figurant = Schema({
  apiKey : String,
  nom: String,
  prenom: String,
  age: Number,
  email : String,
  sexe: String,
  role: String,

}, { collection: 'figurantCollection' });
var candidature = Schema({
  statut: String,
  apiKey : { type: Schema.Types.String, ref: 'Figurant' },
  idOffre: { type: Schema.Types.ObjectId, ref: 'Offre' },
  idFigurant: { type: Schema.Types.ObjectId, ref: 'Figurant' }

}, { collection: 'candidatureCollection' });

var offre = Schema({
  nomEvenement: String,
  typeEvenement: String,
  dateDebut: Date,
  nbJours: Number,
  role: String,
  nbFigurant: Number
}, { collection: 'offreCollection' });

var Figurant = mongoose.model('Figurant', figurant);
var Candidature = mongoose.model('Candidature', candidature);
var Offre = mongoose.model('Offre', offre);
module.exports = { Offre, Figurant, Candidature };



