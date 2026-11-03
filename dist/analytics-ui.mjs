// Optional browser-level consent, shared by onboarding and account details.
export function installAnalyticsUI({analytics,enabled,native=false,document:doc=globalThis.document,window:win=globalThis.window}){
 if(native||!enabled)return;
 const panel=doc.createElement('section');panel.className='analytics-choice';panel.setAttribute('aria-label','Optional usage analytics');
 const disclosure='<details><summary>What is shared?</summary><p>Google Analytics counts visits, puzzle starts and finishes, and successful sign-ups and logins. It uses browser cookies and sends device and usage data to Google. We do not send your email, account ID, or saved scores. No ads or cross-device identity linking.</p><p>Your choice stays in this browser. Analytics cookies expire after 30 days. <a href="https://policies.google.com/privacy" target="_blank" rel="noopener noreferrer">Google’s privacy policy</a></p></details>';
 panel.innerHTML='<h2>Optional diagnostics</h2><p>Help improve the game with Google Analytics. Off unless you allow it; you can play or create an account either way.</p>'+disclosure+'<div class="analytics-actions"><button data-analytics="denied">No thanks</button><button data-analytics="granted">Allow diagnostics</button></div><p data-analytics-status role="status"></p>';
 const settings=doc.createElement('button');settings.id='analytics-settings';settings.textContent='Privacy';settings.setAttribute('aria-label','Privacy and diagnostics');doc.querySelector('.header-actions').append(settings);doc.querySelector('main').insertBefore(panel,doc.querySelector('.game'));
 let accountInput=null;
 const status=panel.querySelector('[data-analytics-status]');
 function clearCookies(){try{for(const item of doc.cookie.split(';')){const name=item.trim().split('=')[0];if(!/^screw_workshop_ga(?:_|$)/.test(name))continue;for(const path of ['/screw-workshop/'])for(const domain of ['',win.location.hostname,'.'+win.location.hostname])doc.cookie=name+'=; Max-Age=0; path='+path+(domain?'; domain='+domain:'')+'; SameSite=Lax'}}catch{}}
 async function choose(value){const previous=analytics.consent();const pending=analytics.choose(value);panel.hidden=true;if(accountInput)accountInput.checked=value==='granted';if(value==='denied'){clearCookies();if(previous==='granted'){win.location.reload();return}}await pending;status.textContent='Your choice is saved.'}
 panel.querySelectorAll('[data-analytics]').forEach(button=>button.onclick=()=>{void choose(button.dataset.analytics)});
 panel.hidden=analytics.consent()!=='unknown';settings.onclick=()=>{panel.hidden=!panel.hidden;if(!panel.hidden){status.textContent=analytics.consent()==='granted'?'Analytics allowed. Choose No thanks to withdraw consent.':'Analytics is off unless you allow it.';panel.scrollIntoView({block:'nearest'});panel.querySelector('button').focus()}};
 win.addEventListener('storage',event=>{if(event.key!==null&&event.key!=='screw-workshop-analytics-consent-v1')return;if(event.newValue!=='granted'){void choose('denied')}else{void analytics.choose('granted');panel.hidden=true;if(accountInput)accountInput.checked=true}});
 return {mountAccount(host){
  host.innerHTML='<section class="account-diagnostics" aria-label="Optional diagnostics"><label><input type="checkbox" data-diagnostics><span>Allow diagnostics <small>(optional)</small></span></label><p>Share device and game usage data with Google Analytics. Saved immediately in this browser. Not required to create an account or play. Change this here or in Privacy anytime.</p>'+disclosure+'</section>';
  accountInput=host.querySelector('[data-diagnostics]');accountInput.checked=analytics.consent()==='granted';
  accountInput.onchange=()=>{void choose(accountInput.checked?'granted':'denied')};
 }};
}
