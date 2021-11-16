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
			// note: Grammar is immutable, there are only getters for these
			let _signature;

			// private methods, unique to each Grammar instance, with access to private attributes and methods
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
				console.log(_signature.getSignifierTypeEnum().COPULA);
				let rdftype = signature.addSignifier('rdf:type','isA', _signature.getSignifierTypeEnum().COPULA);
				let groxtrait = signature.addSignifier('grox:hasTrait', undefined, _signature.getSignifierTypeEnum().COPULA);
				rdftype.log();
				groxtrait.log();
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
			if (signature.isTypeOfSignature(signature)) 
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
