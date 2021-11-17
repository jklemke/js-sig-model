// Copyright 2011,  Joe Klemke, Logica
// Distributed under GNU LESSER GENERAL PUBLIC LICENSE, http://www.gnu.org/licenses/lgpl.txt


function testGrammar()
{
	let signature = new grox.Signature();
	let grammar = new grox.Grammar(signature);

	grammar.logSignifier("rdf:type");
	grammar.logSignifier("grox:hasTrait");

}



