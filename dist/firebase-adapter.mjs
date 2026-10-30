// Optional Firebase boundary. No SDK request occurs on import. Call only after an
// explicit Account action and a verified deployment config. App uses its own UID
// scoped pending queue; Firestore transactions deliberately require connectivity.
export const FIREBASE_SDK_VERSION='13.1.0';
const fields=['schema','kind','puzzleId','revision','bestMoves','completed'];
const configKeys=['apiKey','authDomain','projectId','appId'];
export function isFirebaseConfigured(config){
 const c=config?.firebase;
 return config?.enabled===true&&!!c&&configKeys.every(k=>typeof c[k]==='string'&&c[k].length>0)&&
 /^[a-z][a-z0-9-]{4,62}$/.test(c.projectId)&&/^[a-z0-9.-]+$/.test(c.authDomain)&&
 !configKeys.some(k=>/placeholder|replace.?me|your[-_ ]/i.test(c[k]));
}
function cleanRecord(value){
 if(!value||typeof value!=='object'||Array.isArray(value)||Object.keys(value).some(k=>!fields.includes(k)&&k!=='updatedAt')||value.schema!==1||!['campaign','daily'].includes(value.kind)||!(/^[a-z0-9-]{1,96}$/).test(value.puzzleId)||!(/^[a-zA-Z0-9_-]{1,96}$/).test(value.revision)||!Number.isInteger(value.bestMoves)||value.bestMoves<1||value.bestMoves>100000||value.completed!==true)throw Error('Invalid progress record');
 return Object.fromEntries(fields.map(k=>[k,value[k]]));
}
const recordKey=r=>`${r.kind}__${r.puzzleId}__${r.revision}`;
async function loadFirebaseSDK(){
 const root=`https://www.gstatic.com/firebasejs/${FIREBASE_SDK_VERSION}/`;
 const [app,auth,firestore]=await Promise.all([import(root+'firebase-app.js'),import(root+'firebase-auth.js'),import(root+'firebase-firestore.js')]);
 return {...app,...auth,...firestore};
}
export async function createFirebaseAdapter({config,loadSDK=loadFirebaseSDK}={}){
 if(!isFirebaseConfigured(config))throw Error('Account sync is not configured');
 const sdk=await loadSDK();
 const app=sdk.initializeApp(config.firebase,'screw-workshop-progress');
 const auth=sdk.getAuth(app);
 // Tab/session scoped credentials, never a custom stored password/token.
 await sdk.setPersistence(auth,sdk.browserSessionPersistence);
 const db=sdk.initializeFirestore(app,{localCache:sdk.memoryLocalCache()});
 let epoch=0,lastUID=auth.currentUser?.uid??null,destructive=false,authBusy=false;
 const observers=new Set(),writes=new Set();
 const publicUser=()=>auth.currentUser?{uid:auth.currentUser.uid,email:auth.currentUser.email??'',emailVerified:!!auth.currentUser.emailVerified}:null;
 sdk.onAuthStateChanged(auth,()=>{const uid=auth.currentUser?.uid??null;if(uid!==lastUID){lastUID=uid;epoch++}for(const cb of observers)cb(publicUser())});
 function guard(uid,token=epoch){if(!uid||auth.currentUser?.uid!==uid||token!==epoch)throw Error('Account changed; operation canceled');}
 function writable(uid,token=epoch){guard(uid,token);if(destructive)throw Error('Account deletion is in progress');}
 async function authAction(fn){if(authBusy||destructive)throw Error('Another account action is in progress');authBusy=true;epoch++;try{return await fn()}finally{authBusy=false}}
 function collection(uid){return sdk.collection(db,'users',uid,'progress')}
 function control(uid){return sdk.doc(db,'users',uid,'control','account')}
 async function readAll(uid){const token=epoch;guard(uid,token);const snap=await sdk.getDocsFromServer(collection(uid));guard(uid,token);return snap.docs.map(d=>{const r=cleanRecord(d.data());if(d.id!==recordKey(r))throw Error('Progress identity mismatch');return r})}
 async function writeBest(uid,value){
 const token=epoch;writable(uid,token);const incoming=cleanRecord(value),key=recordKey(incoming),ref=sdk.doc(db,'users',uid,'progress',key);
 const result=await sdk.runTransaction(db,async tx=>{
  writable(uid,token);const flag=await tx.get(control(uid));writable(uid,token);if(flag.exists())throw Error('Account deletion has started; retry deletion to finish');const snap=await tx.get(ref);writable(uid,token);
  let best=incoming;
  if(snap.exists()){const previous=cleanRecord(snap.data());if(recordKey(previous)!==key)throw Error('Progress identity mismatch');best={...incoming,bestMoves:Math.min(previous.bestMoves,incoming.bestMoves)};if(best.bestMoves===previous.bestMoves)return previous}
  tx.set(ref,{...best,updatedAt:sdk.serverTimestamp()});return best;
 });guard(uid,token);return result;
 }
 function putBest(uid,value){const promise=writeBest(uid,value);writes.add(promise);promise.then(()=>writes.delete(promise),()=>writes.delete(promise));return promise}
 async function reauthenticate(uid,password){
  guard(uid);if(typeof password!=='string'||!password)throw Error('Enter your password to confirm deletion');
  const token=epoch,user=auth.currentUser;if(!user.email)throw Error('Email/password account required');
  const credential=sdk.EmailAuthProvider.credential(user.email,password);
  await sdk.reauthenticateWithCredential(user,credential);guard(uid,token);return {user,token};
 }
 async function purge(uid,token){
  // Query each fresh page from server; no background persistence or queued batch.
  for(;;){guard(uid,token);const snap=await sdk.getDocsFromServer(sdk.query(collection(uid),sdk.limit(400)));guard(uid,token);if(!snap.docs.length)return;
   const batch=sdk.writeBatch(db);for(const d of snap.docs)batch.delete(d.ref);guard(uid,token);await batch.commit();guard(uid,token);
  }
 }
 async function remove(password,account){
  if(authBusy||destructive)throw Error('Another account action is in progress');
  destructive=true;const uid=auth.currentUser?.uid;
  try{const {user,token}=await reauthenticate(uid,password);if(account){await sdk.runTransaction(db,async tx=>{guard(uid,token);const flag=await tx.get(control(uid));guard(uid,token);if(!flag.exists())tx.set(control(uid),{deleting:true,updatedAt:sdk.serverTimestamp()})});guard(uid,token)}await Promise.allSettled([...writes]);guard(uid,token);await purge(uid,token);if(account){guard(uid,token);await sdk.deleteUser(user)}return {uid,deletedAccount:account}}
  finally{destructive=false}
 }
 return {
  currentUser:publicUser,
  onAuth(callback){if(typeof callback!=='function')throw Error('Auth callback required');observers.add(callback);callback(publicUser());return()=>observers.delete(callback)},
  signIn:(email,password)=>authAction(()=>sdk.signInWithEmailAndPassword(auth,email,password)),
  signUp:(email,password)=>authAction(()=>sdk.createUserWithEmailAndPassword(auth,email,password)),
  resetPassword:email=>authAction(()=>sdk.sendPasswordResetEmail(auth,email)),
  signOut:()=>authAction(()=>sdk.signOut(auth)),
  readAll,putBest,
  deleteAll(uid,password){guard(uid);return remove(password,false)},
  deleteAccount:password=>remove(password,true),
  async exportData(uid){return {schema:1,uid,progress:await readAll(uid)}}
 };
}
