import { useEffect, useMemo, useState } from 'react';
import { sendPasswordResetEmail, signInWithEmailAndPassword } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { Eye, EyeOff } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { auth, db } from '../firebase';

const normalizeUser = v => v.toLowerCase().replace(/^userquitanda@/,'').trim();
const sha256 = async (text) => {
  const data = new TextEncoder().encode(text.trim().toLowerCase());
  const hash = await crypto.subtle.digest('SHA-256', data);
  return [...new Uint8Array(hash)].map(b => b.toString(16).padStart(2,'0')).join('');
};

const LIMIT_KEY = 'qfl-login-guard-v1';
const MAX_ATTEMPTS = 5;
const WINDOW_MS = 15 * 60 * 1000;
const LOCK_MS = 10 * 60 * 1000;

function readGuard(){ try{return JSON.parse(localStorage.getItem(LIMIT_KEY)||'{}')}catch{return{}} }
function writeGuard(value){localStorage.setItem(LIMIT_KEY,JSON.stringify(value))}
function clearGuard(){localStorage.removeItem(LIMIT_KEY)}

export default function Login(){
  const [login,setLogin]=useState('');
  const [password,setPassword]=useState('');
  const [showPassword,setShowPassword]=useState(false);
  const [msg,setMsg]=useState('');
  const [busy,setBusy]=useState(false);
  const [resetBusy,setResetBusy]=useState(false);
  const [now,setNow]=useState(Date.now());
  const nav=useNavigate();

  useEffect(()=>{const timer=setInterval(()=>setNow(Date.now()),1000);return()=>clearInterval(timer)},[]);

  const guard=readGuard();
  const lockedUntil=Number(guard.lockedUntil||0);
  const isLocked=lockedUntil>now;
  const secondsLeft=Math.max(0,Math.ceil((lockedUntil-now)/1000));
  const lockText=useMemo(()=>`${Math.floor(secondsLeft/60)}:${String(secondsLeft%60).padStart(2,'0')}`,[secondsLeft]);

  const resolveAuthEmail=async(value)=>{
    const normalized=value.trim().toLowerCase();
    if(!normalized) throw new Error('Informe seu usuário ou e-mail.');
    if(normalized.includes('@')&&!normalized.startsWith('userquitanda@')){
      const hash=await sha256(normalized);
      const alias=await getDoc(doc(db,'emailAliases',hash));
      if(alias.exists()&&alias.data().authEmail) return alias.data().authEmail;
      return normalized;
    }
    const slug=normalizeUser(normalized);
    const username=await getDoc(doc(db,'usernames',slug));
    if(username.exists()&&username.data().authEmail) return username.data().authEmail;
    return `${slug}@clientes.quitandafeiralivre.app`;
  };

  const registerFailure=()=>{
    const current=readGuard();const t=Date.now();let attempts=Number(current.attempts||0);let windowStarted=Number(current.windowStarted||t);
    if(t-windowStarted>WINDOW_MS){attempts=0;windowStarted=t} attempts+=1;
    const next={attempts,windowStarted};if(attempts>=MAX_ATTEMPTS)next.lockedUntil=t+LOCK_MS;writeGuard(next);setNow(t);return next;
  };

  const submit=async e=>{
    e.preventDefault();setMsg('');
    if(readGuard().lockedUntil>Date.now()){setMsg('Muitas tentativas de login. Aguarde alguns minutos e tente novamente.');setNow(Date.now());return}
    setBusy(true);
    try{
      const internalEmail=await resolveAuthEmail(login);
      await signInWithEmailAndPassword(auth,internalEmail,password);
      clearGuard();nav('/');
    }catch{
      const next=registerFailure();
      if(next.lockedUntil>Date.now())setMsg('Muitas tentativas de login. O acesso foi temporariamente bloqueado por 10 minutos.');
      else setMsg('Usuário/e-mail ou senha incorretos.');
    }finally{setBusy(false)}
  };

  const forgotPassword=async()=>{
    setMsg('');setResetBusy(true);
    try{
      const email=await resolveAuthEmail(login);
      await sendPasswordResetEmail(auth,email,{url:`${window.location.origin}/redefinir-senha`});
      setMsg('E-mail de redefinição enviado. Confira sua caixa de entrada e o spam.');
    }catch(err){
      setMsg(err?.message==='Informe seu usuário ou e-mail.'?err.message:'Não foi possível enviar a redefinição. Confira o usuário/e-mail informado.');
    }finally{setResetBusy(false)}
  };

  return <main className="auth-page"><form className="auth-card" onSubmit={submit}>
    <span className="tag blue">ENTRAR</span><h1>Acesse sua conta</h1><p>Entre com <b>userquitanda@seunome</b> ou com o e-mail informado no cadastro.</p>
    {msg&&<div className={msg.startsWith('E-mail de redefinição')?'info-box':'alert'}>{msg}</div>}
    {isLocked&&<div className="info-box">Por segurança, novas tentativas serão liberadas em <b>{lockText}</b>.</div>}
    <label>Usuário ou e-mail<input required autoComplete="username" placeholder="userquitanda@joao ou joao@email.com" value={login} onChange={e=>setLogin(e.target.value)} disabled={isLocked||busy}/></label>
    <label>Senha<div className="password-field"><input required autoComplete="current-password" type={showPassword?'text':'password'} value={password} onChange={e=>setPassword(e.target.value)} disabled={isLocked||busy}/><button type="button" className="password-eye" aria-label={showPassword?'Ocultar senha':'Mostrar senha'} onClick={()=>setShowPassword(v=>!v)}>{showPassword?<EyeOff size={20}/>:<Eye size={20}/>}</button></div></label>
    <button type="button" className="forgot-link" onClick={forgotPassword} disabled={resetBusy}>{resetBusy?'Enviando...':'Esqueceu a senha?'}</button>
    <button className="btn blue full" disabled={isLocked||busy}>{busy?'Entrando...':isLocked?`Aguarde ${lockText}`:'Entrar'}</button>
    <p>Ainda não tem conta? <Link to="/cadastro">Cadastre-se</Link></p>
  </form></main>
}
