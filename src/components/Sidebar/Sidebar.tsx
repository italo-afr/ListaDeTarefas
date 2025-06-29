import styles from './Sidebar.module.css';
import { UserCircle, Archive, SquareCheckBig, CalendarDays, SquarePlus, CalendarClock, PanelLeft, Bell, Inbox } from 'lucide-react'; // https://lucide.dev/icons/archive

export const Sidebar = () => {
  return (
    <div className={styles.sidebar}>
      <header className={styles.header}>
        <h1 className={styles.title}>Gerenciando Tarefas</h1>
        <div className={styles.menu}>
          <PanelLeft size={20} />
        </div>
      </header>
      <nav className={styles.nav}>
        <a href="#" className={styles.navItem}>
          <SquarePlus size={20} />
          <span>Nova Tarefa</span>
        </a>
        <a href="#" className={styles.navItem}>
          <Inbox size={20} />
          <span>Entrada</span>
        </a>
        <a href="#" className={styles.navItem}>
          <CalendarClock size={20} />
          <span>Hoje</span>
        </a>
        <a href="#" className={styles.navItem}>
          <SquareCheckBig size={20} />
          <span>Concluído</span>
        </a>
        <a href="#" className={styles.navItem}>
          <Archive size={20} />
          <span>Arquivadas</span>
        </a>
        <a href="#" className={styles.navItem}>
          <CalendarDays size={20} />
          <span>Calendário</span>
        </a>
      </nav>
      <nav className={styles.nav}>
        <span className={styles.navItemPrimary}>Minhas tarefas</span>
      </nav>
      <footer className={styles.footer}>
        <a href="#" className={styles.navPerfil}>
          <UserCircle size={20} />
          <span>Perfil do usuário</span>
        </a>
        <div className={styles.navNotificacao}>
          <Bell size={18} />
        </div>
      </footer>
    </div>
  );
};