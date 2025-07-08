import { Outlet } from 'react-router-dom';
import { Sidebar } from '../components/Sidebar/Sidebar';
import './DashboardLayout.css';

export function DashboardLayout() {
    return (
        <div className="dashboard-layout">
            <Sidebar />

            {/* A área de conteúdo dinâmico */}
            <main className="dashboard-content">
                <Outlet />
            </main>
        </div>
    );
}