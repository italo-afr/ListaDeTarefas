import { Outlet } from 'react-router-dom';
import { Sidebar } from '../components/Sidebar/Sidebar';
import './DashboardLayout.css';
import type { AppProps } from '../App';

export function DashboardLayout({ theme, toggleTheme }: AppProps) {

    return (
        <div className="dashboard-layout">
            <Sidebar toggleTheme={toggleTheme} theme={theme} />
            {/* A área de conteúdo dinâmico */}
            <main className="dashboard-content">
                <Outlet />
            </main>
        </div>
    );
}