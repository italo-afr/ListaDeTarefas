import { LayoutDashboard } from 'lucide-react';
import styles from './DashboardPage.module.css'; // Vamos usar CSS Modules

export function DashboardPage() {
    return (
        <div className={styles.welcomeContainer}>
            <div className={styles.iconWrapper}>
                <LayoutDashboard size={64} strokeWidth={1.5} />
            </div>
            <h1 className={styles.title}>Bem-vindo ao seu Painel</h1>
            <p className={styles.subtitle}>
                Tudo pronto para começar. Use o menu à esquerda para criar uma nova tarefa, ver sua caixa de entrada e organizar seu dia.
            </p>
        </div>
    );
}