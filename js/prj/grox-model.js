// Copyright 2021,  Joe Klemke, GROX LLC
// Distributed under GNU LESSER GENERAL PUBLIC LICENSE, http://www.gnu.org/licenses/lgpl.txt

// top level namespace
var grox = grox || {};

// this is a reference to a function, so can be used with "new"
grox.Model = 
(
	// anonymous IIFE function that is called once after the code is parsed, to define the static attributes and methods, and to return the constructor function
	function(schema) 
	{
		// private static attribute (defined once and shared by all Model objects)
		let _numModels = 0;

		// private static method (defined once and shared by all Model objects)

		// the actual, anonymous constructor function which gets invoked by "new Model()"
		return function(schema, newIsbn, newTitle, newAuthor) 
		{
			// private attributes, unique to each Model instance
      let _modelIndex;
      let _schema;

			// private methods, unique to each Model instance, with access to private attributes and methods
			function _isTypeOfSchema(schema)
			{
        if (
          schema == undefined ||
          typeof schema != "object" ||
          schema.addNamespace == undefined || 
          schema.addSignifier == undefined || 
          schema.getSignifier == undefined ||
          schema.addAxiom == undefined ||
          schema.getAxiomsWithLiteralAsPredicate == undefined
        )
        {
					return false;
				} 
				else 
				{
					return true;
				}
			}

			// "this" defines a privileged method which is public, unique to each object instance, with access to private attributes and methods
      // TODO: the basic idea is for a model to manipulate a schema 
      // so model needs the public methods of schema, which are
      this.addNamespace = function()
      {
        return _schema.addNamespace(prefix, URI);
      }

      this.addSignifier = function(QName, prefLabel)
      {
        return _schema.addSignifier(QName, prefLabel);
      }

      this.getSignifier = function(signifierId)
      {
        return _schema.getSignifier(signifierId);
      }

      this.addAxiom = function(subject, predicate, object, altPredicateLabel)
      {
        return _schema.addAxiom(subject, predicate, object, altPredicateLabel);        
      }

      this.getAxiomsWithLiteralAsPredicate = function(literal)
      {
        _schema.getAxiomsWithLiteralAsPredicate(literal);        
      }

			// constructor code for Model, which runs once when the object is instantiated with "new Model()"
      _modelIndex = _numModels; // the index for this particular model instance
      _numModels++; // private static attribute keeps track of how many Models have been instantiated
			if(_numModels > 5) {throw new Error('Model: Only 5 instances of Model can be created.');}
      if (_isTypeOfSchema(schema)) {_schema = schema;}
		}
	}
)();

// when "new" is called, a copy of the prototype is created, and the constructor code is run on it
grox.Model.prototype = 
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
  logAxiomsWithSubject: function(signifierId) 
  {
    let signifier = this.getSignifier(signifierId);
    if (signifier) 
    {
      let axioms = signifier.getAxiomsWithThisAsSubject(); 
      axioms.forEach(element => {
          element.log();        
      });    
    }
  }
  ,
  logAxiomsWithPredicate: function(signifierId) 
  {
    let signifier = this.getSignifier(signifierId);
    if (signifier) 
    {
      let axioms = signifier.getAxiomsWithThisAsPredicate(); 
      axioms.forEach(element => {
          element.log();        
      });    
    }
  }
  ,
  logAxiomsWithObject: function(signifierId) 
  {
    let signifier = this.getSignifier(signifierId);
    if (signifier) 
    {
      let axioms = signifier.getAxiomsWithThisAsObject(); 
      axioms.forEach(element => {
          element.log();        
      });    
    }
  }
  ,
  logAxiomsWithLiteralAsObject: function(literal) 
	{
    let axioms = this.getAxiomsWithLiteralAsObject(literal);
    if (axioms) 
    {
      axioms.forEach(element => {
        element.log();        
      });  
    }
	}

};
