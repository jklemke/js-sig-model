const { util } = require('../prj/util');
const { Signature } = require('../prj/signature');
const { Grammar } = require('../prj/grammar');

describe("new Signature()", ()=> {
	test("initialize", ()=> {
		expect(new Signature());
	});
	test("getEnum()", ()=> {
//		expect(new Grammar(new Signature()).logSignifier("rdf:type") );
		expect(new Grammar(new Signature()));
	});
});

/*
let signature = new grox.Signature();
let grammar = new grox.Grammar(signature);
grammar.logSignifier("rdf:type");
*/