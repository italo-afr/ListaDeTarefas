import { Outlet } from 'react-router-dom';
import { Sidebar } from '../components/Sidebar/Sidebar';
import { useEffect } from 'react';
import { getTasks } from '../components/GetSupabase/AllService';
import styles from './DashboardLayout.module.css';
import type { AppProps } from '../App';
import { useState } from 'react';


export function DashboardLayout({ theme, toggleTheme }: AppProps) {

    const [tasks, setTasks] = useState<any[]>([]);

    useEffect(() => {
        const fetchTasks = async () => {
            const { data } = await getTasks();
            if (data) {
                setTasks(data);
            }
        };
        fetchTasks();
    }, []);

    

    return (
        <div className={styles.layout}>
            <Sidebar theme={theme} toggleTheme={toggleTheme} tasks={tasks}/>
            <main className={styles.content}>
                <Outlet context={{ tasks, setTasks }} /> 
            </main>
        </div>
    );
}