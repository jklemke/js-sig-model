// Copyright 2011,  Joe Klemke, Logica
// Distributed under GNU LESSER GENERAL PUBLIC LICENSE, http://www.gnu.org/licenses/lgpl.txt


function handleClick()
{
   
    let schema = new grox.Schema('1234567890', 'Pro JavaScript Design Patterns', 'Dustin Diaz');
    let model = new grox.Model(schema);

    model.addNamespace('rdf','http://www.w3.org/1999/02/22-rdf-syntax-ns#');
    model.addNamespace('rdfs','http://www.w3.org/2000/01/rdf-schema#');
    model.addNamespace('dc','http://purl.org/dc/elements/1.1/');
    model.addNamespace('owl','http://www.w3.org/2002/07/owl#');
    model.addNamespace('ex','http://www.example.org/');
    model.addNamespace('xsd','http://www.w3.org/2001/XMLSchema#');
    model.addNamespace('skos','http://www.w3.org/2004/02/skos/core#');
    model.addNamespace('grox','http://www.grox.info/');
    model.addNamespace('foaf','http://xmlns.com/foaf/0.1/');

    model.addSignifier('rdf:type','isA');
    model.addSignifier('skos:related','isRelatedTo');


    let r = model.getSignifier('rdf:type');
    r.log();
    var s = model.addSignifier(':Sam');
    var s = model.addSignifier(':Sam');
    s.log();
    var w = model.addSignifier('grox:Wally','Wallace');
    w.log();
    var t = model.addAxiom(':Eric','rdf:type',':Father');
    t.log();
    var b = model.getSignifier(':Eric');
    if (b) {b.log()}
    var b2 = model.getSignifier(b);
    if (b2) {b2.log()}
    var f = model.getSignifier(':Father');
    if (f) {f.log()}
    var z = model.addAxiom(':Smurf','skos:related',':Munchkin'); 
    z.log();
    var j = model.addSignifier(':Jimmy','Jimmy');
    j.log();
    var k = model.addAxiom(j,'rdf:type',':Father');
    k.log();
    var l = model.addAxiom(w,'rdf:type',f);
    l.log();    
    var m = model.addAxiom(j,':dateOfBirth','1970-07-24');
    m.log();
    var n = model.getSignifier('skos:related');
    if (n) {n.log()}

    var c = model.addAxiom(':Carmen','rdf:type',':Mother');
    c.log();

        
    console.log('Jimmy as subject ----------------------------------------');
    var jAxioms = j.getTheoremsWithThisAsSubject(); 
    jAxioms.forEach(element => {
        element.log();        
    });

    console.log('Father as object ----------------------------------------');
    var fAxioms = f.getTheoremsWithThisAsObject(); 
    fAxioms.forEach(element => {
        element.log();        
    });

    console.log('rdf:type as predicate ----------------------------------------');
    var rAxioms = r.getTheoremsWithThisAsPredicate(); 
    rAxioms.forEach(element => {
        element.log();        
    });

    // TODO: add logic in the model for each of these grox.info predicates
    // Note: grox:hasPredicate is a built in to the model
    model.addSignifier('grox:hasPredicate'); // hasPredicate disallows bidirectionality. enforces asymmetry of subject and object


    let aaaIsRed = model.addAxiom('grox:AAA','grox:hasPredicate','red'); 
    let aaa = model.getSignifier('grox:AAA');

    let bbb = model.addSignifier('grox:BBB','bob');
    let ccc = model.addSignifier('grox:CCC','carmen');
    let ddd = model.addSignifier('grox:DDD','diego');

    model.addAxiom(aaa,'grox:hasPredicate','square'); 
    model.addAxiom(ccc,'grox:hasPredicate','red'); 

    console.log('AAA as subject -------------------------------------');

    (aaa.getTheoremsWithThisAsSubject()).forEach( element => {
        element.log();
        }
    )

    console.log('red as predicate ----------------------------------------');
    // TODO: do we want functionality like this?
    var redTheorems = model.getTheoremsWithLiteralAsPredicate('red'); 
    redTheorems.forEach(element => {
        element.log();        
    });

    console.log('red as predicate, AAA as subject with alice prefLabel ---------------------------');
    aaa.setPrefLabel('alice');
    redTheorems.forEach(element => {
        element.log();        
    });



}

