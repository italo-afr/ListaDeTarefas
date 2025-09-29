import { NavLink } from 'react-router-dom';
import styles from './Sidebar.module.css';
import { Sun, Moon, UserCircle, SquareCheckBig, CalendarDays, SquarePlus, CalendarClock, PanelLeft, Bell, Inbox } from 'lucide-react';
import { supabase } from '../../config/supabaseClient';
import { useNavigate } from 'react-router-dom';
import { getTasks, getUserProfile } from '../GetSupabase/AllService';
import { useState, useEffect } from 'react';
import type { AppProps } from '../../App';

interface Task {
  id: number;
  title: string;
  finish_date: string;
}

interface SidebarProps extends AppProps {
    theme: string;
    toggleTheme: () => void;
    tasks: any[];
}

export const Sidebar = ({ toggleTheme, theme }: SidebarProps) => {

  const navigate = useNavigate();

  const [profile, setProfile] = useState<UserProfile>({});
  const [layersVisible, setLayersVisible] = useState(true);
  const [localTasks, setLocalTasks] = useState<Task[]>([]);
  
  const todayString = new Date().toISOString().slice(0, 10);

  const getNavLinkClass = ({ isActive }: { isActive: boolean }) => {
    return isActive ? `${styles.navItem} ${styles.active}` : styles.navItem;
  };

  interface UserProfile {
    full_name?: string;
  }

  const handleLogout = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      console.error('Erro ao fazer logout:', error);
    } else {
      navigate('/');
    }
  };

  const fetchUserProfile = async () => {
    const profile = await getUserProfile();
    if (profile && 'full_name' in profile) {
      setProfile(profile);
      console.log("Perfil do usuário:", profile);
    } else {
      setProfile({ full_name: '' });
      console.log("Perfil do usuário não encontrado ou inválido:", profile);
    }
  };

  useEffect(() => {
    const fetchTasks = async () => {
      const { data, error } = await getTasks();

      if (error) {
        console.error('Erro ao buscar tarefas:', error);
      } else if (data) {
        setLocalTasks(data);
      }
      fetchUserProfile();
    };
    fetchTasks();
  }, []);

  return (
    <div className={`${styles.sidebar} ${!layersVisible ? styles.sidebarClosed : ''}`}>
      <header className={styles.header}>
        <h1 className={styles.title}>Gerenciando Tarefas</h1>
        <div className={styles.menu} onClick={() => setLayersVisible(!layersVisible)}>
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
        <NavLink to="/dashboard/concluido" className={getNavLinkClass}>
          <SquareCheckBig size={20} />
          <span>Concluído</span>
        </NavLink>
        <NavLink to="/dashboard/calendario" className={getNavLinkClass}>
          <CalendarDays size={20} />
          <span>Calendário</span>
        </NavLink>
      </nav>

      <div className={styles.todayTasks}>
          <nav className={styles.navToday}>
            <span className={styles.navTodayText}>Encerram hoje</span>
          </nav>
          <div className={styles.navTodayTasks}>
            <CalendarClock size={20}/>
          </div>
      </div>

      <div className={styles.todayTasksList}>
        {localTasks
            .filter(task => task.finish_date === todayString)
            .map((task, index) => (
                <div key={index} className={styles.todayTask} onClick={() => navigate(`/dashboard/entrada?taskId=${task.id}`)}>
                    <span>{task.title}</span>
                </div>
        ))}
      </div>

      <footer className={styles.footer}>
        <div className={styles.userActions}>
          <a href="#" className={styles.navPerfil}>
            <UserCircle size={20} />
            <span>{profile.full_name}</span>
          </a>
          <button onClick={handleLogout} className={styles.logoutButton}>Sair</button>
        </div>
        <div className={styles.navNotificacao}>
          <Bell size={18} />
        </div>
        <button onClick={toggleTheme} className={styles.themeButton}>
          {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
        </button>

      </footer>
    </div>
  );
};