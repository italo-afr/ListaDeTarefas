import './App.css';
import { DescricaoTarefas } from "./DescricaoTarefas/DescricaoTarefasPage";


export function DashboardPage() {
    return (
        <div className="app-container">
            <DescricaoTarefas />
        </div>
    );
}