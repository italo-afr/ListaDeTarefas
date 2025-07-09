// src/components/Sidebar/Sidebar.tsx

import { NavLink } from 'react-router-dom';
import styles from './Sidebar.module.css';
import { UserCircle, Archive, SquareCheckBig, CalendarDays, SquarePlus, CalendarClock, PanelLeft, Bell, Inbox } from 'lucide-react';

export const Sidebar = () => {
  const getNavLinkClass = ({ isActive }: { isActive: boolean }) => {
    return isActive ? `${styles.navItem} ${styles.active}` : styles.navItem;
  };

  return (
    <div className={styles.sidebar}>
      <header className={styles.header}>
        <h1 className={styles.title}>Gerenciando Tarefas</h1>
        <div className={styles.menu}>
          <PanelLeft size={20} />
        </div>
      </header>
      <nav className={styles.nav}>
        <NavLink to="/dashboard/nova-tarefa" className={getNavLinkClass}>
          <SquarePlus size={20} />
          <span>Nova Tarefa</span>
        </NavLink>
        <NavLink to="/dashboard/entrada" className={getNavLinkClass}>
          <Inbox size={20} />
          <span>Entrada</span>
        </NavLink>
        <NavLink to="/dashboard/hoje" className={getNavLinkClass}>
          <CalendarClock size={20} />
          <span>Hoje</span>
        </NavLink>
        <NavLink to="/dashboard/concluido" className={getNavLinkClass}>
          <SquareCheckBig size={20} />
          <span>Concluído</span>
        </NavLink>
        <NavLink to="/dashboard/arquivadas" className={getNavLinkClass}>
          <Archive size={20} />
          <span>Arquivadas</span>
        </NavLink>
        <NavLink to="/dashboard/calendario" className={getNavLinkClass}>
          <CalendarDays size={20} />
          <span>Calendário</span>
        </NavLink>
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