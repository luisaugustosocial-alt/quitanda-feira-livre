import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Home, ShoppingBasket } from 'lucide-react';
import { doc, onSnapshot } from 'firebase/firestore';
import { db } from '../firebase';
import './NotFound.css';

export default function NotFound() {
  const [logoUrl, setLogoUrl] = useState('');

  useEffect(() => {
    const unsub = onSnapshot(doc(db, 'products', 'qfl-site-settings'), (snap) => {
      setLogoUrl(snap.exists() ? (snap.data().logoUrl || '') : '');
    });
    return unsub;
  }, []);

  return (
    <main className="not-found-page">
      <section className="not-found-card">
        <div className="not-found-logo-wrap">
          {logoUrl ? (
            <img src={logoUrl} alt="Quitanda Feira Livre" className="not-found-logo" />
          ) : (
            <div className="not-found-logo-fallback">QUITANDA<br/><strong>FEIRA LIVRE</strong></div>
          )}
        </div>

        <div className="not-found-code" aria-label="Erro 404">
          <span>4</span><ShoppingBasket aria-hidden="true"/><span>4</span>
        </div>

        <span className="tag red">PÁGINA NÃO ENCONTRADA</span>
        <h1>Ops! Essa página saiu da feira.</h1>
        <p>O endereço que você tentou acessar não existe, foi alterado ou não está mais disponível.</p>

        <div className="not-found-actions">
          <Link className="btn green" to="/"><Home size={18}/> Voltar ao início</Link>
          <Link className="ghost" to="/#produtos"><ArrowLeft size={18}/> Ver produtos</Link>
        </div>

        <div className="not-found-colors" aria-hidden="true"><i></i><i></i><i></i><i></i></div>
      </section>
    </main>
  );
}
