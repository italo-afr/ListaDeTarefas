import { NavLink, Link } from 'react-router-dom';
import styles from './Sidebar.module.css';
import { Sun, Moon, UserCircle, SquareCheckBig, CalendarDays, SquarePlus, CalendarClock, PanelLeft, Bell, Inbox, Folder, Trash2, FolderPlus } from 'lucide-react';
import { Modal } from '../../components/Modal/Modal';
import { useNavigate } from 'react-router-dom';
import { getTasks, getUserProfile, getProjects, createProject, deleteProject } from '../GetSupabase/AllService';
import { useState, useEffect, useRef } from 'react';
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

  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const profileMenuRef = useRef<HTMLDivElement>(null);

  // Modal para criação de novos projetos
  const [isProjectModalOpen, setIsProjectModalOpen] = useState(false);
  const [newProjectName, setNewProjectName] = useState('');
  const [projects, setProjects] = useState<Project[]>([]);
  const [projectToDelete, setProjectToDelete] = useState<any | null>(null);
  
  // Data de hoje em formato YYYY-MM-DD
  const todayString = new Date().toISOString().slice(0, 10);

  interface Project {
    id: number;
    name: string;
  }
  
  const getNavLinkClass = ({ isActive }: { isActive: boolean }) => {
    return isActive ? `${styles.navItem} ${styles.active}` : styles.navItem;
  };

  const handleCreateProject = async (e: React.FormEvent) => {
      e.preventDefault(); 
      if (!newProjectName.trim()) return; 

      const { data: newProject, error } = await createProject(newProjectName);

      if (error) {
          console.error("Erro ao criar projeto:", error);
          alert("Não foi possível criar o projeto.");
      } else if (newProject) {
          setProjects(currentProjects => [...currentProjects, newProject]);
          setNewProjectName(''); 
          setIsProjectModalOpen(false);
      }
  };

  const handleDeleteProject = async (projectId: number) => {
        setProjects(currentProjects => currentProjects.filter(p => p.id !== projectId));
        setProjectToDelete(null);
        const { error } = await deleteProject(projectId);
        if (error) {
            console.error("Falha ao apagar projeto:", error);
        }
    };

  interface UserProfile {
    full_name?: string;
  }

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
    const fetchProjects = async () => {
        const { data, error } = await getProjects();
        if (error) {
            console.error("Erro ao buscar projetos:", error);
        } else if (data) {
            setProjects(data);
        }
    };
    fetchProjects();
}, []);

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

  // Menu de perfil
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
        if (profileMenuRef.current && !profileMenuRef.current.contains(event.target as Node)) {
            setIsProfileMenuOpen(false);
        }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
        document.removeEventListener("mousedown", handleClickOutside);
    };
}, [profileMenuRef]);
  function handleLogout(event: React.MouseEvent<HTMLButtonElement, MouseEvent>): void {
    event.preventDefault();
    localStorage.removeItem('userToken'); 
    navigate('/login');
  }

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
      
      <div className={styles.projectsSection}>
        <div className={styles.projectsHeader}>
            <h2 className={styles.projectsTitle}>Projetos</h2>
             <button onClick={() => setIsProjectModalOpen(true)} className={styles.addProjectIconButton}><FolderPlus size={20} /></button>
        </div>
        <nav className={styles.projectsNav}>
            {projects.map(project => (
                <NavLink 
                    key={project.id} 
                    to={`/dashboard/project/${project.id}`}
                    className={({ isActive }) => `${styles.navItem} ${styles.projectLink} ${isActive ? styles.active : ''}`}
                >
                    <div className={styles.projectLinkContent}>
                        <div className={styles.projectIcon}>
                            <Folder size={18} />
                          </div>
                        <span>{project.name}</span>
                    </div>
                    <button 
                            onClick={(e) => {e.preventDefault(); e.stopPropagation(); setProjectToDelete(project);}} className={styles.deleteProjectButton}><Trash2 size={16} />
                        </button>
                </NavLink>
            ))}
        </nav>
    </div>

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
    <div className={styles.profileMenuContainer} ref={profileMenuRef}>
        {/* Este é o botão que abre/fecha o menu */}
        <button onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)} className={styles.navPerfil}>
            <UserCircle size={20} />
            <span>{profile.full_name || 'Meu Perfil'}</span>
        </button>
        {/* Menu suspenso */}
        {isProfileMenuOpen && (
            <div className={styles.profileMenu}>
                <Link to="/dashboard/perfil#nome" onClick={() => setIsProfileMenuOpen(false)}>
                    Alterar Nome
                </Link>
                <Link to="/dashboard/perfil#email" onClick={() => setIsProfileMenuOpen(false)}>
                    Alterar E-mail
                </Link>
                <Link to="/dashboard/perfil#senha" onClick={() => setIsProfileMenuOpen(false)}>
                    Alterar Senha
                </Link>
                <div className={styles.menuDivider}></div>
                  <button onClick={handleLogout} className={styles.logoutMenuItem}>
                      Sair
                  </button>
            </div>
        )}
    </div>
        <div className={styles.navNotificacao}>
          <Bell size={18} />
        </div>
        <button onClick={toggleTheme} className={styles.themeButton}>
          {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
        </button>

      </footer>

      {/* Modal para criar novos projetos */}
      <Modal isOpen={isProjectModalOpen} onClose={() => setIsProjectModalOpen(false)}>
        <form onSubmit={handleCreateProject}>
            <h2>Criar Novo Projeto</h2>
            <div className={styles.formGroup}>
                <label htmlFor="projectName">Nome do Projeto</label>
                <input
                    id="projectName"
                    type="text"
                    value={newProjectName}
                    onChange={(e) => setNewProjectName(e.target.value)}
                    placeholder="Ex: Estudos de React"
                    className={styles.input}
                />
            </div>
            <div className={styles.modalActions}>
                <button type="button" onClick={() => setIsProjectModalOpen(false)} className={styles.cancelButton}>
                    Cancelar
                </button>
                <button type="submit" className={styles.confirmButton}>
                    Criar
                </button>
            </div>
        </form>
    </Modal>
      {/* Modal para confirmar exclusão de projeto */}
    <Modal isOpen={!!projectToDelete} onClose={() => setProjectToDelete(null)}>
                {projectToDelete && (
                    <div>
                        <h2>Apagar Projeto?</h2>
                        <p>A ação não pode ser desfeita. As tarefas dentro de <strong>"{projectToDelete.name}"</strong> serão movidas para a Caixa de Entrada.</p>
                        <div className={styles.modalActions}>
                            <button onClick={() => setProjectToDelete(null)} className={styles.cancelButton}>Cancelar</button>
                            <button onClick={() => handleDeleteProject(projectToDelete.id)} className={styles.confirmButtonDanger}>Sim, apagar</button>
                        </div>
                    </div>
                )}
            </Modal>
    </div>
  );
};