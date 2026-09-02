import { useContext, useEffect, useState } from 'react';
import { collection, doc, getDoc, getDocs, query, where } from 'firebase/firestore';
import { useSearchParams } from 'react-router-dom';
import { db } from '../firebase';
import { AppContext } from '../App';

const statuses=['Pedido recebido','Aguardando confirmação','Em separação','Saiu para entrega','Concluído'];

export default function TrackOrder(){
  const {user}=useContext(AppContext);
  const [params]=useSearchParams();
  const [code,setCode]=useState(params.get('pedido')||'');
  const [order,setOrder]=useState(null);
  const [msg,setMsg]=useState('');
  const [busy,setBusy]=useState(false);

  const find=async(value=code)=>{
    setMsg('');
    const c=(value||'').trim().toUpperCase();
    if(!c)return;
    try{
      const s=await getDoc(doc(db,'orders',c));
      if(!s.exists() || s.data().userId!==user.uid) throw new Error();
      setCode(c); setOrder(s.data());
    }catch{setOrder(null);setMsg('Pedido não encontrado ou não pertence à sua conta.')}
  };

  const findLatest=async()=>{
    setBusy(true); setMsg('');
    try{
      const q=query(collection(db,'orders'),where('userId','==',user.uid));
      const s=await getDocs(q);
      const all=s.docs.map(d=>({id:d.id,...d.data()})).filter(o=>!o.hiddenByCustomer);
      all.sort((a,b)=>(b.createdAt?.seconds||0)-(a.createdAt?.seconds||0));
      if(!all.length){setOrder(null);setMsg('Você ainda não possui pedidos para acompanhar.');return}
      const latest=all[0]; setCode(latest.code); setOrder(latest);
    }catch{setMsg('Não foi possível consultar seu pedido mais recente.')}finally{setBusy(false)}
  };

  useEffect(()=>{if(params.get('pedido')&&user)find(params.get('pedido'))},[user]);
  const idx=statuses.indexOf(order?.status);

  return <main className="section"><span className="tag green">ACOMPANHAMENTO</span><h1>Acompanhe seu pedido</h1><div className="track-grid"><section className="panel"><label>Número do pedido<input placeholder="QFL-2026-0000" value={code} onChange={e=>setCode(e.target.value)}/></label><button className="btn green full" onClick={()=>find()}>Consultar pedido</button><button className="ghost full recent-order-btn" onClick={findLatest} disabled={busy}>{busy?'Consultando...':'Consultar meu pedido mais recente'}</button>{msg&&<div className="alert">{msg}</div>}</section>{order&&<section className="panel"><h2>{order.code}</h2><p><b>Pagamento:</b> {order.paymentMethod}</p><p><b>Total:</b> R$ {Number(order.total).toFixed(2).replace('.',',')}</p><div className="timeline">{statuses.map((s,i)=><div className={`step ${i<=idx?'done':''}`} key={s}><i></i><div><b>{s}</b>{s===order.status&&<small>Status atual</small>}</div></div>)}</div></section>}</div></main>
}
