// Web-only, basic opt-in measurement. Importing this file makes no network request.
export const ANALYTICS_ID='G-DG754SQQL6';
export const CONSENT_KEY='screw-workshop-analytics-consent-v1';
const PAGE='https://paulnord.github.io/screw-workshop/';
export function createAnalytics({window:win=globalThis.window,storage,native=false,enabled=true,measurementId=ANALYTICS_ID,loadTag}={}){
 let choice='unknown',generation=0,active=false,pending=Promise.resolve(),loaded=false,loadPromise=null,attempt=null,visitSent=false;
 const allowed=!!win&&!native&&enabled===true&&/^G-[A-Z0-9]+$/.test(measurementId);
 try{storage??=win?.localStorage;const value=storage?.getItem(CONSENT_KEY);if(value==='granted'||value==='denied')choice=value}catch{}
 function command(...args){try{win.gtag(...args);return true}catch{return false}}
 const safePage={page_location:PAGE,page_referrer:'',page_title:'Screw Workshop'};
 function track(name,params={}){
  if(!allowed||choice!=='granted'||!active)return false;
  let clean;
  if(name==='page_view')clean={...safePage};
  else if(name==='sign_up'||name==='login')clean={method:'password'};
  else if((name==='level_start'||name==='level_end')&&['campaign','daily','practice'].includes(params?.game_mode))clean={game_mode:params.game_mode,...(name==='level_end'?{success:true}:{})};
  else return false;
  return command('event',name,{...clean,...safePage,send_to:measurementId});
 }
 function disable(){active=false;if(win)win['ga-disable-'+measurementId]=true}
 async function initialize(token){
  if(!allowed||choice!=='granted')return;
  try{
   if(!loaded&&!loadPromise){
    win.dataLayer=win.dataLayer||[];
    win.gtag=function(){win.dataLayer.push(arguments)};
    // Queue defaults before loading Google code. Advertising remains denied.
    command('consent','default',{analytics_storage:'granted',ad_storage:'denied',ad_user_data:'denied',ad_personalization:'denied'});
    const loader=loadTag||(()=>new Promise((resolve,reject)=>{const s=win.document.createElement('script');s.async=true;s.referrerPolicy='no-referrer';s.src='https://www.googletagmanager.com/gtag/js?id='+encodeURIComponent(measurementId);s.onload=resolve;s.onerror=()=>reject(Error('Analytics unavailable'));win.document.head.append(s)}));
    loadPromise=Promise.resolve().then(()=>loader(measurementId)).then(()=>{loaded=true}).catch(error=>{loadPromise=null;throw error});
   }
   if(loadPromise)await loadPromise;
   if(token!==generation||choice!=='granted')return;
   win['ga-disable-'+measurementId]=false;
   command('js',new Date());
   command('config',measurementId,{...safePage,send_page_view:false,allow_google_signals:false,allow_ad_personalization_signals:false,cookie_prefix:'screw_workshop',cookie_path:'/screw-workshop/',cookie_expires:60*60*24*30,cookie_update:false});
   active=true;if(!visitSent){visitSent=track('page_view')}
  }catch{if(token===generation)disable()}
 }
 function choose(value){
  if(value!=='granted'&&value!=='denied')return Promise.resolve();
  if(value===choice&&active)return pending;
  choice=value;generation++;disable();
  try{storage?.setItem(CONSENT_KEY,value)}catch{}
  pending=value==='granted'?initialize(generation):Promise.resolve();return pending;
 }
 disable();if(choice==='granted')pending=initialize(generation);
 return {consent:()=>choice,ready:()=>pending,choose,track,
  newAttempt(mode){attempt={mode,started:false,finished:false,trackedGeneration:null}},
  firstMove(){if(!attempt||attempt.started)return;attempt.started=true;if(track('level_start',{game_mode:attempt.mode}))attempt.trackedGeneration=generation},
  completeAttempt(){if(!attempt||!attempt.started||attempt.finished)return;attempt.finished=true;if(attempt.trackedGeneration===generation)track('level_end',{game_mode:attempt.mode})}
 };
}
