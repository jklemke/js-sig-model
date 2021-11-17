// Copyright 2011,  Joe Klemke, Logica
// Distributed under GNU LESSER GENERAL PUBLIC LICENSE, http://www.gnu.org/licenses/lgpl.txt


function testGrammar()
{
	let signature = new grox.Signature();
	let grammar = new grox.Grammar(signature);

	grammar.logSignifier("rdf:type");
	grammar.logSignifier("grox:hasTrait");
	grammar.logSignifier("grox:iT4tYHw9xJVf65egdT1hOtNu");
	grammar.logSignifier("partWrtGen");

	grammar.logSignifier("grox:iT4tYHw9xJVf65egdT1hOtNu");
	grammar.logSignifier("grox:Fy28scb0taxYGdYeexBx3365");
	grammar.logSignifier("grox:LY41ZUMrKdPh9G3w6b2rxFUY");
	grammar.logSignifier("grox:QT64ORWiazZEsiU9k2pfhDUf");
	grammar.logSignifier("grox:QQ46Ef5vecHgr6ctohqU1pTo ");
	grammar.logSignifier("grox:Wb4bglkQ9PrEt3C7y0YCOqpA");
	grammar.logSignifier("grox:Kr7rkKhBHnxEo2OIddayrxZr");
	grammar.logSignifier("grox:SW6KX6Y8QRKPpzEoJYoAD4Ya");
	grammar.logSignifier("grox:Ov4ItKWDuLMVUAlrbDfgBXkW");
	grammar.logSignifier("grox:WW6JqN8iMmQcvwrRYxDub7N7");
	grammar.logSignifier("grox:VW4TIqnPANbf73SKLB1pXWr0");
	grammar.logSignifier("grox:mi1vJ1s5GHf2dD8lswGIyddE");

}



