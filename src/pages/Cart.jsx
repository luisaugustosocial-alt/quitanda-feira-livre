import { useContext, useEffect, useMemo, useRef, useState } from 'react';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import { doc, getDoc, serverTimestamp, setDoc } from 'firebase/firestore';
import { useNavigate } from 'react-router-dom';
import { AppContext } from '../App';
import { db } from '../firebase';

const SITE_SETTINGS_ID='qfl-site-settings';
const randomFour=()=>String(Math.floor(Math.random()*10000)).padStart(4,'0');
const makeCode=()=>`QFL-${new Date().getFullYear()}-${randomFour()}`;
const brl=n=>`R$ ${Number(n||0).toFixed(2).replace('.',',')}`;

export default function Cart(){
 const {cart,setCart,user,profile}=useContext(AppContext);const nav=useNavigate();const receiptRef=useRef(null);
 const [form,setForm]=useState({address:'',reference:'',paymentMethod:'Dinheiro na entrega',notes:''});
 const [msg,setMsg]=useState('');const [deliveryFee,setDeliveryFee]=useState(0);const [receipt,setReceipt]=useState(null);const [busy,setBusy]=useState(false);
 const subtotal=useMemo(()=>cart.reduce((s,i)=>s+i.price*i.qty,0),[cart]);const total=subtotal+Number(deliveryFee||0);

 useEffect(()=>{getDoc(doc(db,'products',SITE_SETTINGS_ID)).then(s=>{if(s.exists())setDeliveryFee(Number(s.data().deliveryFee||0))}).catch(()=>{})},[]);
 const changeQty=(id,d)=>setCart(c=>c.map(i=>i.id===id?{...i,qty:Math.max(1,i.qty+d)}:i));const remove=id=>setCart(c=>c.filter(i=>i.id!==id));

 const checkout=async()=>{
   if(!user){nav('/login');return}if(!cart.length){setMsg('Seu carrinho está vazio.');return}if(!form.address.trim()){setMsg('Informe o endereço de entrega.');return}
   setBusy(true);setMsg('');
   try{
     let code='';for(let i=0;i<20;i++){const candidate=makeCode();const exists=await getDoc(doc(db,'orders',candidate));if(!exists.exists()){code=candidate;break}}
     if(!code){setMsg('Não foi possível gerar o número do pedido. Tente novamente.');return}
     const itemsSnapshot=cart.map(i=>({...i}));
     const order={code,userId:user.uid,customerName:profile?.name||'',phone:profile?.phone||'',address:form.address.trim(),reference:form.reference.trim(),paymentMethod:form.paymentMethod,notes:form.notes.trim(),items:itemsSnapshot,subtotal,deliveryFee:Number(deliveryFee||0),total,status:'Pedido recebido',archived:false,hiddenByCustomer:false,createdAt:serverTimestamp(),updatedAt:serverTimestamp()};
     await setDoc(doc(db,'orders',code),order);
     setReceipt({...order,createdAtLabel:new Date().toLocaleString('pt-BR')});setCart([]);
   }catch(err){setMsg(err?.message||'Não foi possível concluir o pedido.')}
   finally{setBusy(false)}
 };

 const makeCanvas=()=>html2canvas(receiptRef.current,{scale:2,backgroundColor:'#ffffff',useCORS:true});
 const downloadImage=async()=>{if(!receiptRef.current)return;const canvas=await makeCanvas();const a=document.createElement('a');a.download=`comprovante-${receipt.code}.png`;a.href=canvas.toDataURL('image/png');a.click()};
 const downloadPdf=async()=>{if(!receiptRef.current)return;const canvas=await makeCanvas();const img=canvas.toDataURL('image/png');const pdf=new jsPDF({orientation:'portrait',unit:'mm',format:'a4'});const pageW=210;const margin=12;const usable=pageW-margin*2;const height=canvas.height*usable/canvas.width;pdf.addImage(img,'PNG',margin,12,usable,Math.min(height,270));pdf.save(`comprovante-${receipt.code}.pdf`)};

 return <main className="section"><div className="section-head"><div><span className="tag red">CARRINHO</span><h1>Finalize seu pedido</h1></div></div>{msg&&<div className="alert">{msg}</div>}
 <div className="checkout-grid"><section className="panel"><h2>Produtos</h2>{cart.map(i=><div className="cart-row" key={i.id}><div>{i.imageUrl?<img src={i.imageUrl}/>:<span>🍎</span>}<b>{i.name}</b></div><div className="qty"><button onClick={()=>changeQty(i.id,-1)}>-</button><span>{i.qty}</span><button onClick={()=>changeQty(i.id,1)}>+</button></div><strong>{brl(i.price*i.qty)}</strong><button className="link-danger" onClick={()=>remove(i.id)}>Remover</button></div>)}
 <div className="checkout-summary"><div><span>Subtotal dos produtos</span><b>{brl(subtotal)}</b></div><div><span>Frete</span><b>{brl(deliveryFee)}</b></div><div className="grand-total"><span>Total do pedido</span><b>{brl(total)}</b></div></div></section>
 <section className="panel"><h2>Entrega e pagamento</h2><label>Endereço completo<textarea value={form.address} onChange={e=>setForm({...form,address:e.target.value})}/></label><label>Ponto de referência<input value={form.reference} onChange={e=>setForm({...form,reference:e.target.value})}/></label><label>Pagamento<select value={form.paymentMethod} onChange={e=>setForm({...form,paymentMethod:e.target.value})}><option>Dinheiro na entrega</option><option>PIX na entrega</option><option>Cartão na entrega</option></select></label><div className="info-box">Nenhum pagamento é feito agora no site. O pagamento será realizado no momento da entrega.</div><label>Observações<textarea value={form.notes} onChange={e=>setForm({...form,notes:e.target.value})}/></label><button className="btn red full" onClick={checkout} disabled={busy}>{busy?'Enviando pedido...':'Enviar pedido'}</button></section></div>

 {receipt&&<div className="receipt-backdrop"><div className="receipt-modal"><div ref={receiptRef} className="receipt-paper"><div className="receipt-brand"><span>QUITANDA FEIRA LIVRE</span><h2>Comprovante do pedido</h2><small>{receipt.createdAtLabel}</small></div><div className="receipt-code">Pedido <b>{receipt.code}</b></div><div className="receipt-data"><p><b>Cliente:</b> {receipt.customerName}</p><p><b>Telefone:</b> {receipt.phone}</p><p><b>Entrega:</b> {receipt.address}</p>{receipt.reference&&<p><b>Referência:</b> {receipt.reference}</p>}<p><b>Pagamento:</b> {receipt.paymentMethod}</p></div><div className="receipt-items">{receipt.items.map(i=><div key={i.id}><span>{i.qty}x {i.name}</span><b>{brl(i.price*i.qty)}</b></div>)}</div><div className="receipt-totals"><div><span>Subtotal</span><b>{brl(receipt.subtotal)}</b></div><div><span>Frete</span><b>{brl(receipt.deliveryFee)}</b></div><div className="receipt-grand"><span>Total</span><b>{brl(receipt.total)}</b></div></div><div className="receipt-warning"><b>IMPORTANTE:</b> este comprovante registra apenas a realização do pedido e <b>não é nota fiscal, cupom fiscal ou documento fiscal</b>.</div></div><div className="receipt-actions"><button className="btn green" onClick={downloadImage}>Baixar como imagem</button><button className="btn blue" onClick={downloadPdf}>Baixar PDF</button><button className="ghost" onClick={()=>nav(`/acompanhar?pedido=${receipt.code}`)}>Acompanhar pedido</button></div></div></div>}
 </main>
}
