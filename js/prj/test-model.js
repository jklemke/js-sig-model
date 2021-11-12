// Copyright 2011,  Joe Klemke, Logica
// Distributed under GNU LESSER GENERAL PUBLIC LICENSE, http://www.gnu.org/licenses/lgpl.txt


function handleClick()
{
    model = new grox.Model();
    model.addNamespace('rdf','http://www.w3.org/1999/02/22-rdf-syntax-ns#');
    model.addNamespace('rdfs','http://www.w3.org/2000/01/rdf-schema#');
    model.addNamespace('dc','http://purl.org/dc/elements/1.1/');
    model.addNamespace('owl','http://www.w3.org/2002/07/owl#');
    model.addNamespace('ex','http://www.example.org/');
    model.addNamespace('xsd','http://www.w3.org/2001/XMLSchema#');
    model.addNamespace('skos','http://www.w3.org/2004/02/skos/core#');
    model.addNamespace('grox','http://www.grox.info/');
    
    model.addSignifier('rdf:type','isSpecimenOfSpecies');
    model.addSignifier('skos:related','isRelatedTo');

    let r = model.getSignifier('rdf:type');
    r.log();
    var s = model.addSignifier(':Sam');
    var s = model.addSignifier(':Sam');
    s.log();
    var w = model.addSignifier('grox:Wally','Wallace');
    w.log();
    var t = model.addAssertion(':Bob','rdf:type',':Father');
    t.log();
    var b = model.getSignifier(':Bob');
    if (b) {b.log()}
    var b2 = model.getSignifier(b);
    if (b2) {b2.log()}
    var f = model.getSignifier(':Father');
    if (f) {f.log()}
    var z = model.addAssertion(':Smurf','skos:related',':Munchkin'); 
    z.log();
    var j = model.addSignifier(':Jimmy','Jimmy');
    j.log();
    var k = model.addAssertion(j,'rdf:type',':Father');
    k.log();
    var l = model.addAssertion(w,'rdf:type',f);
    l.log();    
    var m = model.addAssertion(j,':dateOfBirth','1970-07-24');
    m.log();
    var n = model.getSignifier('skos:related');
    if (n) {n.log()}
    var o = model.getSignifier(':dateOfBirth');
    if (o) {o.log()}
        
    var jAssertions = j.getAssertionsWithThisAsSubject(); 
    jAssertions.forEach(element => {
        element.log();        
    });
    
}

