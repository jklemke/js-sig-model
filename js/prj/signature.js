// Copyright 2021,  Joe Klemke, Grox LLC
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
    const _signifierTypeEnum = {
      ALL: 0,
      NOMINATIVE:  1,
      COPULATIVE:  2,
      NOMINATIVE_COPULATIVE: 3,          
      ATTRIBUTATIVE: 4,
      NOMINATIVE_ATTRIBUTATIVE: 5,
      COPULATIVE_ATTRIBUTATIVE: 6,
      NOMINATIVE_COPULATIVE_ATTRIBUTATIVE: 7
    }
  
		// the actual constructor function which gets invoked by new Signature()
		return function(model) 
		{
			// private attributes, unique to each Signature instance
			let _namespaces = {};
			let _axioms = [];
			let _signifiers = {};
			let _thisSignature = this;

			// private methods, unique to each Signature instance, with access to private attributes and methods
			let _isTypeOfSignifier = function(value)
			{
        if(
          value == undefined ||
          typeof value != "object" ||
          value.getQName == undefined || 
          value.notifyOfParticipationAsNominative == undefined || 
          value.notifyOfParticipationAsCopulative == undefined || 
          value.notifyOfParticipationAsAttributative == undefined 
          )  
        {
          return false;
        } 
        else  
        {
          return true;
        }
      }

			// _Signifier is an IIFE constructor function which is private to Signature
			let _Signifier = 
			(
				function () 
				{
					return function(QName, prefLabel, signifierType)
					{
						// private to each _Signifier instance
						let _QName;
						let _prefLabel;
						let _axiomsWithThisAsNominative = [];
						let _axiomsWithThisAsCopulative = [];
						let _axiomsWithThisAsAttributative = [];
            let _signifierType;
			
						this.notifyOfParticipationAsNominative = function(axiom) 
						{
							_axiomsWithThisAsNominative.push(axiom);
							if (axiom.getCopulativeLabel() != undefined)
							{
								this[axiom.getCopulativeLabel()] = axiom.getAttributative();
							}
						};
			
						this.notifyOfParticipationAsCopulative = function(axiom) 
						{
							_axiomsWithThisAsCopulative.push(axiom);
						};
			
						this.notifyOfParticipationAsAttributative = function(axiom) 
						{
							_axiomsWithThisAsAttributative.push(axiom);
						};
			
						this.getQName = function() 
						{
							return _QName;
						};
			
						this.getPrefLabel = function() 
						{
							return _prefLabel;
						};

						this.setPrefLabel = function(prefLabel) 
						{
							_prefLabel =prefLabel;
							return _prefLabel;
						};

            this.getSignifierType = function() 
						{
							return _signifierType;
						};			

						// TODO: these get statements are the beginning of a SELECT API
						// there may be multiple theorems for a single axiom/triple
						this.getAxiomsWithThisAsNominative = function() 
						{
							return _axiomsWithThisAsNominative;
						};
			
						this.getAxiomsWithThisAsCopulative = function() 
						{
							return _axiomsWithThisAsCopulative;
						};
						
						this.getAxiomsWithThisAsAttributative = function() 
						{
							return _axiomsWithThisAsAttributative;
						};
			
						// _Signifier constructor code
						if (!QName) {throw new Error("Invalid QName for new signifier, " + QName + ".");}
						if (typeof QName != "string") {throw new Error("When adding a signifier, QName must be a string.");}
						if (QName.indexOf(":") < 0) {throw new Error("When adding a signifier, QName must have a registered namespace prefix or use ':' in first position to indicate default namespace.");}
						if (QName.indexOf(":") != QName.lastIndexOf(":"))  {throw new Error("When adding a signifier, only one colon is allowed in QName string.");} 
						if (QName.indexOf(":") == QName.length - 1)  {throw new Error("When adding a signifier, at least one additional character must follow the colon in QName string.");} 				
						
            if (signifierType != undefined) {
              if (!signifierType) {throw new Error("When adding a signifier, if signifierType is specified it must be a signifierType enumeration.");}  
              _signifierType = signifierType;
            }

            if (!_signifierType) {
              _signifierType = _signifierTypeEnum.NOMINATIVE_COPULATIVE_ATTRIBUTATIVE;
            }
    
						if (!prefLabel) {
							if (QName.indexOf(":") == 0)  {prefLabel = QName.substring(1);} 
							else {prefLabel = QName.split(":")[1];}
						}
			
						_QName = QName;
						_prefLabel = prefLabel;
					}
				}
			)();
			
			// _Axiom is an IIFE constructor function which is private to Signature
			// _Axiom is an in-memory physical structure of triples (Nominative, Copulative, Attributative)
			// Depending on the nature of the Copulative the same axiom might be expressed by multiple assertions, for example
			// the axiom (triple) giraffe,rdfs:subClassOf, mammal might be asserted as
			// giraffe isSubclassOfSuperclass mammal or
			// mammal isSuperclassOfSubclass giraffe
			let _Axiom = 
			(
				function () 
				{
					return function(nominative, copulative, attributative, altCopulativeLabel) 

					{
						// private to each _Axiom instance
						let _nominative;
						let _copulative;
						let _attributativeSignifier;
						let _attributativeLiteral;
						let _copulativeLabel;
			
						this.getNominative = function() 
						{
							return _nominative;
						};
			
						this.getCopulative = function() 
						{
							return _copulative;
						};
			
						this.getCopulativeLabel = function() 
						{
							return _copulativeLabel;
						};
			
						this.getAttributative = function() 
						{
							if (_attributativeSignifier) {return _attributativeSignifier;}
							if (_attributativeLiteral) {return _attributativeLiteral;}							
						};
			
						// _Axiom constructor code
						if (_isTypeOfSignifier(nominative))
						{
							_nominative = nominative;
						} 
						if (!_nominative) 
						{
							var testNominative = _thisSignature.getSignifier(nominative);
							if (testNominative) {_nominative = testNominative;}
						}
						if (!_nominative)
						{
							if (typeof nominative == 'string')
							{
								_nominative = _thisSignature.addSignifier(nominative);
							}
						}
						if (!_nominative) {throw new Error("Invalid Nominative for new Assertion, " + nominative + ".");}
						
						if (_isTypeOfSignifier(copulative)) 
						{
							_copulative = copulative;
						} 
						if (!_copulative) 
						{
							var testCopulative = _thisSignature.getSignifier(copulative);
							if (testCopulative) {_copulative = testCopulative;}
						}
						if (!_copulative)
						{
							if (typeof copulative == 'string')
							{
								_copulative = _thisSignature.addSignifier(copulative, altCopulativeLabel );
							}
						}
						if (!_copulative) {throw new Error("Invalid Copulative for new Assertion, " + copulative + ".");}
			
						if (_isTypeOfSignifier(attributative)) 
						{
							_attributativeSignifier = attributative;
						} 
						if (!_attributativeSignifier) 
						{
							var testAttributative = _thisSignature.getSignifier(attributative);
							if (testAttributative) {_attributativeSignifier = testAttributative;}
						}
						if (!_attributativeSignifier)
						{
							// if Attributative string has one colon, assume the caller wants it to be a new Signifier
							if (typeof attributative == 'string' && attributative.indexOf(":") >= 0 && attributative.lastIndexOf(":") == attributative.indexOf(":"))
							{
								_attributativeSignifier = _thisSignature.addSignifier(attributative);
							}
						}
						if (!_attributativeSignifier) 
						{
							// if Attributative string is any other string, then store it as a string literal
							if (typeof attributative == 'string')
							_attributativeLiteral = attributative;
						}
						if (!_attributativeSignifier && !_attributativeLiteral) {throw new Error("Invalid Attributative for new Assertion, " + attributative + ".");}
			
						_copulativeLabel = _constructCopulativeLabel(_copulative,altCopulativeLabel);
			
						_nominative.notifyOfParticipationAsNominative(this);
						_copulative.notifyOfParticipationAsCopulative(this);
						if (_isTypeOfSignifier(_attributativeSignifier)) 
						{
							_attributativeSignifier.notifyOfParticipationAsAttributative(this);
						}
					}
			
					function _constructCopulativeLabel(copulative, altCopulativeLabel)
					{
						let copulativeLabel;
						if(altCopulativeLabel != undefined && (typeof altCopulativeLabel) == "string") 
						{
							copulativeLabel = altCopulativeLabel;
						} 
						else if(_isTypeOfSignifier(copulative))
						{
							copulativeLabel = copulative.getPrefLabel();
						}
						return copulativeLabel;
					}
				}
			)();

			_Signifier.prototype = 
			{
				// public, non-privileged methods (one copy for all _Signifiers)
				// uses "this" to call Attributative-specific methods, but has no access to private attributes or methods
				log: function() 
				{
          let msg = "Signifier = " + this.getQName();
          let signifierType = this.getSignifierType()          
          if (signifierType) {
            switch (signifierType) {
              case _signifierTypeEnum.ALL: 
                msg = msg + ", signifierType = " + "ALL";
                break;
              case _signifierTypeEnum.NOMINATIVE:
                msg = msg + ", signifierType = " + "NOMINATIVE";
                break;
              case _signifierTypeEnum.COPULATIVE:
                msg = msg + ", signifierType = " + "COPULATIVE";
                break;
              case _signifierTypeEnum.NOMINATIVE_COPULATIVE:
                msg = msg + ", signifierType = " + "NOMINATIVE_COPULATIVE";
                break;
              case _signifierTypeEnum.ATTRIBUTATIVE:
                msg = msg + ", signifierType = " + "ATTRIBUTATIVE";
                break;
              case _signifierTypeEnum.NOMINATIVE_ATTRIBUTATIVE:
                msg = msg + ", signifierType = " + "NOMINATIVE_ATTRIBUTATIVE";
                break;
              case _signifierTypeEnum.COPULATIVE_ATTRIBUTATIVE:
                msg = msg + ", signifierType = " + "COPULATIVE_ATTRIBUTATIVE";
                break;
              case _signifierTypeEnum.NOMINATIVE_COPULATIVE_ATTRIBUTATIVE:
                msg = msg + ", signifierType = " + "NOMINATIVE_COPULATIVE_ATTRIBUTATIVE";
                break;
            }            
          }
					console.log(msg);
				}
			};
						
			_Axiom.prototype = 
			{
				// public, non-privileged methods (one copy for all _Axioms)
				// uses "this" to call Attributative-specific methods, but has no access to private attributes or methods
				log: function() 
				{
					let msg  = "Nominative  " + this.getNominative().getPrefLabel() + "\nCopulative  " + this.getCopulative().getPrefLabel()  + "\nAttributative  ";
					let testAttributative = this.getAttributative();
					if (_isTypeOfSignifier(testAttributative))
					{
						msg += testAttributative.getPrefLabel();
					}
					else
					{
						msg += testAttributative.toString();
					}
					console.log(msg);
				}
			};		
			
			// _Signature privileged methods (defined with "this.", public, unique to each Signature instance, with access to private attributes and methods)
			this.addNamespace = function(prefix, URI)
			{
        let newNamespace;
				if (prefix.indexOf(":") >= 0) {throw new Error("When adding a namespacePrefix, a colon is not allowed in the prefix name.  Specified prefix was " + prefix);}
				_namespaces[prefix] = URI;
        newNamespace = prefix;
        return newNamespace;
			}

			this.addSignifier = function(QName, prefLabel, signifierType)
			{
        let newSignifier;
        if (_signifiers[QName]) {
          newSignifier = _signifiers[QName];
        }
        else {
          newSignifier = new _Signifier(QName, prefLabel, signifierType);
          if (QName.indexOf(":") != 0)
          {
            let prefix = QName.split(":")[0];
            if (_namespaces[prefix] == undefined) {throw new Error("When adding a signifier, QName must use an existing namespacePrefix.  Specified prefix was " + prefix);}
          }

          _signifiers[QName] = newSignifier;	
        }
        return newSignifier;				
			};
			
			this.getSignifier = function(signifierId)
			{
				let signifier = _signifiers[signifierId];
				if (!signifier && _isTypeOfSignifier(signifierId))
				{
					signifier = _signifiers[signifierId.getQName()]
				}
				let signifierName = "";
				if (signifier)
				{
					signifierName = signifier.getQName();
				}
				return signifier;
			}

			this.addAxiom = function(nominative, copulative, attributative, altCopulativeLabel)
			{
				//TODO: check if axiom already exists by checking each Nominative, Attributative, Copulative
				let newAxiom = new _Axiom(nominative, copulative, attributative, altCopulativeLabel);
				_axioms.push(newAxiom);
				return newAxiom;
			};

      // TODO: getAxioms is the beginning of a query language

			this.getAxiomsWithLiteralAsAttributative = function(literal) 
			{
				let selectedAxioms = [];
				if (typeof literal == "string") {
					_axioms.forEach(element => {
						if (element.getAttributative() == literal){
							selectedAxioms.push(element);
						}	
					});
				}
				return selectedAxioms;
			}

      this.getSignifierTypeEnum = function () 
      {
        return _signifierTypeEnum;
      }

			// constructor code for Signature (runs once when the Attributative is instantiated with "new")
			// ------------------------------
    }
	}
)();

grox.Signature.prototype = 
{
}
