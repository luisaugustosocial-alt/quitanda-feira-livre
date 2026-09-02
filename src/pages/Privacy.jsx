import { PRIVACY_VERSION } from '../legal';

export default function Privacy(){
 return <main className="legal-page"><article className="legal-card">
  <span className="tag green">LGPD</span><h1>Política de Privacidade</h1>
  <p className="legal-meta">Versão {PRIVACY_VERSION} • última atualização: 28 de agosto de 2026.</p>
  <p>A Quitanda Feira Livre respeita a privacidade dos usuários e trata dados pessoais para operar cadastro, pedidos, atendimento e entrega. Esta Política foi estruturada com referência à Lei nº 13.709/2018, a Lei Geral de Proteção de Dados Pessoais (LGPD).</p>
  <h2>1. Controlador dos dados</h2><p>Responsável/controlador: <strong>[PREENCHER RAZÃO SOCIAL OU RESPONSÁVEL]</strong><br/>CNPJ/CPF: <strong>[PREENCHER]</strong><br/>Endereço: <strong>[PREENCHER]</strong><br/>Canal para assuntos de privacidade: <strong>[PREENCHER E-MAIL/WHATSAPP]</strong>.</p>
  <h2>2. Dados que podemos tratar</h2><p>Podemos tratar nome, e-mail, telefone, nome de usuário, identificador interno da conta, endereço de entrega, referência do endereço, histórico e itens dos pedidos, forma escolhida para pagamento na entrega, status do pedido e registros técnicos necessários à segurança e funcionamento do serviço.</p>
  <h2>3. Para que os dados são usados</h2><p>Os dados são utilizados para criar e autenticar a conta, receber e preparar pedidos, realizar e acompanhar entregas, entrar em contato sobre a compra, oferecer suporte, prevenir fraude e abuso, manter a segurança do sistema, cumprir obrigações legais e exercer direitos em processos administrativos ou judiciais quando necessário.</p>
  <h2>4. Bases legais</h2><p>O tratamento poderá ocorrer, conforme o caso, para execução de contrato ou procedimentos preliminares relacionados ao pedido, cumprimento de obrigação legal ou regulatória, exercício regular de direitos, proteção contra fraude e, quando aplicável, mediante consentimento.</p>
  <h2>5. Pagamento</h2><p>O site não recebe nem armazena dados completos de cartão e não processa pagamentos online. O método escolhido pelo cliente é registrado apenas para orientar o pagamento na entrega.</p>
  <h2>6. Compartilhamento</h2><p>Os dados poderão ser compartilhados apenas quando necessário com prestadores que apoiem hospedagem, autenticação, banco de dados, imagens, comunicação ou operação tecnológica, bem como com autoridades quando houver obrigação legal. Esses prestadores devem receber somente os dados necessários à finalidade do serviço.</p>
  <h2>7. Serviços utilizados</h2><p>O projeto pode utilizar Firebase para autenticação e banco de dados, Cloudinary para hospedagem de imagens de produtos e Vercel para hospedagem do site. Cada fornecedor possui suas próprias práticas e políticas de segurança e privacidade.</p>
  <h2>8. Conservação e exclusão</h2><p>Os dados são mantidos pelo período necessário às finalidades informadas e aos prazos legais aplicáveis. Quando possível e permitido por lei, informações que deixarem de ser necessárias poderão ser eliminadas ou anonimizadas.</p>
  <h2>9. Direitos do titular</h2><p>O titular poderá solicitar, nos termos da legislação aplicável, confirmação da existência de tratamento, acesso, correção, anonimização, bloqueio ou eliminação de dados inadequados ou excessivos, informações sobre compartilhamentos, portabilidade quando aplicável, revogação de consentimento e demais direitos previstos na LGPD.</p>
  <h2>10. Segurança</h2><p>São adotadas medidas técnicas e administrativas para restringir o acesso aos dados. O sistema utiliza autenticação e regras de acesso para separar informações de clientes e funções administrativas. Nenhum sistema, entretanto, consegue garantir risco zero.</p>
  <h2>11. Crianças e adolescentes</h2><p>O serviço não é direcionado especificamente a crianças. Caso seja identificado tratamento inadequado de dados de criança ou adolescente, o responsável poderá contatar a Quitanda Feira Livre para análise e providências cabíveis.</p>
  <h2>12. Atualizações desta Política</h2><p>Esta Política poderá ser atualizada para refletir mudanças no serviço ou em requisitos legais. A versão vigente ficará disponível nesta página e, quando necessário, poderá ser solicitado novo aceite.</p>
  <h2>13. Contato</h2><p>Para solicitações relacionadas a dados pessoais e privacidade: <strong>[PREENCHER CANAL OFICIAL]</strong>.</p>
  <p className="legal-note">Antes da publicação definitiva, preencha os dados do controlador e revise esta Política de acordo com a operação real da empresa.</p>
 </article></main>;
}
