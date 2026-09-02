import { Link } from 'react-router-dom';

export default function Footer(){
  return <footer className="footer">
    <div><strong>Quitanda Feira Livre</strong><p>Santa Maria da Vitória/BA</p></div>
    <div className="footer-links"><Link to="/termos">Termos de Uso</Link><Link to="/privacidade">Política de Privacidade</Link></div>
    <small>© {new Date().getFullYear()} Quitanda Feira Livre. Todos os direitos reservados.</small>
  </footer>;
}
