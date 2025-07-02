import { Sidebar } from "../../components/Sidebar/Sidebar";
import './App.css';
import DescricaoTarefas from "../../components/CreateTarefas/DescricaoTarefas";


export function DashboardPage() {
    return (
        <div className="app-container">
            <Sidebar />
            <DescricaoTarefas />
        </div>
    );
}