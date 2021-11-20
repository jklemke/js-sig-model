// Copyright 2021,	Joe Klemke, GROX LLC
// Distributed under GNU LESSER GENERAL PUBLIC LICENSE, http://www.gnu.org/licenses/lgpl.txt
//const { grox } = require('../prj/signature');
const { Signature } = require('../prj/signature');
const { util } = require('../prj/util');

// top level namespace
var grox = grox || {};

// this is a reference to a function, so can be used with "new"
grox.Grammar = 
(
	// anonymous IIFE function that is called once after the code is parsed, to define the static attributes and methods, and to return the constructor function
	function(signature) 
	{
		// private static attribute (defined once and shared by all Grammar objects)
		
		// the actual, anonymous constructor function which gets invoked by "new Grammar()"
		return function(signature) 
		{
			// private attributes, unique to each Grammar instance
			// Grammar is immutable, there are only getters and adders for these
			let _signature;
			let _generalizationChains =[];
			let _disjointAttributumSets = [];

			// private methods, unique to each Grammar instance, with access to private attributes and methods

			// _GeneralizationChain is an IIFE constructor function which is private to Grammar
			// it is a linked list from bottomGen to topGen, with transitive links between top and bottom.
			// two possible initializations:  
			//		if isTopGen
			//			subGen becomes bottomGen, subGen and superGen form a link, topGen is null (can be set later)
			//		if not isTopGen
			//			subgen becomes bottomGen, subGen and superGen form a link, superGen is set as topGen, which cannot be changed
			// copula is immutable, topGen is immutable once set.
			// bottomGen can be changed by setting a new link
			// new link can be inserted between an existing generalizationLink
			let _GeneralizationChain = 
			(
				// anonymous function which returns the _GeneralizationChain constructor
				function() {
					return function(copula, subGen, superGen, isTopGen) 
					{
						// private attributes, unique to each _GeneralizationChain instance
						let _bottomGeneralization;
						let _topGeneralization;
						let _generalizationLink = {
							narrowerGeneralization: null,
							broaderGeneralization: null
						}

						// private methods, unique to each _GeneralizationChain instance, with access to private attributes and methods
						
						// public _GeneralizationChain methods

						// _GeneralizationChain constructor code

					}
			} 
			)();

			// _DisjointAttributum is an IIFE constructor function which is private to Grammar
			// it tracks sets of signifiers which are not allowed to belong to the same nomen & copula pair
			let _DisjointAttributumSet = 
			(
				// anonymous function which returns the _DisjointAttributumSet constructor
				function() {
					return function(attributumArray) 
					{
						// private attributes, unique to each _DisjointAttributumSet instance
						let _disjointAttributums = {};
						let _nomenCopulaPairs = [
							{
								nomen: {},
								copula: {}
							}
						]

						// private methods, unique to each _DisjointAttributumSet instance, with access to private attributes and methods
						
						// public _DisjointAttributumSet methods
						this.getAttributumSet = function () {
							return _disjointAttributums;
						}

						this.addNomenCopulaPair = function (nomen, copula) {
							let validatedNomen = _signature.getSignifier(nomen);
							if (!validatedNomen) {throw new Error ("invalid nomen for disjointAttributumSet: " + nomen);}
							let validatedCopula = _signature.getSignifier(copula);
							if (!validatedCopula) {throw new Error ("invalid copula for disjointAttributumSet: " + copula);}
							_nomenCopulaPairs.push({nomen: validatedNomen, copula: validatedCopula});
						}

						this.getNomenCopulaPairs = function () {
							return _nomenCopulaPairs;
						}

						// _DisjointAttributumSet constructor code
						let validatedAttributumArray = [];
						for (let signifierId in attributumArray) {
							let signifier = _signature.getSignifier(signifierId);
							if (!signifier) {throw new Error ("invalid signifier for disjointAttributumSet: " + signifierId);}
							validatedAttributumArray.push(signifier);
						}
						if (validatedAttributumArray) {
							for (let signifier in validatedAttributumArray) {
								let qname = signifier.getQName();
								_disjointAttributums[qname] = signifier;
							}
						}
					}
				} 
			)();

			let _getDisjointSetsforAttributum = function (attributum) {
				let existingDisjointSets = [];
				for (let i = 0; i < _disjointAttributumSets.length; i++) {
					let attributumSet = _disjointAttributumSets[i].getAttributumSet();
					if (attributumSet[attributum]) {
						existingDisjointSets.push(disjointAttributumSet);
						break;  // TODO: correct use of break?
					}
					return existingDisjointSets;
				}
			}

			// grox.Signature allows duplicate prefLabels, but for the default signifiers in grox.Categorization we require unique prefLabels
			let _getUniqueQNameForSignifierId = function (signifierId) {
				let existingQNames;
				let existingQName;
				let numQNames = 0;
				let existingSignifier = _signature.getSignifier(signifierId);
				if (existingSignifier) {
					existingQName = existingSignifier.getQName();
				} else {
					let existingSignifiersForPrefLabel = _signature.getSignifiersForPrefLabel(signifierId);
					if (existingSignifiersForPrefLabel) {
						for (sigId in existingSignifiersForPrefLabel) {
							existingQNames = sigId + " ";
							numQNames++;
						}
						if (numQNames > 1) {
							throw new Error("prefLabel = " + signifierId + " has been used for multiple QNames = " + existingQNames );
						} else {
							existingQName = existingQNames.trim();
						}
					}
				}
				return existingQName;
			}

			// grox.Signature allows duplicate prefLabels, but for the default signifiers in grox.Grammar we do not allow duplicate prefLabels
			let _checkForDuplicatePrefLabels = function (prefLabel) {
				let existingSignifiersForPrefLabel = _signature.getSignifiersForPrefLabel(prefLabel);
				if (existingSignifiersForPrefLabel) {
					let existingQNames;
					for (sigId in existingSignifiersForPrefLabel) {
						existingQNames = sigId + " ";
					}
					throw new Error("prefLabel = " + prefLabel + " has already been used for QName = " + existingQNames );
				}
			}

			let _validateAndAddCopulaAttributumSignifier = function (QName, prefLabel) {
				_checkForDuplicatePrefLabels(prefLabel);
				_signature.addSignifier(QName, prefLabel, _signature.getSignifierParticipationEnum().COPULA_ATTRIBUTUM);
			}

			let _addCoreNamespaces = function ()
			{
				_signature.addNamespace('rdf','http://www.w3.org/1999/02/22-rdf-syntax-ns#');
				_signature.addNamespace('rdfs','http://www.w3.org/2000/01/rdf-model#');
				_signature.addNamespace('dc','http://purl.org/dc/elements/1.1/');
				_signature.addNamespace('owl','http://www.w3.org/2002/07/owl#');
				_signature.addNamespace('ex','http://www.example.org/');
				_signature.addNamespace('xsd','http://www.w3.org/2001/XMLmodel#');
				_signature.addNamespace('skos','http://www.w3.org/2004/02/skos/core#');
				_signature.addNamespace('foaf','http://xmlns.com/foaf/0.1/');
				_signature.addNamespace('grox','http://www.grox.info/');
			}

			let _addCoreSignifiers = function ()
			{
				// the symmetric copulas of particularization and generalization
				_validateAndAddCopulaAttributumSignifier ("grox:iT4tYHw9xJVf65egdT1hOtNu", "partWrtGen");
				_validateAndAddCopulaAttributumSignifier ("grox:Fy28scb0taxYGdYeexBx3365", "genWrtPart");
				_validateAndAddCopulaAttributumSignifier ("grox:LY41ZUMrKdPh9G3w6b2rxFUY", "subGenWrtSuperGen");
				_validateAndAddCopulaAttributumSignifier ("grox:QT64ORWiazZEsiU9k2pfhDUf", "superGenWrtSubGen");
				_validateAndAddCopulaAttributumSignifier ("grox:QQ46Ef5vecHgr6ctohqU1pTo", "subGenWrtTopDomain");
				_validateAndAddCopulaAttributumSignifier ("grox:Wb4bglkQ9PrEt3C7y0YCOqpA", "topDomainWrtsubGen");

				// the asymmetric copulas of traits 
				_validateAndAddCopulaAttributumSignifier ("grox:Kr7rkKhBHnxEo2OIddayrxZr", "partHasTraitPart");
				_validateAndAddCopulaAttributumSignifier ("grox:SW6KX6Y8QRKPpzEoJYoAD4Ya", "partHasTraitGen");
				_validateAndAddCopulaAttributumSignifier ("grox:Ov4ItKWDuLMVUAlrbDfgBXkW", "genHasTraitPart");
				_validateAndAddCopulaAttributumSignifier ("grox:WW6JqN8iMmQcvwrRYxDub7N7", "genHasTraitGen");
				
				// the symmetric copulas of situation (existence of a particular in a domain)
				_validateAndAddCopulaAttributumSignifier ( "grox:VW4TIqnPANbf73SKLB1pXWr0", "partWrtTopDomain");
				_validateAndAddCopulaAttributumSignifier ("grox:mi1vJ1s5GHf2dD8lswGIyddE", "topDomainWrtPart");

				// copulas of trait hierarchies
				_validateAndAddCopulaAttributumSignifier ("grox:OT7cRTTm9suVcCmdkxVXn9hx", "isSubTraitOf");

				// TODO: logic for these
				// hasTrait is asymmetric
				// specimenOfSpecies is inverse
				// species, genus, supergenus is transitive
				// instance, class, superclass is transitive
				// domain is top level aggregate for all aggregate. a situation is anything in a domain (existence)
				// specimen, species and genus are categorization, that is they do not copy trait
				// instance, class, and superclass are classification, that is they do copy traits
				// every item in the plurality must have the prototypical traits of the prototype
				// consecutive of enumeration are ordered
				// item of list is unordered finite list
				// expression is a molecular, combination of other aggregates

				// temp tests to ensure these classes can be instantiated
				let genChain = new _GeneralizationChain();
				_generalizationChains.push(genChain);
				let disjointAttributumSet = new _DisjointAttributumSet();
				_disjointAttributumSets.push(disjointAttributumSet);
			}

			// "this" defines a privileged method which is public, unique to each object instance, with access to private attributes and methods
			// TODO: the basic idea is for a Grammar to manipulate a Signature
			// so Grammar has a facade for the public methods of Signature
			this.addDisjointAttributumSet = function(attributumArray)
			{
				let disjointAttributumSet = new _DisjointAttributumSet(attributumArray);
				_disjointAttributumSets.push(disjointAttributumSet);
			}

			this.getDisjointAttributumSetForAttributum = function(attributum)
			{

			}

			this.addNamespace = function()
			{
				return _signature.addNamespace(prefix, URI);
			}

			this.addSignifier = function(QName, prefLabel, signifierParticipationType)
			{
				return _signature.addSignifier(QName, prefLabel, signifierParticipationType);
			}

			this.getSignifier = function(signifierId)
			{
				return _signature.getSignifier(signifierId);
			}

			// signifierId can be a QName, a reference to a Signifier Object, or a uniquely-enforced prefLabel
			this.getUniqueQNameForSignifierId = function(signifierId)
			{
				return _getUniqueQNameForSignifierId(signifierId);
			}

			this.addAxiom = function(nomen, copula, attributum, altCopulaLabel)
			{
				let nomenSig = _signature.getSignifier(nomen);
				if (!nomenSig) {throw new Error ("invalid nomen for new Axiom: " + nomen); }
				let copulaSig = _signature.getSignifier(copula);
				if (!copulaSig) {throw new Error ("invalid copula for new Axiom: " + copula); }
				let attributumSig = _signature.getSignifier(attributum);
				if (!attributumSig) {throw new Error ("invalid attributum for new Axiom: " + attributum); }

				let nomenQName = nomenSig.getQName();
				let copulaQName = copulaSig.getQName();
				let attributumQName = attributumSig.getQName();

				let disjointAttributumSets = _getDisjointSetsforAttributum();

				// TODO: logic here to test for disjoint attributums
				for (let disjointAttributumSet in disjointAttributumSets) {
					let nomenCopulaPairs = disjointAttributumSet.getNomenCopulaPairs();
					for (let nomenCopulaPair in nomenCopulaPairs) {
						if (nomenCopulaPair.nomen ==  nomenQName && nomenCopulaPair.copula == copulaQName) {
							let errorMsg = "nomen " + nomenQName + " and copula " + copulaQName + " already been assigned an attribute in disjoint set \n";
							for (let attributum in disjointAttributumSet) {
								errorMsg += "\tattributum\n"
							}
							throw new Error(errorMsg);
						}
					}
				}
				return _signature.addAxiom(nomen, copula, attributum, altCopulaLabel);
			}

			this.getAxiomsWithLiteralAsAttributum = function(literal)
			{
				return _signature.getAxiomsWithLiteralAsAttributum(literal);
			}

			this.getSignifierParticipationEnum = function () 
			{
				return _signature.getSignifierParticipationEnum();
			}

			// constructor code for Grammar, which runs once when the object is instantiated with "new Grammar()"
			if (!signature) {throw new Error ("new Grammar() is missing required argument: signature"); }
			if (util.verifyPropertiesOnSignatureType(signature, "fail"))
			{
					_signature = signature;
			}

			_addCoreNamespaces();
			_addCoreSignifiers();
		}
	}
)();

