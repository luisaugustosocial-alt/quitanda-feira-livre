import { useState } from 'react';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { Link, useNavigate } from 'react-router-dom';
import { auth, db } from '../firebase';

const normalizeUser = v => v.toLowerCase().replace(/^userquitanda@/,'').trim();
const sha256 = async (text) => {
  const data = new TextEncoder().encode(text.trim().toLowerCase());
  const hash = await crypto.subtle.digest('SHA-256', data);
  return [...new Uint8Array(hash)].map(b => b.toString(16).padStart(2,'0')).join('');
};

export default function Login(){
  const [login,setLogin]=useState(''); const [password,setPassword]=useState(''); const [msg,setMsg]=useState(''); const nav=useNavigate();
  const submit=async e=>{e.preventDefault();setMsg('');try{
    let internalEmail;
    const value=login.trim().toLowerCase();
    if(value.includes('@') && !value.startsWith('userquitanda@')){
      const hash=await sha256(value);
      const alias=await getDoc(doc(db,'emailAliases',hash));
      if(!alias.exists()) throw new Error('not-found');
      internalEmail=alias.data().authEmail;
    } else {
      internalEmail=`${normalizeUser(value)}@clientes.quitandafeiralivre.app`;
    }
    await signInWithEmailAndPassword(auth,internalEmail,password); nav('/');
  }catch{setMsg('Usuário/e-mail ou senha incorretos.');}};
  return <main className="auth-page"><form className="auth-card" onSubmit={submit}><span className="tag blue">ENTRAR</span><h1>Acesse sua conta</h1><p>Entre com <b>userquitanda@seunome</b> ou com o e-mail informado no cadastro.</p>{msg&&<div className="alert">{msg}</div>}<label>Usuário ou e-mail<input required placeholder="userquitanda@joao ou joao@email.com" value={login} onChange={e=>setLogin(e.target.value)}/></label><label>Senha<input required type="password" value={password} onChange={e=>setPassword(e.target.value)}/></label><button className="btn blue full">Entrar</button><p>Ainda não tem conta? <Link to="/cadastro">Cadastre-se</Link></p></form></main>
}
