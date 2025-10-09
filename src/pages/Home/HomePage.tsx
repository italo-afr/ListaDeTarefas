import { Link } from 'react-router-dom';
import { Menu, CheckSquare, Calendar, Edit } from 'lucide-react'; 
import { useState } from 'react';
import styles from './HomePage.module.css';

export function HomePage() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const dashboardImgSrc = "/DashboardPrincipal.png";
  const NovaTarefaImgSrc = "/CriarNovaTarefaDashboard.png";
  const calendarViewImgSrc = "/Calendario.png";

  return (
    <div className={styles.homeContainer}>
      {/* NAVBAR */}
      <header className={styles.navbar}>
        <div className={styles.logo}>Lista de Tarefas</div>
        <nav className={`${styles.navLinks} ${isMenuOpen ? styles.open : ''}`}>
          <a href="#features">Funcionalidades</a>
          <a href="#about">Sobre</a>
          <Link to="/dashboard" className={styles.navButton}>Acessar Painel</Link>
        </nav>
        <button className={styles.menuButton} onClick={() => setIsMenuOpen(!isMenuOpen)}>
          <Menu size={28} />
        </button>
      </header>

      {/* HERO */}
      <main className={styles.hero}>
        <div className={styles.heroContent}>
          <h1 className={styles.title}>A maneira simples de organizar seu trabalho e sua vida.</h1>
          <p className={styles.subtitle}>
            Planeje, acompanhe e conclua suas metas. Transforme o caos em clareza com o Lista de Tarefas.
          </p>
          <div className={styles.heroButtons}>
            <Link to="/dashboard" className={styles.ctaButton}>Comece a usar gratuitamente</Link>
          </div>
        </div>
      </main>

      <section id="features" className={styles.features}>
        <div className={styles.featureCard}>
          <CheckSquare size={40} className={styles.featureIcon} />
          <h3>Crie e Gerencie</h3>
          <p>Adicione, edite e conclua tarefas com facilidade. Mantenha tudo sob controlo.</p>
        </div>
        <div className={styles.featureCard}>
          <Calendar size={40} className={styles.featureIcon} />
          <h3>Visualize no Calendário</h3>
          <p>Veja suas tarefas distribuídas ao longo do mês para um melhor planeamento.</p>
        </div>
        <div className={styles.featureCard}>
          <Edit size={40} className={styles.featureIcon} />
          <h3>Personalize Tudo</h3>
          <p>Defina datas, horários e prioridades. Adapte o sistema ao seu fluxo de trabalho.</p>
        </div>
      </section>

      {/* PRINTS DO DASHBOARD */}
      <section className={styles.dashboardPreview}>
        <h2>Uma interface limpa, feita para focar no que importa</h2>
        <div className={styles.imageContainer}>
            <img src={dashboardImgSrc} alt="Print do Dashboard" />
            <img src={NovaTarefaImgSrc} alt="Print do Envio de Tarefas" />
            <img src={calendarViewImgSrc} alt="Print da Visualização do Calendário" className={styles.fullWidthImage} />
        </div>
      </section>

      {/* SOBRE */}
      <section id="about" className={styles.about}>
  <h2>Sobre o Projeto</h2>
  
  <p>
    Bem-vindo ao <strong>TaskManager</strong>, um projeto nascido da paixão por desenvolvimento de software e pela busca de produtividade. 
    Na agitação do dia a dia, é fácil perder o controlo de prazos e responsabilidades. Esta aplicação foi criada para ser a solução: 
    uma ferramenta poderosa, mas intuitiva, para gerir tudo, desde as tarefas mais simples do quotidiano até aos projetos mais complexos.
  </p>

  <h3 className={styles.subtitle}>Funcionalidades Principais</h3>
  <ul>
    <li><strong>Gestão Completa de Tarefas:</strong> Crie, edite, conclua e apague tarefas com uma interface rápida e animada.</li>
    <li><strong>Organização por Projetos:</strong> Agrupe as suas tarefas em listas ou projetos personalizáveis.</li>
    <li><strong>Detalhes Avançados:</strong> Atribua datas, horários e cores para uma identificação visual imediata.</li>
    <li><strong>Calendário Interativo:</strong> Visualize as tarefas em vistas de mês, semana ou dia, e edite com um clique.</li>
    <li><strong>Lembretes Automáticos:</strong> Receba e-mails de lembrete para garantir que nunca perca um prazo.</li>
    <li><strong>Perfil de Usuário:</strong> Altere nome, e-mail ou senha em uma página dedicada e segura.</li>
    <li><strong>Design Moderno e Responsivo:</strong> Experiência consistente em qualquer dispositivo, com tema claro e escuro.</li>
  </ul>

  <h3>A Tecnologia por Trás do Projeto</h3>
  <ul>
    <li><strong>Frontend:</strong> Construído com React e TypeScript, usando Vite para alta performance.</li>
    <li><strong>Backend e Base de Dados:</strong> Supabase com PostgreSQL, autenticação e funções de banco de dados.</li>
    <li><strong>Automação:</strong> Notificações orquestradas pelo Make.com e enviadas pelo Resend.</li>
    <li><strong>Estilo e UX:</strong> CSS Modules e animações com Framer Motion para uma interface viva.</li>
    <li><strong>Navegação e Datas:</strong> React Router DOM e manipulação confiável de datas com Moment.js e date-fns.</li>
  </ul>
</section>

      
      {/* NOVO: Rodapé */}
      <footer className={styles.footer}>
        <p>&copy; {new Date().getFullYear()} Lista de Tarefas. Todos os direitos reservados.</p>
      </footer>
    </div>
  );
}