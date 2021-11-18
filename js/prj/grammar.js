// Copyright 2021,	Joe Klemke, GROX LLC
// Distributed under GNU LESSER GENERAL PUBLIC LICENSE, http://www.gnu.org/licenses/lgpl.txt

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
			// Grammar is immutable, there are only getters for these
			let _signature;
			let _generalizationChains =[];

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

			// grox.Signature allows duplicate prefLabels, but for the default signifiers in grox.Grammar we do not allow duplicate prefLabels
			let _checkForDuplicatePrefLabels = function (prefLabel) {
				let existingSignifiersForPrefLabel = signature.getSignifiersForPrefLabel(prefLabel);
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

			let _addSemanticWebNamespaces = function ()
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
				_validateAndAddCopulaAttributumSignifier ("grox:Kr7rkKhBHnxEo2OIddayrxZr", "partTraitPart");
				_validateAndAddCopulaAttributumSignifier ("grox:SW6KX6Y8QRKPpzEoJYoAD4Ya", "partTraitGen");
				_validateAndAddCopulaAttributumSignifier ("grox:Ov4ItKWDuLMVUAlrbDfgBXkW", "genTraitPart");
				_validateAndAddCopulaAttributumSignifier ("grox:WW6JqN8iMmQcvwrRYxDub7N7", "genTraitGen");
				
				// the symmetric copulas of existence (situation of a particular in a domain)
				_validateAndAddCopulaAttributumSignifier ( "grox:VW4TIqnPANbf73SKLB1pXWr0", "partWrtTopDomain");
				_validateAndAddCopulaAttributumSignifier ("grox:mi1vJ1s5GHf2dD8lswGIyddE", "topDomainWrtPart", );

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

				let genChain = new _GeneralizationChain();
			}

			// "this" defines a privileged method which is public, unique to each object instance, with access to private attributes and methods
			// TODO: the basic idea is for a Grammar to manipulate a Signature
			// so Grammar has a facade for the public methods of Signature
			this.addNamespace = function()
			{
				return _signature.addNamespace(prefix, URI);
			}

			this.addSignifier = function(QName, prefLabel, signifierType)
			{
				return _signature.addSignifier(QName, prefLabel, signifierType);
			}

			this.getSignifier = function(signifierId)
			{
				return _signature.getSignifier(signifierId);
			}

			this.getSignifiersForPrefLabel = function(prefLabel)
			{
				return _signature.getSignifiersForPrefLabel(prefLabel);
			}
			
			this.addAxiom = function(nomen, copula, attributum, altCopulaLabel)
			{
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
			if (grox.isTypeOfSignature(signature)) 
			{
					_signature = signature;
			} else {
				{throw new Error("Invalid signature object for new Grammar(), " + signature + ".");}
			}

			_addSemanticWebNamespaces();
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

// utility functions in the grox namespace
grox.isTypeOfGrammar = function (testValue)
{
	if (
		testValue == undefined ||
		typeof testValue != "object" ||
		testValue.addNamespace == undefined || 
		testValue.addSignifier == undefined || 
		testValue.getSignifier == undefined ||
		testValue.addAxiom == undefined ||
		testValue.getAxiomsWithLiteralAsAttributum == undefined ||
		testValue.getSignifierParticipationEnum == undefined ||
		testValue.getSignifiersForPrefLabel == undefined
		)
	{
		return false;
	} 
	else 
	{
		return true;
	}
}

