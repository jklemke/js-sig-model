// Copyright 2021,  Joe Klemke, Grox LLC
// Distributed under GNU LESSER GENERAL PUBLIC LICENSE, http://www.gnu.org/licenses/lgpl.txt

var grox = grox || {};

grox.Model = 
(
	// anonymous IIFE function that is called once after the code is parsed, to define the static attributes and methods, and to return the constructor function
	function() 
	{
		// any static attributes would go here

		// the actual constructor function which gets called by new Model()
		return function() 
		{
			// private attributes, unique to each Model instance
			let _namespaces = {};
			let _axioms = [];
			let _signifiers = {};
			let _thisModel = this;

			// private methods, unique to each Model instance, with access to private attributes and methods
			// _Signifier is an IIFE constructor function which is private to Model
			let _Signifier = 
			(
				function () 
				{
					return function(QName,prefLabel)
					{
						// private to each _Signifier instance
						let _QName;
						let _prefLabel;
						let _axiomsWithThisAsSubject = [];
						let _axiomsWithThisAsPredicate = [];
						let _axiomsWithThisAsObject = [];
			
						this.notifyOfParticipationAsSubject = function(axiom) 
						{
							_axiomsWithThisAsSubject.push(axiom);
							if (axiom.getPredicateLabel() != undefined)
							{
								this[axiom.getPredicateLabel()] = axiom.getObject();
							}
						};
			
						this.notifyOfParticipationAsPredicate = function(axiom) 
						{
							_axiomsWithThisAsPredicate.push(axiom);
						};
			
						this.notifyOfParticipationAsObject = function(axiom) 
						{
							_axiomsWithThisAsObject.push(axiom);
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

						// TODO: these get statements are the beginning of a SELECT API
						// there may be multiple theorems for a single axiom/triple
						this.getTheoremsWithThisAsSubject = function() 
						{
							return _axiomsWithThisAsSubject;
						};
			
						// there may be multiple assertions for a single axiom/triple
						this.getTheoremsWithThisAsPredicate = function() 
						{
							return _axiomsWithThisAsPredicate;
						};
						
						// there may be multiple assertions for a single axiom/triple
						this.getTheoremsWithThisAsObject = function() 
						{
							return _axiomsWithThisAsObject;
						};
			
						// _Signifier constructor code
						if (!QName) {throw new Error("Invalid QName for new signifier, " + QName + ".");}
						if (typeof QName != "string") {throw new Error("When adding a signifier, QName must be a string.");}
						if (QName.indexOf(":") < 0) {throw new Error("When adding a signifier, QName must have a registered namespace prefix or use ':' in first position to indicate default namespace.");}
						if (QName.indexOf(":") != QName.lastIndexOf(":"))  {throw new Error("When adding a signifier, only one colon is allowed in QName string.");} 
						if (QName.indexOf(":") == QName.length - 1)  {throw new Error("When adding a signifier, at least one additional character must follow the colon in QName string.");} 				
						
						if (!prefLabel) {
							if (QName.indexOf(":") == 0)  {prefLabel = QName.substring(1);} 
							else {prefLabel = QName.split(":")[1];}
						}
			
						_QName = QName;
						_prefLabel = prefLabel;
					}
				}
			)();
			
			// private method for _Model
			let _isSignifier = function(value)
			{
				if(value == undefined || typeof value != "object") 
				{
					return false;
				} 
				else if(value.getQName == undefined || value.notifyOfParticipationAsSubject == undefined || value.notifyOfParticipationAsPredicate == undefined || value.notifyOfParticipationAsObject == undefined ) 
				{
					return false;
				}
				return true;
			}

			// _Axiom is an IIFE constructor function which is private to Model
			// _Axiom is an in-memory physical structure of triples (subject, predicate, object)
			// Depending on the nature of the predicate the same axiom might be expressed by multiple assertions, for example
			// the axiom (triple) giraffe,rdfs:subClassOf, mammal might be asserted as
			// giraffe isSubclassOfSuperclass mammal or
			// mammal isSuperclassOfSubclass giraffe
			let _Axiom = 
			(
				function () 
				{
					return function(subject,predicate,object,altPredicateLabel) 
					{
						// private to each _Axiom instance
						let _subject;
						let _predicate;
						let _objectSignifier;
						let _objectLiteral;
						let _predicateLabel;
			
						this.getSubject = function() 
						{
							return _subject;
						};
			
						this.getPredicate = function() 
						{
							return _predicate;
						};
			
						this.getPredicateLabel = function() 
						{
							return _predicateLabel;
						};
			
						this.getObject = function() 
						{
							if (_objectSignifier) {return _objectSignifier;}
							if (_objectLiteral) {return _objectLiteral;}							
						};
			
						// _Axiom constructor code
						if (_isSignifier(subject))
						{
							_subject = subject;
						} 
						if (!_subject) 
						{
							var testSubject = _thisModel.getSignifier(subject);
							if (testSubject) {_subject = testSubject;}
						}
						if (!_subject)
						{
							if (typeof subject == 'string')
							{
								_subject = _thisModel.addSignifier(subject);
							}
						}
						if (!_subject) {throw new Error("Invalid subject for new Assertion, " + subject + ".");}
						
						if (_thisModel.isSignifier(predicate)) 
						{
							_predicate = predicate;
						} 
						if (!_predicate) 
						{
							var testPredicate = _thisModel.getSignifier(predicate);
							if (testPredicate) {_predicate = testPredicate;}
						}
						if (!_predicate)
						{
							if (typeof predicate == 'string')
							{
								_predicate = _thisModel.addSignifier(predicate, altPredicateLabel );
							}
						}
						if (!_predicate) {throw new Error("Invalid predicate for new Assertion, " + predicate + ".");}
			
						if (_thisModel.isSignifier(object)) 
						{
							_objectSignifier = object;
						} 
						if (!_objectSignifier) 
						{
							var testObject = _thisModel.getSignifier(object);
							if (testObject) {_objectSignifier = testObject;}
						}
						if (!_objectSignifier)
						{
							// if object string has one colon, assume the caller wants it to be a new Signifier
							if (typeof object == 'string' && object.indexOf(":") >= 0 && object.lastIndexOf(":") == object.indexOf(":"))
							{
								_objectSignifier = _thisModel.addSignifier(object);
							}
						}
						if (!_objectSignifier) 
						{
							// if object string is any other string, then store it as a string literal
							if (typeof object == 'string')
							_objectLiteral = object;
						}
						if (!_objectSignifier && !_objectLiteral) {throw new Error("Invalid object for new Assertion, " + object + ".");}
			
						_predicateLabel = _constructPredicateLabel(_predicate,altPredicateLabel);
			
						_subject.notifyOfParticipationAsSubject(this);
						_predicate.notifyOfParticipationAsPredicate(this);
						if (_thisModel.isSignifier(_objectSignifier)) 
						{
							_objectSignifier.notifyOfParticipationAsObject(this);
						}
					}
			
					function _constructPredicateLabel(predicate,altPredicateLabel)
					{
						let predicateLabel;
						if(altPredicateLabel != undefined && (typeof altPredicateLabel) == "string") 
						{
							predicateLabel = altPredicateLabel;
						} 
						else if(_thisModel.isSignifier(predicate))
						{
							predicateLabel = predicate.getPrefLabel();
						}
						return predicateLabel;
					}
				}
			)();

			_Signifier.prototype = 
			{
				// public, non-privileged methods (one copy for all _Signifiers)
				// used with "this" to call object-specific methods, but has no access to private attributes or methods
				log: function() 
				{
					console.log("Signifier = " + this.getQName());
				}
			};

						
			_Axiom.prototype = 
			{
				// public, non-privileged methods (one copy for all _Axioms)
				// used with "this" to call object-specific methods, but has no access to private attributes or methods
				log: function() 
				{
					let msg  = "subject  " + this.getSubject().getPrefLabel() + "\npredicate  " + this.getPredicate().getPrefLabel()  + "\nobject  ";
					let testObject = this.getObject();
					if (_isSignifier(testObject))
					{
						msg += testObject.getPrefLabel();
					}
					else
					{
						msg += testObject.toString();
					}
					console.log(msg);
				}
			};		
			
			
			// _Model privileged methods (defined with "this.", public, unique to each Model instance, with access to private attributes and methods)
			this.addNamespace = function(prefix,URI)
			{
				if (prefix.indexOf(":") >= 0) {throw new Error("When adding a namespacePrefix, a colon is not allowed in the prefix name.  Specified prefix was " + prefix);}
				_namespaces[prefix] = URI;
			}

			this.addAxiom = function(subject,predicate,object,altPredicateLabel)
			{
				//TODO: check if axiom already exists
				let newAxiom = new _Axiom(subject,predicate,object,altPredicateLabel);
				_axioms.push(newAxiom);
				return newAxiom;
			};

			this.addSignifier = function(QName,prefLabel)
			{
				let addedSignifier;
				if (_signifiers[QName]) {
					addedSignifier = _signifiers[QName];
				}
				else {
					addedSignifier = new _Signifier(QName,prefLabel);
					if (QName.indexOf(":") != 0)
					{
						let prefix = QName.split(":")[0];
						if (_namespaces[prefix] == undefined) {throw new Error("When adding a signifier, QName must use an existing namespacePrefix.  Specified prefix was " + prefix);}
					}
		
					_signifiers[QName] = addedSignifier;	
				}
				return addedSignifier;				
			};
			
			this.getSignifier = function(signifierId)
			{
				let signifier = _signifiers[signifierId];
				if (!signifier && _isSignifier(signifierId))
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

			this.isSignifier = function(resourceID)
			{
				return _isSignifier(resourceID);
			}

			this.getTheoremsWithLiteralAsPredicate = function(literal) 
			{
				let selectedAxioms = [];
				if (typeof literal == "string") {
					_axioms.forEach(element => {
						if (element.getObject() == literal){
							selectedAxioms.push(element);
						}	
					});
				}
				return selectedAxioms;
			}

			// constructor code for Model (runs once when the object is instantiated with "new")
			// ------------------------------
			_thisModel.addNamespace('grox','http://www.grox.info/');
			_thisModel.addSignifier('grox:hasPredicate');
		}
	}
)();

grox.Model.prototype = 
{
};


 