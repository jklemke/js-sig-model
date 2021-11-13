// Copyright 2021,  Joe Klemke, GROX LLC
// Distributed under GNU LESSER GENERAL PUBLIC LICENSE, http://www.gnu.org/licenses/lgpl.txt

// top level namespace
var grox = grox || {};

// this is a reference to a function, so can be used with "new"
grox.Schema = 
(
	// anonymous IIFE function that is called once after the code is parsed, to define the static attributes and methods, and to return the constructor function
	function() 
	{
		// private static attribute (defined once and shared by all Schema objects)
		let numSchemas = 0;

		// private static method (defined once and shared by all Schema objects)
		function checkIsbn(isbn)
		{
			if(isbn == undefined || typeof isbn != 'string') 
			{
				return false;
			}

			return true;
		}

		// the actual, anonymous constructor function which gets invoked by "new Schema()"
		return function(newIsbn, newTitle, newAuthor) 
		{
			// private attributes, unique to each Schema instance
			let _isbn;
			let _title;
			let _author;

			// private methods, unique to each Schema instance, with access to private attributes and methods
			function _privateMethod()
			{
			}

			// "this" defines a privileged method which is public, unique to each object instance, with access to private attributes and methods
			this.getIsbn = function() 
			{
				return _isbn;
			};
			this.setIsbn = function(newIsbn) 
			{
				if(!checkIsbn(newIsbn)) throw new Error('Schema: Invalid ISBN.');
				_isbn = newIsbn;
			};

			this.getTitle = function() 
			{
				return _title;
			};
			this.setTitle = function(newTitle) 
			{
				_title = newTitle || 'No title specified';
			};

			this.getAuthor = function() 
			{
				return _author;
			};
			this.setAuthor = function(newAuthor) 
			{
				_author = newAuthor || 'No author specified';
			};

			// constructor code for Schema, which runs once when the object is instantiated with "new Schema()"
			numSchemas++; // private static attribute keeps track of how many Schemas
			if(numSchemas > 5) throw new Error('Schema: Only 5 instances of Schema can be created.');
			this.setIsbn(newIsbn);
			this.setTitle(newTitle);
			this.setAuthor(newAuthor);
		}
	}
)();

// when "new" is called, a copy of the prototype is created, and the constructor code is run on it
grox.Schema.prototype = 
{
	// public attributes (shared initially for reading, but unique to an object if set at the object level)
	color: 'red',
	
	// public, non-privileged methods (one copy for all objects, used with "this" to call object-specific methods and attributes, but has no access to private attributes or methods)
	log: function() 
	{
		console.log('Title: ' + this.getTitle() + '\nAuthor: ' + this.getAuthor() + '\nColor: ' + this.color);
	}
};

// public static method (no access to private data, just using Schema as a namespace)
grox.Schema.convertToTitleCase = function(inputString) 
{
	alert('Schema.convertToTitleCase output:' + inputString);
};

