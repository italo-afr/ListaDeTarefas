import { Link } from 'react-router-dom';
import { Menu, CheckSquare, Calendar, Edit } from 'lucide-react'; 
import { useState } from 'react';
import styles from './HomePage.module.css';

export function HomePage() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const dashboardImgSrc = "/DashboardPrincipal.png";
  const calendarImgSrc = "/CriarNovaTarefaDashboard.png"; 

  return (
    <div className={styles.homeContainer}>
      {/* NAVBAR */}
      <header className={styles.navbar}>
        <div className={styles.logo}>TaskManager</div>
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
            Planeje, acompanhe e conclua suas metas. Transforme o caos em clareza com o TaskManager.
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
            <img src={calendarImgSrc} alt="Print do Calendário" />

        </div>
      </section>

      {/* SOBRE */}
      <section id="about" className={styles.about}>
        <h2>Sobre o projeto</h2>
        <p>
          Desenvolvido com as tecnologias mais modernas para uma experiência de usuário fluida e simples.
        </p>
      </section>
      
      {/* NOVO: Rodapé */}
      <footer className={styles.footer}>
        <p>&copy; {new Date().getFullYear()} TaskManager. Todos os direitos reservados.</p>
      </footer>
    </div>
  );
}