const { Signature } = require('../prj/signature');

describe("new Signature()", ()=> {
	test("addNamespace()", ()=> {
		expect(new Signature().addNamespace('grox','http://www.grox.info/') );
	});
	test("getEnum()", ()=> {
		expect(new Signature().getSignifierParticipationEnum() );
	});
});


