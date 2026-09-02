import { useContext, useEffect, useMemo, useState } from 'react';
import { arrayUnion, collection, doc, getDoc, onSnapshot, query, updateDoc, where } from 'firebase/firestore';
import { AppContext } from '../App';
import { db } from '../firebase';

export default function MyOrders(){
  const {user}=useContext(AppContext);
  const [orders,setOrders]=useState([]);
  const [hiddenCodes,setHiddenCodes]=useState([]);
  const [msg,setMsg]=useState('');

  useEffect(()=>{
    if(!user) return;
    getDoc(doc(db,'users',user.uid)).then(s=>setHiddenCodes(s.exists()?(s.data().hiddenOrderCodes||[]):[]));
    const q=query(collection(db,'orders'),where('userId','==',user.uid));
    return onSnapshot(q,s=>setOrders(s.docs.map(d=>({id:d.id,...d.data()}))),()=>setOrders([]));
  },[user]);

  const visibleOrders=useMemo(()=>orders
    .filter(o=>!hiddenCodes.includes(o.code))
    .sort((a,b)=>(b.createdAt?.seconds||0)-(a.createdAt?.seconds||0)),[orders,hiddenCodes]);

  const clearOrders=async()=>{
    if(!visibleOrders.length) return;
    const ok=window.confirm('Deseja limpar seu histórico de pedidos? Isso removerá os pedidos apenas da sua visualização.');
    if(!ok) return;
    const codes=visibleOrders.map(o=>o.code);
    await updateDoc(doc(db,'users',user.uid),{hiddenOrderCodes:arrayUnion(...codes)});
    setHiddenCodes(old=>[...new Set([...old,...codes])]);
    setMsg('Histórico limpo da sua conta.');
  };

  return <main className="section">
    <div className="section-head"><div><span className="tag blue">MINHA CONTA</span><h1>Meus pedidos</h1></div>{visibleOrders.length>0&&<button className="ghost" onClick={clearOrders}>Limpar pedidos</button>}</div>
    {msg&&<div className="info-box">{msg}</div>}
    <div className="order-list">
      {visibleOrders.map(o=><a key={o.code} href={`/acompanhar?pedido=${o.code}`} className="order-item"><div><b>{o.code}</b><small>{o.items?.length||0} item(ns)</small></div><strong>R$ {Number(o.total).toFixed(2).replace('.',',')}</strong><span className="status">{o.status}</span></a>)}
      {!visibleOrders.length&&<div className="empty">Você ainda não possui pedidos visíveis.</div>}
    </div>
  </main>
}
