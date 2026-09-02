import { useState } from 'react';
import { createUserWithEmailAndPassword, deleteUser } from 'firebase/auth';
import { doc, serverTimestamp, setDoc } from 'firebase/firestore';
import { Link, useNavigate } from 'react-router-dom';
import { auth, db } from '../firebase';
import { PRIVACY_VERSION, TERMS_VERSION } from '../legal';

const cleanName = (v='') => v.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/[^a-z0-9._-]/g,'').slice(0,24);
const displayUsername = n => `userquitanda@${n}`;
const authEmailFromUser = n => `${n}@clientes.quitandafeiralivre.app`;
const sha256 = async (text) => { const data = new TextEncoder().encode(text.trim().toLowerCase()); const hash = await crypto.subtle.digest('SHA-256', data); return [...new Uint8Array(hash)].map(b => b.toString(16).padStart(2,'0')).join(''); };

export default function Register(){
 const [form,setForm]=useState({name:'',email:'',phone:'',username:'',password:'',accepted:false}); const [msg,setMsg]=useState(''); const nav=useNavigate();
 const slug=cleanName(form.username);
 const submit=async(e)=>{e.preventDefault();setMsg(''); let created=null; try{
   if(slug.length<3) throw new Error('Escolha um usuário com pelo menos 3 caracteres.');
   if(!form.accepted) throw new Error('Você precisa aceitar os Termos de Uso e a Política de Privacidade.');
   const usernameRef=doc(db,'usernames',slug);
   const internalEmail=authEmailFromUser(slug);
   const cred=await createUserWithEmailAndPassword(auth,internalEmail,form.password); created=cred.user;
   await setDoc(doc(db,'users',created.uid),{name:form.name.trim(),realEmail:form.email.trim().toLowerCase(),phone:form.phone.trim(),username:displayUsername(slug),usernameSlug:slug,role:'customer',createdAt:serverTimestamp(),legalAcceptance:{termsVersion:TERMS_VERSION,privacyVersion:PRIVACY_VERSION,acceptedAt:serverTimestamp()}});
   await setDoc(usernameRef,{uid:created.uid,username:displayUsername(slug),createdAt:serverTimestamp()});
   const emailHash=await sha256(form.email);
   await setDoc(doc(db,'emailAliases',emailHash),{uid:created.uid,authEmail:internalEmail,createdAt:serverTimestamp()});
   nav('/');
 }catch(err){ if(created) try{await deleteUser(created)}catch{} const raw=err?.code==='auth/email-already-in-use'?'Esse nome de usuário já está em uso.':(err.message||'Não foi possível criar a conta.'); setMsg(raw.replace('Firebase:','')); }};
 return <main className="auth-page"><form className="auth-card" onSubmit={submit}><span className="tag green">CRIAR CONTA</span><h1>Cadastro</h1><p>Seu usuário será <b>{displayUsername(slug || 'seunome')}</b>.</p>
 {msg&&<div className="alert">{msg}</div>}<label>Nome completo<input required value={form.name} onChange={e=>setForm({...form,name:e.target.value})}/></label><label>E-mail<input required type="email" value={form.email} onChange={e=>setForm({...form,email:e.target.value})}/></label><label>Telefone<input required value={form.phone} onChange={e=>setForm({...form,phone:e.target.value})}/></label><label>Escolha seu nome de usuário<div className="username-field"><span>userquitanda@</span><input required value={form.username} onChange={e=>setForm({...form,username:e.target.value})}/></div></label><label>Senha<input required minLength="6" type="password" value={form.password} onChange={e=>setForm({...form,password:e.target.value})}/></label>
 <label className="legal-consent"><input type="checkbox" checked={form.accepted} onChange={e=>setForm({...form,accepted:e.target.checked})}/><span>Li e concordo com os <Link to="/termos" target="_blank">Termos de Uso</Link> e com a <Link to="/privacidade" target="_blank">Política de Privacidade</Link>.</span></label>
 <button className="btn green full">Criar conta</button><p>Já tem conta? <Link to="/login">Entrar</Link></p></form></main>
}
