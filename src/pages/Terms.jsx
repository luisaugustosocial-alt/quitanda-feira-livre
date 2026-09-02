import { Link } from 'react-router-dom';
import { TERMS_VERSION } from '../legal';

export default function Terms(){
 return <main className="legal-page"><article className="legal-card">
  <span className="tag red">DOCUMENTO LEGAL</span><h1>Termos de Uso</h1>
  <p className="legal-meta">Versão {TERMS_VERSION} • última atualização: 28 de agosto de 2026.</p>
  <p>Estes Termos regulam o uso do site da <strong>Quitanda Feira Livre</strong>, unidade de Santa Maria da Vitória/BA. Ao criar uma conta, acessar o catálogo ou enviar um pedido, o usuário declara que leu e concorda com estas condições.</p>
  <h2>1. Identificação do estabelecimento</h2><p>Razão social/nome empresarial: <strong>[PREENCHER]</strong><br/>CNPJ/CPF do responsável: <strong>[PREENCHER]</strong><br/>Endereço comercial: <strong>[PREENCHER]</strong><br/>Telefone/WhatsApp: <strong>[PREENCHER]</strong><br/>E-mail de contato: <strong>[PREENCHER]</strong>.</p>
  <h2>2. Cadastro e conta</h2><p>O usuário deve fornecer informações verdadeiras e atualizadas. A conta é pessoal, e a senha não deve ser compartilhada. O usuário é responsável pelas atividades realizadas em sua conta e deve comunicar suspeitas de acesso indevido.</p>
  <h2>3. Catálogo, preços e disponibilidade</h2><p>Produtos, preços, unidades de venda, imagens e disponibilidade são administrados pela Quitanda Feira Livre e podem ser atualizados. Um item exibido no catálogo pode ficar indisponível antes da separação do pedido. Quando houver divergência relevante, a loja poderá contatar o cliente para substituição, ajuste ou cancelamento do item.</p>
  <h2>4. Pedidos</h2><p>O envio do pedido pelo site registra a solicitação do cliente e gera um código de acompanhamento. A confirmação do atendimento depende da disponibilidade dos produtos e da área de entrega. O cliente poderá acompanhar o status do pedido pela sua conta.</p>
  <h2>5. Pagamento</h2><p>O site <strong>não processa pagamentos online</strong>. O cliente escolhe, no pedido, uma forma disponibilizada para pagamento na entrega, como dinheiro, PIX ou cartão. A conclusão do pagamento ocorre diretamente com a Quitanda Feira Livre no momento da entrega ou conforme orientação da loja.</p>
  <h2>6. Entrega</h2><p>Prazo, taxa de entrega, área atendida e condições de recebimento poderão variar. Informações específicas serão apresentadas no pedido ou confirmadas pela loja. O cliente deve fornecer endereço e telefone corretos e manter alguém disponível para receber a compra.</p>
  <h2>7. Cancelamentos, trocas e problemas com produtos</h2><p>Solicitações relacionadas a cancelamentos, falta de itens, divergência, qualidade, avaria ou entrega devem ser comunicadas à loja pelos canais oficiais. Os direitos legalmente assegurados ao consumidor permanecem preservados.</p>
  <h2>8. Uso adequado do site</h2><p>É proibido tentar invadir o sistema, acessar dados de terceiros, automatizar abuso do serviço, fornecer informações falsas deliberadamente ou utilizar a plataforma para finalidade ilícita.</p>
  <h2>9. Disponibilidade do sistema</h2><p>A Quitanda Feira Livre poderá realizar manutenção e correções no site. Não é garantida disponibilidade ininterrupta quando houver falhas técnicas, manutenção, indisponibilidade de serviços de terceiros ou eventos fora do controle razoável da loja.</p>
  <h2>10. Privacidade</h2><p>O tratamento de dados pessoais é explicado na <Link to="/privacidade">Política de Privacidade</Link>, que integra estes Termos.</p>
  <h2>11. Alterações</h2><p>Estes Termos poderão ser atualizados. Quando uma alteração exigir novo aceite, o usuário poderá ser solicitado a concordar com a versão atualizada antes de continuar utilizando determinadas funções.</p>
  <h2>12. Contato</h2><p>Dúvidas sobre estes Termos poderão ser encaminhadas para: <strong>[PREENCHER E-MAIL/WHATSAPP OFICIAL]</strong>.</p>
  <p className="legal-note">Este texto é um modelo inicial para o projeto e deve ter os dados empresariais conferidos pelo responsável da Quitanda Feira Livre antes da publicação definitiva.</p>
 </article></main>;
}
