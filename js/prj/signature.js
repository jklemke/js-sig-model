// Copyright 2021,	Joe Klemke, Grox LLC
// Distributed under GNU LESSER GENERAL PUBLIC LICENSE, http://www.gnu.org/licenses/lgpl.txt

// top level grox namespace
var grox = grox || {};

// Signature holds the basic structure of namespaces, signifiers, axioms 
grox.Signature = 
(
	// anonymous IIFE function that is called once after the code is parsed, to define the static attributes and methods, and to return the constructor function
	function() 
	{
		// private static attribute (defined once and shared by all Signature objects)
		// TODO: I'm thinking this was a mistake, better to just let any signifier sit in any position.
		// but leave it her for the time being
		const _signifierParticipationEnum = {
			NOMEN:	1,
			COPULA:	2,
			NOMEN_COPULA: 3,
			ATTRIBUTUM: 4,
			NOMEN_ATTRIBUTUM: 5,
			COPULA_ATTRIBUTUM: 6,
			NOMEN_COPULA_ATTRIBUTUM: 7
		}

		// the actual constructor function which gets invoked by new Signature()
		return function() 
		{
			// private attributes, unique to each Signature instance
			// Signature is immutable, there are only getter methods for these
			let _namespaces = {};
			let _axioms = [];
			let _signifiers = {};
			let _prefLabels = {};
			let _thisSignature = this;

			// private methods, unique to each Signature instance, with access to private attributes and methods
			// _Signifier is an IIFE constructor function which is private to Signature
			let _Signifier = 
			(
				function () 
				{
					return function(QName, prefLabel, signifierParticipation)
					{
						// private to each _Signifier instance
						// note: Signifier is immutable, there are only getter methods for these
						let _QName;
						let _prefLabel;
						let _axiomsWithThisAsNomen = [];
						let _axiomsWithThisAsCopula = [];
						let _axiomsWithThisAsAttributum = [];
						let _signifierParticipation;
			
						// public _Signifier methods
						this.notifyOfParticipationAsNomen = function(axiom) 
						{
							_axiomsWithThisAsNomen.push(axiom);
							if (axiom.getCopulaLabel() != undefined)
							{
								this[axiom.getCopulaLabel()] = axiom.getAttributum();
							}
						};
			
						this.notifyOfParticipationAsCopula = function(axiom) 
						{
							_axiomsWithThisAsCopula.push(axiom);
						};
			
						this.notifyOfParticipationAsAttributum = function(axiom) 
						{
							_axiomsWithThisAsAttributum.push(axiom);
						};
			
						this.getQName = function() 
						{
							return _QName;
						};
			
						this.getPrefLabel = function() 
						{
							return _prefLabel;
						};

						this.getSignifierParticipation = function() 
						{
							return _signifierParticipation;
						};			

						// TODO: these get statements are the beginning of a SELECT API
						// there may be multiple theorems for a single axiom/triple
						this.getAxiomsWithThisAsNomen = function() 
						{
							return _axiomsWithThisAsNomen;
						};
			
						this.getAxiomsWithThisAsCopula = function() 
						{
							return _axiomsWithThisAsCopula;
						};
						
						this.getAxiomsWithThisAsAttributum = function() 
						{
							return _axiomsWithThisAsAttributum;
						};

						// _Signifier constructor code
						if (!QName) {throw new Error("Invalid QName for new signifier, " + QName + ".");}
						if (typeof QName != "string") {throw new Error("When adding a signifier, QName must be a string.");}
						if (QName.indexOf(":") < 0) {throw new Error("When adding a signifier, QName must have a registered namespace prefix or use ':' in first position to indicate default namespace.");}
						if (QName.indexOf(":") != QName.lastIndexOf(":"))	{throw new Error("When adding a signifier, only one colon is allowed in QName string.");} 
						if (QName.indexOf(":") == QName.length - 1)	{throw new Error("When adding a signifier, at least one additional character must follow the colon in QName string.");} 				
						
						if (signifierParticipation != undefined) {
							if (!signifierParticipation) {throw new Error("When adding a signifier, if signifierParticipationType is specified it must be a signifierParticipationTypeEnum.");}	
							_signifierParticipation = signifierParticipation;
						}

						if (!_signifierParticipation) {
							_signifierParticipation = _signifierParticipationEnum.NOMEN_ATTRIBUTUM;
						}
		
						if (!prefLabel) {
							if (QName.indexOf(":") == 0)	{prefLabel = QName.substring(1);} 
							else {prefLabel = QName.split(":")[1];}
						}
			
						_QName = QName;
						_prefLabel = prefLabel;
					}
				}
			)();
			
			// _Axiom is an IIFE constructor function which is private to Signature
			// An Axiom is an in-memory physical structure of an RDF-like triples (Nomen, Copula, Attributum)
			// Note: we are treating the Axiom of nomen, copula, and attributum as a single triple structure
			// capable of holding two-valued traits or three-valued relations
			 // an alternative would be to have two different structures, one for traits and one for relations

			let _Axiom = 
			(
				function () 
				{
					return function(nomen, copula, attributum, altCopulaLabel) 

					{
						// private to each _Axiom instance
						// Axiom is immutable, there are only getter methods for these
						let _nomen;
						let _copula;
						let _attributumSignifier;
						let _attributumLiteral;
						let _copulaLabel;

						// public _Axiom methods
						this.getNomen = function() 
						{
							return _nomen;
						};
			
						this.getCopula = function() 
						{
							return _copula;
						};
			
						this.getCopulaLabel = function() 
						{
							return _copulaLabel;
						};
			
						this.getAttributum = function() 
						{
							if (_attributumSignifier) {return _attributumSignifier;}
							if (_attributumLiteral) {return _attributumLiteral;}
						};

						// _Axiom constructor 
						// TODO: should we automaticaly create new signifiers?  or should we fail if they don't exist?
						if (grox.verifyPropertiesOnSignifierType(nomen)) {
							_nomen = nomen;
						}
						if (!_nomen) 
						{
							var testNomen = _thisSignature.getSignifier(nomen);
							if (testNomen) {_nomen = testNomen;}
						}
						if (!_nomen)
						{
							if (typeof nomen == 'string')
							{
								_nomen = _thisSignature.addSignifier(nomen);
							}
						}
						if (!_nomen) {throw new Error("Invalid Nomen for new Axiom, " + nomen + ".");}
						
						if (grox.verifyPropertiesOnSignifierType(copula)) 
						{
							_copula = copula;
						}
						if (!_copula)
						{
							var testCopula = _thisSignature.getSignifier(copula);
							if (testCopula) {_copula = testCopula;}
						}
						if (!_copula)
						{
							if (typeof copula == 'string')
							{
								_copula = _thisSignature.addSignifier(copula, altCopulaLabel );
							}
						}
						if (!_copula) {throw new Error("Invalid Copula for new Axiom, " + copula + ".");}
			
						if (grox.verifyPropertiesOnSignifierType(attributum)) 
						{
							_attributumSignifier = attributum;
						} 
						if (!_attributumSignifier) 
						{
							var testAttributum = _thisSignature.getSignifier(attributum);
							if (testAttributum) {_attributumSignifier = testAttributum;}
						}
						if (!_attributumSignifier)
						{
							// if Attributum string has one colon, assume the caller wants it to be a new Signifier
							if (typeof attributum == 'string' && attributum.indexOf(":") >= 0 && attributum.lastIndexOf(":") == attributum.indexOf(":"))
							{
								_attributumSignifier = _thisSignature.addSignifier(attributum);
							}
						}
						if (!_attributumSignifier) 
						{
							// if Attributum string is any other string, then store it as a string literal
							if (typeof attributum == 'string')
							_attributumLiteral = attributum;
						}
						if (!_attributumSignifier && !_attributumLiteral) {throw new Error("Invalid Attributum for new Axiom, " + attributum + ".");}
			
						_copulaLabel = _constructCopulaLabel(_copula,altCopulaLabel);
			
						_nomen.notifyOfParticipationAsNomen(this);
						_copula.notifyOfParticipationAsCopula(this);
						if (grox.verifyPropertiesOnSignifierType(_attributumSignifier)) 
						{
							_attributumSignifier.notifyOfParticipationAsAttributum(this);
						}
					}
			
					function _constructCopulaLabel(copula, altCopulaLabel)
					{
						let copulaLabel;
						if(altCopulaLabel != undefined && (typeof altCopulaLabel) == "string") 
						{
							copulaLabel = altCopulaLabel;
						} 
						else if(grox.verifyPropertiesOnSignifierType(copula))
						{
							copulaLabel = copula.getPrefLabel();
						}
						return copulaLabel;
					}
				}
			)();

			_Signifier.prototype = 
			{
				// public, non-privileged methods (one copy for all _Signifiers)
				// uses "this" to call instance-specific methods, but has no access to private attributes or methods
				log: function() 
				{
					let msg = "Signifier: ";
					msg = msg + "QName = " + this.getQName();
					msg = msg + ", prefLabel = " + this.getPrefLabel();
					let signifierParticipation = this.getSignifierParticipation();
					if (signifierParticipation) {
						switch (signifierParticipation) {
							case _signifierParticipationEnum.NOMEN:
								msg = msg + ", signifierParticipationType = " + "NOMEN";
								break;
							case _signifierParticipationEnum.COPULA:
								msg = msg + ", signifierParticipationType = " + "COPULA";
								break;
							case _signifierParticipationEnum.NOMEN_COPULA:
								msg = msg + ", signifierParticipationType = " + "NOMEN_COPULA";
								break;
							case _signifierParticipationEnum.ATTRIBUTUM:
								msg = msg + ", signifierParticipationType = " + "ATTRIBUTUM";
								break;
							case _signifierParticipationEnum.NOMEN_ATTRIBUTUM:
								msg = msg + ", signifierParticipationType = " + "NOMEN_ATTRIBUTUM";
								break;
							case _signifierParticipationEnum.COPULA_ATTRIBUTUM:
								msg = msg + ", signifierParticipationType = " + "COPULA_ATTRIBUTUM";
								break;
							case _signifierParticipationEnum.NOMEN_COPULA_ATTRIBUTUM:
								msg = msg + ", signifierParticipationType = " + "NOMEN_COPULA_ATTRIBUTUM";
								break;
						}						
					}
					console.log(msg);
				}
			};
						
			_Axiom.prototype = 
			{
				// public, non-privileged methods (one copy for all _Axioms)
				// uses "this" to call instance-specific methods, but has no access to private attributes or methods
				log: function() 
				{
					let msg	= "Nomen	" + this.getNomen().getPrefLabel() + "\nCopula	" + this.getCopula().getPrefLabel()	+ "\nAttributum	";
					let testAttributum = this.getAttributum();
					if (grox.verifyPropertiesOnSignifierType(testAttributum))
					{
						msg += testAttributum.getPrefLabel();
					}
					else
					{
						msg += testAttributum.toString();
					}
					console.log(msg);
				}
			};		
			
			// _Signature privileged methods (defined with "this.", public, unique to each Signature instance, with access to private attributes and methods)
			this.addNamespace = function(prefix, URI)
			{
				let newNamespace;
				if (prefix.indexOf(":") >= 0) {throw new Error("When adding a namespacePrefix, a colon is not allowed in the prefix name.	Specified prefix was " + prefix);}
				// TODO: shall we validate URI syntax?
				_namespaces[prefix] = URI;
				newNamespace = prefix + ":" + URI;
				return newNamespace;
			}

			this.addSignifier = function(QName, prefLabel, signifierParticipationType)
			{
				if (_signifiers[QName]) {
					return _signifiers[QName];
				} else {
					let newSignifier = new _Signifier(QName, prefLabel, signifierParticipationType);
					let newPrefLabel = newSignifier.getPrefLabel();
					let newQName = newSignifier.getQName();
					if (_prefLabels[newPrefLabel]) {
						_prefLabels[newPrefLabel][newQName] = newSignifier;
					} else {
						_prefLabels[newPrefLabel] = {};
						_prefLabels[newPrefLabel][newQName] = newSignifier;
					}
					_signifiers[newQName] = newSignifier;
					return newSignifier;	
				}
			};

			this.getSignifier = function(signifierId)
			{
				let signifier = _signifiers[signifierId];
				if (!signifier && grox.verifyPropertiesOnSignifierType(signifierId))
				{
					signifier = _signifiers[signifierId.getQName()]
				}
				return signifier;
			}

			this.getSignifiersForPrefLabel = function(prefLabel)
			{
				return _prefLabels[prefLabel];
			}

			this.addAxiom = function(Nomen, Copula, Attributum, altCopulaLabel)
			{
				//TODO: check if axiom already exists by checking each Nomen, Attributum, Copula
				let newAxiom = new _Axiom(Nomen, Copula, Attributum, altCopulaLabel);
				_axioms.push(newAxiom);
				return newAxiom;
			};

			// TODO: getAxioms is the beginning of a query language

			this.getAxiomsWithLiteralAsAttributum = function(literal) 
			{
				let selectedAxioms = [];
				if (typeof literal == "string") {
					_axioms.forEach(element => {
						if (element.getAttributum() == literal){
							selectedAxioms.push(element);
						}	
					});
				}
				return selectedAxioms;
			}

			this.getSignifierParticipationEnum = function () 
			{
				return _signifierParticipationEnum;
			}

			// constructor code for Signature (runs once when the Attributum is instantiated with "new")
			// ------------------------------
		}
	}
)();

grox.Signature.prototype = 
{
}

// type checking functions in grox namespace
grox.verifyPropertiesOnSignatureType = function (testObject, failOnError) {
	let propertyArray = [
		"addNamespace",
		"addSignifier",
		"getSignifier",
		"addAxiom",
		"getAxiomsWithLiteralAsAttributum",
		"getSignifierParticipationEnum",
		"getSignifiersForPrefLabel",
	]
	return grox.util.verifyPropertiesOnObject(testObject, "Signature", propertyArray, failOnError);
}

grox.verifyPropertiesOnSignifierType = function (testObject, failOnError) {
	let propertyArray = [
		"notifyOfParticipationAsNomen",
		"notifyOfParticipationAsCopula",
		"notifyOfParticipationAsAttributum",
	]
	return grox.util.verifyPropertiesOnObject(testObject, "Signifier", propertyArray, failOnError);
}

grox.verifyPropertiesOnAxiomType = function (testObject, failOnError) {
	let propertyArray = [
		"getNomen",
		"getCopula",
		"getCopulaLabel",
		"getAttributum",
	];
	return grox.util.verifyPropertiesOnObject(testObject, "Axiom", propertyArray, failOnError);
}

function sum(a, b) {
  return a + b;
}

module.exports = grox;



