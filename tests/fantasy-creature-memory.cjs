const test=require('node:test');
const assert=require('node:assert/strict');
const memory=require('../public/paintfall-animal-memory.js');

test('a wild creature may decline a pet and remembers the encounter',()=>{
 let m=memory.remember(undefined,'offer-pet',1000);
 assert.equal(m.lastPetAccepted,false);
 assert.equal(m.pets||0,0);
 m=memory.remember(m,'pet',1200);
 assert.equal(m.lastPetAccepted,false);
 assert.equal(m.pets||0,0);
 m=memory.remember(m,'talk',2000);
 m=memory.remember(m,'offer-pet',3000);
 assert.equal(m.lastPetAccepted,true);
 m=memory.remember(m,'pet',3100);
 assert.equal(m.pets,1);
 assert.ok(m.bond>0);
});

test('pet consent expires and a new visit does not invent a pet',()=>{
 let m=memory.remember(undefined,'talk',1000);
 m=memory.remember(m,'offer-pet',2000);
 assert.equal(m.lastPetAccepted,true);
 m=memory.remember(m,'pet',20000);
 assert.equal(m.pets||0,0);
 assert.equal(m.lastPetAccepted,false);
});

test('paint hits must be apologized for before accepting a pet',()=>{
 let m=memory.remember(undefined,'talk',1000);
 m=memory.remember(m,'paint-hit',2000);
 m=memory.remember(m,'offer-pet',3000);
 assert.equal(m.lastPetAccepted,false);
 m=memory.remember(m,'apologize',4000);
 m=memory.remember(m,'offer-pet',5000);
 assert.equal(m.lastPetAccepted,true);
});
