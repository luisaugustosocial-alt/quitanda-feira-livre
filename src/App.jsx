import React, { useEffect, useMemo, useState } from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import { onAuthStateChanged } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { auth, db } from './firebase';
import './features.css';
import Header from './components/Header';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import ResetPassword from './pages/ResetPassword';
import Cart from './pages/Cart';
import MyOrders from './pages/MyOrders';
import TrackOrder from './pages/TrackOrder';
import Admin from './pages/Admin';
import Terms from './pages/Terms';
import Privacy from './pages/Privacy';
import NotFound from './pages/NotFound';
import Footer from './components/Footer';

export const AppContext = React.createContext(null);
function Protected({ user, children }) { return user ? children : <Navigate to="/login" replace />; }
function AdminOnly({ user, profile, children }) { if (!user) return <Navigate to="/login" replace />; return profile?.role === 'admin' ? children : <Navigate to="/" replace />; }

export default function App() {
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [cart, setCart] = useState(() => JSON.parse(localStorage.getItem('qfl-cart') || '[]'));

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (current) => {
      setUser(current);
      if (current) { const snap = await getDoc(doc(db, 'users', current.uid)); setProfile(snap.exists() ? snap.data() : null); }
      else setProfile(null);
      setLoading(false);
    });
    return unsub;
  }, []);

  useEffect(() => localStorage.setItem('qfl-cart', JSON.stringify(cart)), [cart]);
  const cartCount = useMemo(() => cart.reduce((sum, item) => sum + item.qty, 0), [cart]);
  const addToCart = (product) => {
    if (!product.available) return;
    setCart((old) => { const found = old.find((i) => i.id === product.id); if (found) return old.map((i) => i.id === product.id ? { ...i, qty: i.qty + 1 } : i); return [...old, { id: product.id, name: product.name, price: Number(product.price), unit: product.unit || 'un', imageUrl: product.imageUrl || '', qty: 1 }]; });
  };

  if (loading) return <div className="screen-center">Carregando...</div>;

  return <AppContext.Provider value={{ user, profile, cart, setCart, addToCart, cartCount }}><Header /><Routes>
    <Route path="/" element={<Home />} />
    <Route path="/login" element={<Login />} />
    <Route path="/cadastro" element={<Register />} />
    <Route path="/redefinir-senha" element={<ResetPassword />} />
    <Route path="/carrinho" element={<Cart />} />
    <Route path="/pedidos" element={<Protected user={user}><MyOrders /></Protected>} />
    <Route path="/acompanhar" element={<Protected user={user}><TrackOrder /></Protected>} />
    <Route path="/admin" element={<AdminOnly user={user} profile={profile}><Admin /></AdminOnly>} />
    <Route path="/termos" element={<Terms />} />
    <Route path="/privacidade" element={<Privacy />} />
    <Route path="*" element={<NotFound />} />
  </Routes><Footer /></AppContext.Provider>;
}
