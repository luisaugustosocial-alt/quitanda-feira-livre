import { useState } from 'react';
import { createUserWithEmailAndPassword, deleteUser } from 'firebase/auth';
import { deleteDoc, doc, getDoc, serverTimestamp, setDoc } from 'firebase/firestore';
import { Eye, EyeOff } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { auth, db } from '../firebase';
import { PRIVACY_VERSION, TERMS_VERSION } from '../legal';

const cleanName = (v='') => v.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/[^a-z0-9._-]/g,'').slice(0,24);
const displayUsername = n => `userquitanda@${n}`;
const sha256 = async (text) => { const data = new TextEncoder().encode(text.trim().toLowerCase()); const hash = await crypto.subtle.digest('SHA-256', data); return [...new Uint8Array(hash)].map(b => b.toString(16).padStart(2,'0')).join(''); };

export default function Register(){
 const [form,setForm]=useState({name:'',email:'',phone:'',username:'',password:'',accepted:false});
 const [showPassword,setShowPassword]=useState(false);
 const [msg,setMsg]=useState('');
 const [suggestions,setSuggestions]=useState([]);
 const [checking,setChecking]=useState(false);
 const nav=useNavigate();
 const slug=cleanName(form.username);

 const usernameDocExists=async(candidate)=>{if(!candidate)return false;const snap=await getDoc(doc(db,'usernames',candidate));return snap.exists()};
 const findSuggestions=async(base)=>{const found=[];for(let i=1;i<=99&&found.length<3;i++){const candidate=cleanName(`${base}${i}`);if(candidate&&!(await usernameDocExists(candidate)))found.push(candidate)}return found};
 const checkUsername=async()=>{const candidate=cleanName(form.username);setSuggestions([]);if(candidate.length<3)return false;setChecking(true);try{const exists=await usernameDocExists(candidate);if(exists){setMsg('Este usuário já foi usado anteriormente. A disponibilidade será confirmada ao criar a conta.');return true}if(msg.startsWith('Este usuário já foi usado anteriormente.'))setMsg('');return false}finally{setChecking(false)}};
 const chooseSuggestion=candidate=>{setForm(old=>({...old,username:candidate}));setSuggestions([]);setMsg('')};

 const submit=async(e)=>{e.preventDefault();setMsg('');setSuggestions([]);let created=null,usernameRef=null,userRef=null,aliasRef=null;try{
   if(slug.length<3)throw new Error('Escolha um usuário com pelo menos 3 caracteres.');
   if(!form.accepted)throw new Error('Você precisa aceitar os Termos de Uso e a Política de Privacidade.');
   const realEmail=form.email.trim().toLowerCase();
   const cred=await createUserWithEmailAndPassword(auth,realEmail,form.password);created=cred.user;
   usernameRef=doc(db,'usernames',slug);userRef=doc(db,'users',created.uid);
   await setDoc(userRef,{name:form.name.trim(),realEmail,phone:form.phone.trim(),username:displayUsername(slug),usernameSlug:slug,role:'customer',createdAt:serverTimestamp(),legalAcceptance:{termsVersion:TERMS_VERSION,privacyVersion:PRIVACY_VERSION,acceptedAt:serverTimestamp()}});
   await setDoc(usernameRef,{uid:created.uid,username:displayUsername(slug),authEmail:realEmail,createdAt:serverTimestamp()});
   const emailHash=await sha256(realEmail);aliasRef=doc(db,'emailAliases',emailHash);await setDoc(aliasRef,{uid:created.uid,authEmail:realEmail,createdAt:serverTimestamp()});
   nav('/');
 }catch(err){
   if(created){try{if(usernameRef)await deleteDoc(usernameRef)}catch{}try{if(userRef)await deleteDoc(userRef)}catch{}try{if(aliasRef)await deleteDoc(aliasRef)}catch{}try{await deleteUser(created)}catch{}}
   if(err?.code==='auth/email-already-in-use'){setMsg('Este e-mail já está cadastrado. Tente entrar ou redefinir sua senha.');return}
   setMsg((err.message||'Não foi possível criar a conta.').replace('Firebase:',''));
 }};

 return <main className="auth-page"><form className="auth-card" onSubmit={submit}><span className="tag green">CRIAR CONTA</span><h1>Cadastro</h1><p>Seu usuário será <b>{displayUsername(slug||'seunome')}</b>.</p>
 {msg&&<div className="alert">{msg}</div>}
 {suggestions.length>0&&<div className="username-suggestions"><small>Você pode usar:</small><div>{suggestions.map(s=><button type="button" key={s} onClick={()=>chooseSuggestion(s)}>{displayUsername(s)}</button>)}</div></div>}
 <label>Nome completo<input required value={form.name} onChange={e=>setForm({...form,name:e.target.value})}/></label>
 <label>E-mail<input required type="email" value={form.email} onChange={e=>setForm({...form,email:e.target.value})}/></label>
 <label>Telefone<input required value={form.phone} onChange={e=>setForm({...form,phone:e.target.value})}/></label>
 <label>Escolha seu nome de usuário<div className="username-field"><span>userquitanda@</span><input required value={form.username} onChange={e=>{setForm({...form,username:e.target.value});setSuggestions([]);if(msg==='Este usuário já está em uso.'||msg.startsWith('Este usuário já foi usado anteriormente.'))setMsg('')}} onBlur={checkUsername}/></div>{checking&&<small>Verificando disponibilidade...</small>}</label>
 <label>Senha<div className="password-field"><input required minLength="6" type={showPassword?'text':'password'} value={form.password} onChange={e=>setForm({...form,password:e.target.value})}/><button type="button" className="password-eye" aria-label={showPassword?'Ocultar senha':'Mostrar senha'} onClick={()=>setShowPassword(v=>!v)}>{showPassword?<EyeOff size={20}/>:<Eye size={20}/>}</button></div></label>
 <label className="legal-consent"><input type="checkbox" checked={form.accepted} onChange={e=>setForm({...form,accepted:e.target.checked})}/><span>Li e concordo com os <Link to="/termos" target="_blank">Termos de Uso</Link> e com a <Link to="/privacidade" target="_blank">Política de Privacidade</Link>.</span></label>
 <button className="btn green full">Criar conta</button><p>Já tem conta? <Link to="/login">Entrar</Link></p></form></main>
}
