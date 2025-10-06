import { Outlet } from 'react-router-dom';
import { Sidebar } from '../components/Sidebar/Sidebar';
import { useEffect, useState } from 'react';
import { getTasks, getUserProfile } from '../components/GetSupabase/AllService';
import styles from './DashboardLayout.module.css';
import type { AppProps } from '../App';
import { Menu } from 'lucide-react';


export function DashboardLayout({ theme, toggleTheme }: AppProps) {

    const [isSidebarOpen, setIsSidebarOpen] = useState(true);
    const [profile, setProfile] = useState<any>({});
    const [loading, setLoading] = useState(true);
    const [tasks, setTasks] = useState<any[]>([]);

    const toggleSidebar = () => {
        setIsSidebarOpen(prevState => !prevState); // Inverte o valor atual
    };


    useEffect(() => {
        const fetchTasks = async () => {
            const { data } = await getTasks();
            if (data) {
                setTasks(data);
            }
        };
        fetchTasks();
    }, []);

    useEffect(() => {
        const fetchProfile = async () => {
            setLoading(true);
            const userProfile = await getUserProfile();
            if (userProfile) {
                setProfile(userProfile);
            }
            setLoading(false);
        };
        fetchProfile();
    }, []);    

    return (
        <div className={styles.layout}>
            <button 
                className={styles.mobileMenuButton} 
                onClick={toggleSidebar}
                //onClick={() => setIsSidebarOpen(true)}
            >
                <Menu size={28} />
            </button>
            <Sidebar 
                theme={theme} 
                toggleTheme={toggleTheme} 
                tasks={tasks} 
                profile={profile}
                isOpen={isSidebarOpen} 
                onToggle={toggleSidebar}
            />
            <main className={styles.content}>
                <Outlet context={{ tasks, setTasks, profile, setProfile, loading }} />
            </main>
        </div>
    );
}