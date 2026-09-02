import { useContext, useEffect, useState } from 'react';
import { collection, doc, onSnapshot } from 'firebase/firestore';
import { CheckCircle, MapPin, Phone, ShoppingBasket } from 'lucide-react';
import { db } from '../firebase';
import { AppContext } from '../App';

const SITE_SETTINGS_ID = 'qfl-site-settings';
const defaults = {
  logoUrl: '',
  heroEyebrow: 'QUITANDA FEIRA LIVRE',
  heroTitleBefore: 'O melhor da',
  heroTitleHighlight: 'feira',
  heroTitleAfter: 'para sua casa.',
  heroDescription: 'Frutas, verduras e legumes fresquinhos em Santa Maria da Vitória.',
  storeTag: 'NOSSA LOJA',
  storeTitle: 'Santa Maria da Vitória/BA',
  storeAddress: 'Endereço da Quitanda Feira Livre — edite no painel administrativo.',
  storePhone: '(77) 99999-9999',
  catalogTag: 'CATÁLOGO',
  catalogTitle: 'Produtos disponíveis',
  catalogDescription: 'Confira os produtos disponíveis na Quitanda Feira Livre.'
};

export default function Home() {
  const { addToCart } = useContext(AppContext);
  const [products, setProducts] = useState([]);
  const [settings, setSettings] = useState(defaults);
  const [cartMessage, setCartMessage] = useState('');

  useEffect(() => onSnapshot(collection(db, 'products'), snap => setProducts(snap.docs.map(d => ({ id:d.id, ...d.data() })).filter(p => p.id !== SITE_SETTINGS_ID && !p.isSiteSettings && p.available))), []);
  useEffect(() => onSnapshot(doc(db, 'products', SITE_SETTINGS_ID), snap => setSettings({ ...defaults, ...(snap.exists() ? snap.data() : {}) })), []);

  function handleAddToCart(product) {
    addToCart(product);
    setCartMessage(`${product.name} adicionado ao carrinho!`);
  }

  useEffect(() => {
    if (!cartMessage) return;
    const timer = setTimeout(() => setCartMessage(''), 2500);
    return () => clearTimeout(timer);
  }, [cartMessage]);

  const Logo = ({ className='' }) => settings.logoUrl
    ? <img className={className} src={settings.logoUrl} alt="Logo da Quitanda Feira Livre"/>
    : <div className={`logo-placeholder ${className}`}>QUITANDA<br/>FEIRA LIVRE</div>;

  return <main>
    {cartMessage && <div className="cart-toast" role="status" aria-live="polite"><CheckCircle size={20}/> {cartMessage}</div>}

    <section className="hero">
      <div><p className="eyebrow">{settings.heroEyebrow}</p><h1>{settings.heroTitleBefore} <em>{settings.heroTitleHighlight}</em> {settings.heroTitleAfter}</h1><p>{settings.heroDescription}</p><a href="#produtos" className="btn red"><ShoppingBasket size={18}/> Ver produtos</a></div>
      <div className="hero-art logo-area"><Logo className="hero-logo"/></div>
    </section>

    <section className="store-card">
      <div><span className="tag green">{settings.storeTag}</span><h2>{settings.storeTitle}</h2><p><MapPin size={17}/> {settings.storeAddress}</p><p><Phone size={17}/> {settings.storePhone}</p></div>
      <div className="store-logo"><Logo className="store-logo-image"/></div>
    </section>

    <section id="produtos" className="section"><div className="section-head"><div><span className="tag red">{settings.catalogTag}</span><h2>{settings.catalogTitle}</h2></div><p>{settings.catalogDescription}</p></div>
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
