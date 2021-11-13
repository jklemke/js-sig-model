// Copyright 2011,  Joe Klemke, Logica
// Distributed under GNU LESSER GENERAL PUBLIC LICENSE, http://www.gnu.org/licenses/lgpl.txt


function handleClick()
{   
  // TODO: reverse this, pass the schema to the model
  let model = new grox.Model();
  let schema = new grox.Schema(model);

  // TODO: add logic in the model for each of these default namespaces
  schema.addNamespace('grox','http://www.grox.info/');
  schema.addSignifier('grox:hasPredicate'); // hasPredicate disallows bidirectionality. enforces asymmetry of subject and object

  schema.addNamespace('rdf','http://www.w3.org/1999/02/22-rdf-syntax-ns#');
  schema.addNamespace('rdfs','http://www.w3.org/2000/01/rdf-model#');
  schema.addNamespace('dc','http://purl.org/dc/elements/1.1/');
  schema.addNamespace('owl','http://www.w3.org/2002/07/owl#');
  schema.addNamespace('ex','http://www.example.org/');
  schema.addNamespace('xsd','http://www.w3.org/2001/XMLmodel#');
  schema.addNamespace('skos','http://www.w3.org/2004/02/skos/core#');
  schema.addNamespace('grox','http://www.grox.info/');
  schema.addNamespace('foaf','http://xmlns.com/foaf/0.1/');

  schema.addSignifier('rdf:type','isA');
  schema.addSignifier('skos:related','isRelatedTo');


  let r = schema.getSignifier('rdf:type');
  r.log();
  let s = schema.addSignifier(':Sam');
  s.log();
  let w = schema.addSignifier('grox:Wally','Wallace');
  w.log();
  let t = schema.addAxiom(':Eric','rdf:type',':Father');
  t.log();
  let b = schema.getSignifier(':Eric');
  if (b) {b.log()}
  let b2 = schema.getSignifier(b);
  if (b2) {b2.log()}
  let f = schema.getSignifier(':Father');
  if (f) {f.log()}
  let z = schema.addAxiom(':Smurf','skos:related',':Munchkin'); 
  z.log();
  let j = schema.addSignifier(':Jimmy','Jimmy');
  j.log();
  let k = schema.addAxiom(j,'rdf:type',':Father');
  k.log();
  let l = schema.addAxiom(w,'rdf:type',f);
  l.log();    
  let m = schema.addAxiom(j,':dateOfBirth','1970-07-24');
  m.log();
  let n = schema.getSignifier('skos:related');
  if (n) {n.log()}

  let c = schema.addAxiom(':Carmen','rdf:type',':Mother');
  c.log();

      
  console.log('Jimmy as subject ----------------------------------------');
  let jAxioms = j.getAxiomsWithThisAsSubject(); 
  jAxioms.forEach(element => {
      element.log();        
  });

  console.log('Father as object ----------------------------------------');
  let fAxioms = f.getAxiomsWithThisAsObject(); 
  fAxioms.forEach(element => {
      element.log();        
  });

  console.log('rdf:type as predicate ----------------------------------------');
  let rAxioms = r.getAxiomsWithThisAsPredicate(); 
  rAxioms.forEach(element => {
      element.log();        
  });


  let aaaIsRed = schema.addAxiom('grox:AAA','grox:hasPredicate','red'); 
  let aaa = schema.getSignifier('grox:AAA');

  let bbb = schema.addSignifier('grox:BBB','bob');
  let ccc = schema.addSignifier('grox:CCC','carmen');
  let ddd = schema.addSignifier('grox:DDD','diego');

  schema.addAxiom(aaa,'grox:hasPredicate','square'); 
  schema.addAxiom(ccc,'grox:hasPredicate','red'); 

  console.log('AAA as subject -------------------------------------');

  (aaa.getAxiomsWithThisAsSubject()).forEach( element => {
      element.log();
      }
  )

  console.log('red as predicate ----------------------------------------');
  let redTheorems = schema.getAxiomsWithLiteralAsObject('red'); 
  redTheorems.forEach(element => {
      element.log();        
  });

  console.log('red as predicate, AAA as subject with alice prefLabel ---------------------------');
  aaa.setPrefLabel('alice');
  redTheorems.forEach(element => {
      element.log();        
  });

}
