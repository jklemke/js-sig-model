// Copyright 2021,	Joe Klemke, GROX LLC
// Distributed under GNU LESSER GENERAL PUBLIC LICENSE, http://www.gnu.org/licenses/lgpl.txt

// top level namespace
var grox = grox || {};

// this is a reference to a function, so can be used with "new"
grox.Categorization = 
(
	// anonymous IIFE function that is called once after the code is parsed, to define the static attributes and methods, and to return the constructor function
	function(grammar) 
	{
		// private static attribute (defined once and shared by all Categorization objects)

		// the actual, anonymous constructor function which gets invoked by "new Categorization()"
		return function(grammar) 
		{
			// private attributes, unique to each Categorization instance
			// Categorization is immutable, there are only getters for these
			let _grammar;

			// private methods, unique to each Categorization instance, with access to private attributes and methods

			let _validateAndAddCategorizationAxioms = function (QName, prefLabel, attributum) {
				let attributumQName = _grammar.getUniqueQNameForSignifierId(attributum);
				let copulaQName = _grammar.getUniqueQNameForSignifierId("isSubTraitOf"); 
				_grammar.addSignifier(QName, prefLabel, _grammar.getSignifierParticipationEnum().NOMEN_COPULA_ATTRIBUTUM);  
				_grammar.addAxiom(QName, copulaQName, attributumQName, prefLabel);
			}

			let _addCategorizationSignifiers = function ()
			{
				// the symmetric copulas of categorization
				_validateAndAddCategorizationAxioms ("grox:XJ3h0vQrSCvcqech7CwpXHZ0", "specimenWrtSpecies", "partWrtGen");
				_validateAndAddCategorizationAxioms ("grox:WK0CjxWXN1z9mhoT5SSsNP2U", "speciesWrtSpecimen", "genWrtPart");
				_validateAndAddCategorizationAxioms ("grox:H57135RLXgbxpQdKYVI94my1", "subSpeciesWrtSuperSpecies", "subGenWrtSuperGen");
				_validateAndAddCategorizationAxioms ("grox:sA0oWPZh76OPzJontiufRvS5", "superSpeciesWrtSubSpecies", "superGenWrtSubGen");
				_validateAndAddCategorizationAxioms ("grox:xo57ra1o9uvkpd1amXFtLRZg", "subSpeciesWrtTopDomain", "subGenWrtTopDomain");
				_validateAndAddCategorizationAxioms ("grox:U02oAeuYZgCvsroCSF1N49J9", "topDomainWrtSubSpecies", "topDomainWrtsubGen");

			}

			// "this" defines a privileged method which is public, unique to each object instance, with access to private attributes and methods

			// constructor code for Categorization, which runs once when the object is instantiated with "new Categorization()"
			if (!grammar) {throw new Error ("new Categorization() is missing required argument: grammar"); }
			if (grox.isTypeOfGrammar(grammar)) 
			{
				_grammar = grammar;
			} else {
				{throw new Error("Invalid grammar object for new Categorization(), " + grammar + ".");}
			}

			_addCategorizationSignifiers();
		}
	}
)();

// when "new" is called, a copy of the prototype is created, and the constructor code is run on it
grox.Categorization.prototype = 
{
};