// when "new" is called, a copy of the prototype is created, and the constructor code is run on it
grox.Grammar.prototype = 
{
	// public, non-privileged methods (one copy for all objects, 
	// uses "this" to call object-specific methods and attributes, but has no access to private attributes or methods)
	logSignifier: function(signifierId) 
	{
		let signifier = this.getSignifier(signifierId);
		if (signifier) {signifier.log();}
		else {console.log("Signifier: " + signifierId + " is undefined")}
	}
	,
	// TODO: need fully fleshed out getAxiomAPI
	logAxiomsWithNomen: function(signifierId) 
	{
		let signifier = this.getSignifier(signifierId);
		if (signifier) 
		{
			let axioms = signifier.getAxiomsWithThisAsNomen(); 
			axioms.forEach(element => {
					element.log();
			});
		}
	}
	,
	logAxiomsWithCopula: function(signifierId) 
	{
		let signifier = this.getSignifier(signifierId);
		if (signifier) 
		{
			let axioms = signifier.getAxiomsWithThisAsCopula(); 
			axioms.forEach(element => {
					element.log();
			});
		}
	}
	,
	logAxiomsWithSignifierAsAttributum: function(signifierId) 
	{
		let signifier = this.getSignifier(signifierId);
		if (signifier) 
		{
			let axioms = signifier.getAxiomsWithThisAsAttributum(); 
			axioms.forEach(element => {
					element.log();				
			});		
		}
	}
	,
	logAxiomsWithLiteralAsAttributum: function(literal) 
	{
		let axioms = this.getAxiomsWithLiteralAsAttributum(literal);
		if (axioms) 
		{
			axioms.forEach(element => {
				element.log();				
			});	
		}
	}
};

module.exports = grox;
