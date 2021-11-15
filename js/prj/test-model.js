// Copyright 2011,  Joe Klemke, Logica
// Distributed under GNU LESSER GENERAL PUBLIC LICENSE, http://www.gnu.org/licenses/lgpl.txt


function handleClick()
{   
  // TODO: reverse this, pass the schema to the model
  let signature = new grox.Signature();
//  let model = new grox.Model();

  // TODO: add logic in the model for each of these default namespaces
  signature.addNamespace('grox','http://www.grox.info/');
  signature.addSignifier('grox:hasPredicate'); // hasPredicate disallows bidirectionality. enforces asymmetry of subject and object

  signature.addNamespace('rdf','http://www.w3.org/1999/02/22-rdf-syntax-ns#');
  signature.addNamespace('rdfs','http://www.w3.org/2000/01/rdf-model#');
  signature.addNamespace('dc','http://purl.org/dc/elements/1.1/');
  signature.addNamespace('owl','http://www.w3.org/2002/07/owl#');
  signature.addNamespace('ex','http://www.example.org/');
  signature.addNamespace('xsd','http://www.w3.org/2001/XMLmodel#');
  signature.addNamespace('skos','http://www.w3.org/2004/02/skos/core#');
  signature.addNamespace('grox','http://www.grox.info/');
  signature.addNamespace('foaf','http://xmlns.com/foaf/0.1/');

  let sigType = signature.getSignifierTypeEnum();
  console.log(sigType);
  console.log(signature.getSignifierTypeEnum());
  console.log(sigType.COPULATIVE);
  
  signature.addSignifier('rdf:type','isA', sigType.COPULATIVE);
  
  signature.addSignifier('skos:related','isRelatedTo');

  let r = signature.getSignifier('rdf:type');
  r.log();
  let s = signature.addSignifier(':Sam');
  s.log();
  let w = signature.addSignifier('grox:Wally','Wallace');
  w.log();
  let t = signature.addAxiom(':Eric','rdf:type',':Father');
  t.log();
  let b = signature.getSignifier(':Eric');
  if (b) {b.log()}
  let b2 = signature.getSignifier(b);
  if (b2) {b2.log()}
  let f = signature.getSignifier(':Father');
  if (f) {f.log()}
  let z = signature.addAxiom(':Smurf','skos:related',':Munchkin'); 
  z.log();
  let j = signature.addSignifier(':Jimmy','Jimmy');
  j.log();
  let k = signature.addAxiom(j,'rdf:type',':Father');
  k.log();
  let l = signature.addAxiom(w,'rdf:type',f);
  l.log();    
  let m = signature.addAxiom(j,':dateOfBirth','1970-07-24');
  m.log();
  let n = signature.getSignifier('skos:related');
  if (n) {n.log()}

  let c = signature.addAxiom(':Carmen','rdf:type',':Mother');
  c.log();

      
  console.log('Jimmy as subject ----------------------------------------');
  let jAxioms = j.getAxiomsWithThisAsNominative(); 
  jAxioms.forEach(element => {
      element.log();        
  });

  console.log('Father as object ----------------------------------------');
  let fAxioms = f.getAxiomsWithThisAsAttributative(); 
  fAxioms.forEach(element => {
      element.log();        
  });

  console.log('rdf:type as predicate ----------------------------------------');
  let rAxioms = r.getAxiomsWithThisAsCopulative(); 
  rAxioms.forEach(element => {
      element.log();        
  });


  let aaaIsRed = signature.addAxiom('grox:AAA','grox:hasPredicate','red'); 
  let aaa = signature.getSignifier('grox:AAA');

  let bbb = signature.addSignifier('grox:BBB','bob');
  let ccc = signature.addSignifier('grox:CCC','carmen');
  let ddd = signature.addSignifier('grox:DDD','diego');

  signature.addAxiom(aaa,'grox:hasPredicate','square'); 
  signature.addAxiom(ccc,'grox:hasPredicate','red'); 

  console.log('AAA as nominative -------------------------------------');

  (aaa.getAxiomsWithThisAsNominative()).forEach( element => {
      element.log();
      }
  )

  console.log('red as copulative ----------------------------------------');
  let redAxioms = signature.getAxiomsWithLiteralAsAttributative('red'); 
  redAxioms.forEach(element => {
      element.log();        
  });

  console.log('red as attribute, AAA as nominative with alice prefLabel ---------------------------');
  aaa.setPrefLabel('alice');
  redAxioms.forEach(element => {
      element.log();        
  });

  console.log(signature.signifierType);

}

