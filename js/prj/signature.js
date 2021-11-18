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
							if (!signifierParticipation) {throw new Error("When adding a signifier, if signifierType is specified it must be a signifierType enumeration.");}	
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
					return function(Nomen, Copula, Attributum, altCopulaLabel) 

					{
						// private to each _Axiom instance
						// Axiom is immutable, there are only getter methods for these
						let _Nomen;
						let _Copula;
						let _AttributumSignifier;
						let _AttributumLiteral;
						let _CopulaLabel;

						// public _Axiom methods
						this.getNomen = function() 
						{
							return _Nomen;
						};
			
						this.getCopula = function() 
						{
							return _Copula;
						};
			
						this.getCopulaLabel = function() 
						{
							return _CopulaLabel;
						};
			
						this.getAttributum = function() 
						{
							if (_AttributumSignifier) {return _AttributumSignifier;}
							if (_AttributumLiteral) {return _AttributumLiteral;}							
						};
			
						// _Axiom constructor code
						if (grox.isTypeOfSignifier(Nomen))
						{
							_Nomen = Nomen;
						} 
						if (!_Nomen) 
						{
							var testNomen = _thisSignature.getSignifier(Nomen);
							if (testNomen) {_Nomen = testNomen;}
						}
						if (!_Nomen)
						{
							if (typeof Nomen == 'string')
							{
								_Nomen = _thisSignature.addSignifier(Nomen);
							}
						}
						if (!_Nomen) {throw new Error("Invalid Nomen for new Axiom, " + Nomen + ".");}
						
						if (grox.isTypeOfSignifier(Copula)) 
						{
							_Copula = Copula;
						} 
						if (!_Copula) 
						{
							var testCopula = _thisSignature.getSignifier(Copula);
							if (testCopula) {_Copula = testCopula;}
						}
						if (!_Copula)
						{
							if (typeof Copula == 'string')
							{
								_Copula = _thisSignature.addSignifier(Copula, altCopulaLabel );
							}
						}
						if (!_Copula) {throw new Error("Invalid Copula for new Axiom, " + Copula + ".");}
			
						if (grox.isTypeOfSignifier(Attributum)) 
						{
							_AttributumSignifier = Attributum;
						} 
						if (!_AttributumSignifier) 
						{
							var testAttributum = _thisSignature.getSignifier(Attributum);
							if (testAttributum) {_AttributumSignifier = testAttributum;}
						}
						if (!_AttributumSignifier)
						{
							// if Attributum string has one colon, assume the caller wants it to be a new Signifier
							if (typeof Attributum == 'string' && Attributum.indexOf(":") >= 0 && Attributum.lastIndexOf(":") == Attributum.indexOf(":"))
							{
								_AttributumSignifier = _thisSignature.addSignifier(Attributum);
							}
						}
						if (!_AttributumSignifier) 
						{
							// if Attributum string is any other string, then store it as a string literal
							if (typeof Attributum == 'string')
							_AttributumLiteral = Attributum;
						}
						if (!_AttributumSignifier && !_AttributumLiteral) {throw new Error("Invalid Attributum for new Axiom, " + Attributum + ".");}
			
						_CopulaLabel = _constructCopulaLabel(_Copula,altCopulaLabel);
			
						_Nomen.notifyOfParticipationAsNomen(this);
						_Copula.notifyOfParticipationAsCopula(this);
						if (grox.isTypeOfSignifier(_AttributumSignifier)) 
						{
							_AttributumSignifier.notifyOfParticipationAsAttributum(this);
						}
					}
			
					function _constructCopulaLabel(Copula, altCopulaLabel)
					{
						let CopulaLabel;
						if(altCopulaLabel != undefined && (typeof altCopulaLabel) == "string") 
						{
							CopulaLabel = altCopulaLabel;
						} 
						else if(grox.isTypeOfSignifier(Copula))
						{
							CopulaLabel = Copula.getPrefLabel();
						}
						return CopulaLabel;
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
								msg = msg + ", signifierType = " + "NOMEN";
								break;
							case _signifierParticipationEnum.COPULA:
								msg = msg + ", signifierType = " + "COPULA";
								break;
							case _signifierParticipationEnum.NOMEN_COPULA:
								msg = msg + ", signifierType = " + "NOMEN_COPULA";
								break;
							case _signifierParticipationEnum.ATTRIBUTUM:
								msg = msg + ", signifierType = " + "ATTRIBUTUM";
								break;
							case _signifierParticipationEnum.NOMEN_ATTRIBUTUM:
								msg = msg + ", signifierType = " + "NOMEN_ATTRIBUTUM";
								break;
							case _signifierParticipationEnum.COPULA_ATTRIBUTUM:
								msg = msg + ", signifierType = " + "COPULA_ATTRIBUTUM";
								break;
							case _signifierParticipationEnum.NOMEN_COPULA_ATTRIBUTUM:
								msg = msg + ", signifierType = " + "NOMEN_COPULA_ATTRIBUTUM";
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
					if (grox.isTypeOfSignifier(testAttributum))
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

			this.addSignifier = function(QName, prefLabel, signifierType)
			{
				if (_signifiers[QName]) {
					return _signifiers[QName];
				} else {
					let newSignifier = new _Signifier(QName, prefLabel, signifierType);
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
				if (!signifier && grox.isTypeOfSignifier(signifierId))
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

// utility functions in the grox namespace
grox.isTypeOfSignature = function (testValue)
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

grox.isTypeOfSignifier = function(testValue)
{
	if (
		testValue == undefined ||
		typeof testValue != "object" ||
		testValue.getQName == undefined || 
		testValue.notifyOfParticipationAsNomen == undefined || 
		testValue.notifyOfParticipationAsCopula == undefined || 
		testValue.notifyOfParticipationAsAttributum == undefined 
		)
	{
		return false;
	} 
	else	
	{
		return true;
	}
}

grox.isTypeOfAxiom = function(testValue)
{
	if (
		testValue == undefined ||
		typeof testValue != "object" ||
		testValue.getNomen == undefined || 
		testValue.getCopula == undefined || 
		testValue.getCopulaLabel == undefined || 
		testValue.getAttributum == undefined 
		)	
	{
		return false;
	} 
	else	
	{
		return true;
	}
}

