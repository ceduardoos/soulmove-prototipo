const fs=require('fs'),vm=require('vm'),assert=require('node:assert/strict');
const state={perspective:'business',journeys:[],businessZone:'all',campaignStatus:'active',reservation:0};
const listeners={};const document={querySelectorAll:()=>[],querySelector:()=>({addEventListener(){}}),addEventListener:(name,fn)=>(listeners[name]||=[]).push(fn)};
const ctx=vm.createContext({state,document,Intl,Date,console,root:{},renderUser:()=>'',icon:()=>'<svg></svg>',innerScreen:(_t,b)=>b,escapeHtml:s=>s.replaceAll('<','&lt;'),campaign:{title:'Sua jornada vale mais'},clearJourneyTimers(){},showToast(){}});
for(const f of ['sprint3.js','business.js'])vm.runInContext(fs.readFileSync(__dirname+'/../dist/'+f,'utf8'),ctx);
for(const page of ['home','ads','wallet','points','companies','play','create','move']){state.businessPage=page;const html=vm.runInContext('renderBusiness()',ctx);assert.match(html,/sb-header/);assert.match(html,/sb-sidebar/);assert.ok(!html.includes('undefined'));}
state.businessPage='move';for(const view of ['overview','config','closing']){state.businessView=view;assert.match(vm.runInContext('renderBusiness()',ctx),/Campanhas \/ SoulMove/)}
state.businessPage='create';for(let i=1;i<=4;i++){state.sbStep=i;assert.ok(vm.runInContext('renderBusiness()',ctx).includes(`Passo ${i}/4`))}
for(const modal of ['credit','recharge','distribute']){state.sbModal=modal;assert.match(vm.runInContext('renderBusiness()',ctx),/role="dialog"/)}
state.sbModal=null;state.businessPage='home';const before=JSON.stringify(state);vm.runInContext('renderBusiness()',ctx);assert.equal(JSON.stringify(state),before);
console.log('Business: all pages, four ad steps, three SoulMove views, dialogs and read-only rendering passed.');
