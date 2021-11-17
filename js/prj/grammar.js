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

			let _addCoreCopulaOnlySignifiers = function ()
			{
				// for our purposes here, we will never re-use a prefLabel for different QNames
				// these are the symmetric copulas of particularization and generalization
				signature.addSignifier("grox:iT4tYHw9xJVf65egdT1hOtNu", 'partWrtGen', _signature.getSignifierTypeEnum().COPULA);
				signature.addSignifier('grox:Fy28scb0taxYGdYeexBx3365', "genWrtPart", _signature.getSignifierTypeEnum().COPULA);
				signature.addSignifier('grox:LY41ZUMrKdPh9G3w6b2rxFUY', "subGenWrtSuperGen", _signature.getSignifierTypeEnum().COPULA);
				signature.addSignifier('grox:QT64ORWiazZEsiU9k2pfhDUf', "superGenWrtSubGen", _signature.getSignifierTypeEnum().COPULA);
				signature.addSignifier('grox:QQ46Ef5vecHgr6ctohqU1pTo', "subGenWrtTopDomain", _signature.getSignifierTypeEnum().COPULA);
				signature.addSignifier('grox:Wb4bglkQ9PrEt3C7y0YCOqpA', "TopDomainWrtsubGen", _signature.getSignifierTypeEnum().COPULA);

				// these are the asymmetric copulas of traits (characteristics of particularities and generalities)
				signature.addSignifier('grox:Kr7rkKhBHnxEo2OIddayrxZr', "partTraitPart", _signature.getSignifierTypeEnum().COPULA);
				signature.addSignifier('grox:SW6KX6Y8QRKPpzEoJYoAD4Ya', "partTraitGen", _signature.getSignifierTypeEnum().COPULA);
				signature.addSignifier('grox:Ov4ItKWDuLMVUAlrbDfgBXkW', "genTraitPart", _signature.getSignifierTypeEnum().COPULA);
				signature.addSignifier('grox:WW6JqN8iMmQcvwrRYxDub7N7', "genTraitGen", _signature.getSignifierTypeEnum().COPULA);

				// these are the symmetric copulas of existence
				signature.addSignifier('grox:VW4TIqnPANbf73SKLB1pXWr0', "partWrtTopDomain", _signature.getSignifierTypeEnum().COPULA);
				signature.addSignifier('grox:mi1vJ1s5GHf2dD8lswGIyddE', "topDomainWrtPart", _signature.getSignifierTypeEnum().COPULA);

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

			this.addSignifier = function(QName, prefLabel)
			{
				return _signature.addSignifier(QName, prefLabel);
			}

			this.getSignifier = function(signifierId)
			{
				return _signature.getSignifier(signifierId);
			}

			this.addAxiom = function(nomen, copula, attributum, altCopulaLabel)
			{
				return _signature.addAxiom(nomen, copula, attributum, altCopulaLabel);
			}

			this.getAxiomsWithLiteralAsAttributum = function(literal)
			{
				_signature.getAxiomsWithLiteralAsAttributum(literal);
			}

			// constructor code for Grammar, which runs once when the object is instantiated with "new Grammar()"
			if (grox.isTypeOfSignature(signature)) 
			{
					_signature = signature;
			} else {
				{throw new Error("Invalid signature object for new Grammar(), " + signature + ".");}
			}

			_addSemanticWebNamespaces();
			_addCoreCopulaOnlySignifiers();
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
