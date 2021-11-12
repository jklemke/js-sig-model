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
			let _facts = [];
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
						let _factsWithThisAsSubject = [];
						let _facstWithThisAsPredicate = [];
						let _factsWithThisAsObject = [];
			
						this.notifyOfParticipationAsSubject = function(fact) 
						{
							_factsWithThisAsSubject.push(fact);
							if (fact.getPredicateLabel() != undefined)
							{
								this[fact.getPredicateLabel()] = fact.getObject();
							}
						};
			
						this.notifyOfParticipationAsPredicate = function(fact) 
						{
							_facstWithThisAsPredicate.push(fact);
						};
			
						this.notifyOfParticipationAsObject = function(fact) 
						{
							_factsWithThisAsObject.push(fact);
						};
			
						this.getQName = function() 
						{
							return _QName;
						};
			
						this.getPrefLabel = function() 
						{
							return _prefLabel;
						};

						// TODO: these get statements are the beginning of a SELECT API
						// there may be multiple assertions for a single fact/triple
						this.getAssertionsWithThisAsSubject = function() 
						{
							return _factsWithThisAsSubject;
						};
			
						// there may be multiple assertions for a single fact/triple
						this.getAssertionsWithThisAsPredicate = function() 
						{
							return _facstWithThisAsPredicate;
						};
						
						// there may be multiple assertions for a single fact/triple
						this.getAssertionsWithThisAsObject = function() 
						{
							return _factsWithThisAsObject;
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

			// _Fact is an IIFE constructor function which is private to Model
			// _Fact is an in-memory physical structure of triples (subject, predicate, object)
			// Depending on the nature of the predicate the same fact might be expressed by multiple assertions, for example
			// the fact (triple) giraffe,rdfs:subClassOf, mammal might be asserted as
			// giraffe isSubclassOfSuperclass mammal or
			// mammal isSuperclassOfSubclass giraffe
			let _Fact = 
			(
				function () 
				{
					return function(subject,predicate,object,altPredicateLabel) 
					{
						// private to each _Fact instance
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
			
						// _Fact constructor code
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

						
			_Fact.prototype = 
			{
				// public, non-privileged methods (one copy for all _Facts)
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
			
			
			// privileged methods (defined with "this.", public, unique to each Model instance, with access to private attributes and methods)
			this.addNamespace = function(prefix,URI)
			{
				if (prefix.indexOf(":") >= 0) {throw new Error("When adding a namespacePrefix, a colon is not allowed in the prefix name.  Specified prefix was " + prefix);}
				_namespaces[prefix] = URI;
			}

			this.addAssertion = function(subject,predicate,object,altPredicateLabel)
			{
				//TODO: check if assertion already exists
				let newAssertion = new _Fact(subject,predicate,object,altPredicateLabel);
				_facts.push(newAssertion);
				return newAssertion;
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


			// constructor code for Model (runs once when the object is instantiated with "new")
			// ------------------------------
		}
	}
)();

grox.Model.prototype = 
{
};


 