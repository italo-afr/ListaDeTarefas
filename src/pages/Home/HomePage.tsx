import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import styles from './HomePage.module.css';

export function HomePage() {
    return (
        <div className={styles.homeContainer}>
            <main className={styles.content}>
                <h1 className={styles.title}>
                    Organize seu dia.
                </h1>
                <p className={styles.subtitle}>
                    Bem-vindo ao seu novo Gerenciador de Tarefas.
                </p>
                <Link to="/dashboard" className={styles.ctaButton}>
                    <span>Acessar painel</span>
                    <ArrowRight size={20} />
                </Link>
            </main>
        </div>
    );
}