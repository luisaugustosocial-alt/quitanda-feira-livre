import { useContext } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { ShoppingCart, LogOut, UserRound, Shield } from 'lucide-react';
import { signOut } from 'firebase/auth';
import { auth } from '../firebase';
import { AppContext } from '../App';

export default function Header() {
  const { user, profile, cartCount } = useContext(AppContext);
  const navigate = useNavigate();
  const logout = async () => { await signOut(auth); navigate('/'); };
  return <>
    <div className="brand-stripe"><span></span><span></span><span></span><span></span></div>
    <header className="header">
      <Link className="brand" to="/"><div className="basket">🥬</div><div><b>QUITANDA</b><strong>FEIRA LIVRE</strong></div></Link>
      <nav>
        <NavLink to="/">Início</NavLink>
        <NavLink to="/acompanhar">Acompanhar pedido</NavLink>
        {user && <NavLink to="/pedidos">Meus pedidos</NavLink>}
        {profile?.role === 'admin' && <NavLink to="/admin"><Shield size={16}/> Admin</NavLink>}
      </nav>
      <div className="header-actions">
        <Link className="cart-link" to="/carrinho"><ShoppingCart size={20}/><span>{cartCount}</span></Link>
        {user ? <button className="ghost" onClick={logout}><LogOut size={18}/> Sair</button> : <Link className="btn blue" to="/login"><UserRound size={18}/> Entrar</Link>}
      </div>
    </header>
  </>;
}
