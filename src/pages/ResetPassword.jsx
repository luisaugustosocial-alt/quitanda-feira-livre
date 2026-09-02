import { useEffect, useMemo, useState } from 'react';
import { confirmPasswordReset, verifyPasswordResetCode } from 'firebase/auth';
import { Eye, EyeOff } from 'lucide-react';
import { Link, useSearchParams } from 'react-router-dom';
import { auth } from '../firebase';

export default function ResetPassword(){
  const [params]=useSearchParams();
  const oobCode=params.get('oobCode')||'';
  const mode=params.get('mode')||'';
  const [email,setEmail]=useState('');
  const [password,setPassword]=useState('');
  const [confirm,setConfirm]=useState('');
  const [showPassword,setShowPassword]=useState(false);
  const [busy,setBusy]=useState(true);
  const [done,setDone]=useState(false);
  const [msg,setMsg]=useState('');

  const validMode=useMemo(()=>!mode||mode==='resetPassword',[mode]);

  useEffect(()=>{
    if(!oobCode||!validMode){setMsg('Link de redefinição inválido ou incompleto.');setBusy(false);return}
    verifyPasswordResetCode(auth,oobCode).then(setEmail).catch(()=>setMsg('Este link é inválido, já foi usado ou expirou.')).finally(()=>setBusy(false));
  },[oobCode,validMode]);

  const submit=async e=>{
    e.preventDefault();setMsg('');
    if(password.length<6){setMsg('A nova senha precisa ter pelo menos 6 caracteres.');return}
    if(password!==confirm){setMsg('As senhas não coincidem.');return}
    setBusy(true);
    try{await confirmPasswordReset(auth,oobCode,password);setDone(true)}catch{setMsg('Não foi possível redefinir a senha. Solicite um novo link.')}finally{setBusy(false)}
  };

  return <main className="auth-page"><div className="auth-card reset-card">
    <span className="tag green">NOVA SENHA</span><h1>Redefinir senha</h1>
    {busy&&!done&&<p>Validando seu link...</p>}
    {done?<><div className="info-box">Senha alterada com sucesso.</div><Link className="btn green full" to="/login">Entrar na minha conta</Link></>:
    <>{msg&&<div className="alert">{msg}</div>}{email&&<form onSubmit={submit}><p>Conta: <b>{email}</b></p><label>Nova senha<div className="password-field"><input required minLength="6" type={showPassword?'text':'password'} value={password} onChange={e=>setPassword(e.target.value)}/><button type="button" className="password-eye" onClick={()=>setShowPassword(v=>!v)}>{showPassword?<EyeOff size={20}/>:<Eye size={20}/>}</button></div></label><label>Confirmar nova senha<input required minLength="6" type={showPassword?'text':'password'} value={confirm} onChange={e=>setConfirm(e.target.value)}/></label><button className="btn green full" disabled={busy}>{busy?'Salvando...':'Salvar nova senha'}</button></form>} {!email&&!busy&&<Link to="/login" className="btn blue full">Voltar ao login</Link>}</>}
  </div></main>
}
