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
    
    model.addSignifier('rdf:type','isA');

    let r = model.getSignifier('rdf:type');
    r.display();
    var s = model.addSignifier(':Sam');
    var s = model.addSignifier(':Sam');
    s.display();
    var w = model.addSignifier('grox:Wally','Wallace');
    w.display();
    var t = model.addTriple(':Bob','rdf:type',':Father');
    t.display();
    var b = model.getSignifier(':Bob');
    if (b) {b.display()}
    var b2 = model.getSignifier(b);
    if (b2) {b2.display()}
    var f = model.getSignifier(':Father');
    if (f) {f.display()}
    var z = model.addTriple(':Smurf','skos:related',':Munchkin');
    z.display();
    var j = model.addSignifier(':Jimmy','Jimmy');
    j.display();
    var k = model.addTriple(j,'rdf:type',':Father');
    k.display();
    var l = model.addTriple(w,'rdf:type',f);
    l.display();    
}

