const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');
const path = require('node:path');
const source = fs.readFileSync(path.join(__dirname,'../dist/sprint3.js'),'utf8');
const state = {};
const ctx = vm.createContext({state,Intl,Date,console,renderUser:()=>'',root:{},campaign:{title:'VIVA'},icon:()=>'',innerScreen:(_t,b)=>b,document:{querySelectorAll:()=>[],querySelector:()=>({addEventListener(){}}),addEventListener(){} }});
vm.runInContext(source,ctx);
const run = code => vm.runInContext(code,ctx);
function reset(){Object.keys(state).forEach(k=>delete state[k]);Object.assign(state,{journeys:[],points:520,campaignProgress:2,perspective:'user'});run("demo.day='2026-09-13'")}
let id=0;
function journey(status='validated',mode='free',endedAt,segments=[{line:'D01'}]){const j={id:String(++id),mode,segments,endedAt};state.currentJourney=j;run(`finalizeJourney('${status}')`);return j}
reset();
const a=journey(), b=journey(), c=journey();
assert.equal(run('competitive()'),204);assert.equal(run("competitive('month')"),204);
assert.equal(a.recognition.ordinal,1);assert.equal(b.recognition.ordinal,2);assert.equal(c.recognition,undefined);assert.equal(state.points,520);
assert.equal(a.recognition.points,408);assert.equal(run('weeklyAwards().length'),2);
assert.match(run('renderMoveHome()'),/2\/2/);
const n=state.journeys.length;state.currentJourney=a;run("finalizeJourney('validated')");assert.equal(state.journeys.length,n);state.currentJourney=null;
run('renderResult();renderShare()');assert.equal(state.journeys.length,n);
reset();for(const status of ['inconclusive','rejected','cancelled']){const j=journey(status);assert.equal(j.impact,0);assert.equal(j.avoided,0);assert.equal(j.recognition,undefined)}
assert.equal(journey().recognition.ordinal,1);
reset();const integrated=journey('validated','free',undefined,[{line:'D01'},{line:'D02'}]);assert.equal(integrated.impact,68);assert.equal(integrated.recognition.ordinal,1);assert.equal(state.journeys.length,1);
reset();const ca=journey('validated','campaign'),cb=journey('validated','campaign'),cc=journey('validated','campaign');
assert.equal(ca.campaignEligible,true);assert.equal(cb.campaignEligible,true);assert.equal(cc.campaignEligible,false);assert.equal(run('competitive()'),204);assert.equal(state.points,532);assert.equal(state.journeys.filter(j=>j.recognition).length,0);assert.equal(journey().recognition.ordinal,1);
reset();const invalid=journey('validated','campaign',undefined,[{line:'D03'}]);assert.equal(invalid.campaignEligible,false);assert.equal(invalid.impact,68);assert.equal(state.campaignProgress,2);
reset();const sunday=journey('validated','free','2026-09-14T02:59:00Z');const monday=journey('validated','free','2026-09-14T03:00:00Z');
assert.equal(sunday.day,'2026-09-13');assert.equal(monday.day,'2026-09-14');assert.equal(sunday.recognition.ordinal,1);assert.equal(monday.recognition.ordinal,1);assert.equal(run('competitive()'),68);assert.equal(run("competitive('month')"),136);
run("demo.day='2026-09-14'");assert.equal(run('weeklyAwards().length'),1);
const delayed=journey('validated','free','2026-09-13T20:00:00-03:00');assert.equal(delayed.week,'2026-09-07');assert.equal(delayed.recognition.ordinal,2);assert.equal(run('competitive()'),68);
journey('validated','free','2026-10-01T12:00:00-03:00');assert.equal(run("competitive('month')"),204);
reset();assert.equal(run('weeklyAwards().length'),0);assert.equal(run('competitive()'),0);
console.log('Lote 3: unlimited impact, campaign cap, individual awards, integration, idempotency, invalid results and São Paulo period boundaries passed.');
