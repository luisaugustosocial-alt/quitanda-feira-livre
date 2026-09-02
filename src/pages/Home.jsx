import { useContext, useEffect, useState } from 'react';
import { collection, onSnapshot } from 'firebase/firestore';
import { CheckCircle, MapPin, Phone, ShoppingBasket } from 'lucide-react';
import { db } from '../firebase';
import { AppContext } from '../App';

export default function Home() {
  const { addToCart } = useContext(AppContext);
  const [products, setProducts] = useState([]);
  const [cartMessage, setCartMessage] = useState('');

  useEffect(() => onSnapshot(collection(db, 'products'), snap => setProducts(snap.docs.map(d => ({ id:d.id, ...d.data() })).filter(p => p.available))), []);

  function handleAddToCart(product) {
    addToCart(product);
    setCartMessage(`${product.name} adicionado ao carrinho!`);
  }

  useEffect(() => {
    if (!cartMessage) return;
    const timer = setTimeout(() => setCartMessage(''), 2500);
    return () => clearTimeout(timer);
  }, [cartMessage]);

  return <main>
    {cartMessage && (
      <div className="cart-toast" role="status" aria-live="polite" style={{ position: 'fixed', top: '20px', right: '20px', zIndex: 9999, display: 'flex', alignItems: 'center', gap: '8px', padding: '14px 18px', borderRadius: '12px', background: '#198754', color: '#fff', fontWeight: 700, boxShadow: '0 8px 24px rgba(0,0,0,.2)' }}>
        <CheckCircle size={20}/> {cartMessage}
      </div>
    )}

    <section className="hero">
      <div><p className="eyebrow">QUITANDA FEIRA LIVRE</p><h1>O melhor da <em>feira</em> para sua casa.</h1><p>Frutas, verduras e legumes fresquinhos em Santa Maria da Vitória.</p><a href="#produtos" className="btn red"><ShoppingBasket size={18}/> Ver produtos</a></div>
      <div className="hero-art">🥬 🍅 🍌 🥕 🍊</div>
    </section>

    <section className="store-card">
      <div><span className="tag green">NOSSA LOJA</span><h2>Santa Maria da Vitória/BA</h2><p><MapPin size={17}/> Endereço da Quitanda Feira Livre — edite no painel/configuração.</p><p><Phone size={17}/> (77) 99999-9999</p></div>
      <div className="store-colors"><i></i><i></i><i></i><i></i></div>
    </section>

    <section id="produtos" className="section"><div className="section-head"><div><span className="tag red">CATÁLOGO</span><h2>Produtos disponíveis</h2></div><p>O administrador controla preço, imagem e disponibilidade.</p></div>
      <div className="products-grid">
        {products.length === 0 && <div className="empty">Nenhum produto cadastrado ainda.</div>}
        {products.map(p => <article className="product-card" key={p.id}>
          <div className="product-image">{p.imageUrl ? <img src={p.imageUrl} alt={p.name}/> : <span>🥕</span>}</div>
          <div className="product-body"><small>{p.category || 'Produto'}</small><h3>{p.name}</h3><p className="price">R$ {Number(p.price || 0).toFixed(2).replace('.', ',')} <span>/ {p.unit || 'un'}</span></p><button className="btn green full" onClick={() => handleAddToCart(p)}>Adicionar</button></div>
        </article>)}
      </div>
    </section>
  </main>;
}
