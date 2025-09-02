import styles from './Concluido.module.css'
import { useEffect, useState } from 'react';
import { deleteTask, getTasksCompletion, updateTaskCompletion } from '../../../components/GetSupabase/AllService';

export function ConcluidoPage() {

    interface Task {
            id: number;
            title: string;
            description: string;
            date_check: string;
            completed: boolean;
        };
    
        const [tasks, setTasks] = useState<Task[]>([]);
        const [loading, setLoading] = useState(true);
        const [error, setError] = useState<string | null>(null);
    
        useEffect(() => {
            // Função para buscar os dados
            const fetchTasks = async () => {
                setLoading(true);
                setError(null);

                const { data, error } = await getTasksCompletion();

                if (error) {
                    console.error('Erro ao buscar tarefas:', error);
                    setError('Não foi possível carregar as tarefas.');
                } else if (data) {
                    setTasks(data);
                }
                setLoading(false);
            };
    
            fetchTasks();
        }, []);
    
        if (loading) {
            return <div className={styles.centeredMessage}>Carregando tarefas concluídas...</div>;
        }

        if (error) {
            return <div className={styles.centeredMessage}>{error}</div>;
        }

        const noCompletedTasks = async (taskId: number) => {
            const { error } = await updateTaskCompletion(taskId, false);
            if (error) {
                console.error('Erro ao desfazer tarefa:', error);
            } else {
                window.location.reload();
            }
        };

        const deleteTasks = async (taskId: number) => {
                const result = await deleteTask(taskId);
                if (result && result.error) {
                    console.error('Erro ao deletar tarefa:', result.error);
                } else {
                    window.location.reload();
                }
            };

    return (
        <div className={styles.ConcluidoPage}>
            <h1 className={styles.pageTitle}>Tarefas Concluídas</h1>
        
            {tasks.length === 0 ? (
                    <p className={styles.centeredMessage}>Você ainda não tem tarefas concluídas.</p>
                ) : (
                    <div className={styles.taskList}>
                        {/* .map() para criar um componente para cada tarefa na nossa lista */}
                        {tasks.map((task) => (
                            <div key={task.id} className={styles.taskCard}>
                                <h2>{task.title}</h2>
                                <p>{task.description}</p>
                                <div className={styles.taskActions}>
                                    <button onClick={() => noCompletedTasks(task.id)}>Desfazer{task.completed}</button>
                                    <button onClick={() => deleteTasks(task.id)}>Deletar</button>
                                </div>
                            </div>
                        ))}
                    </div>
            )}
        </div>
    );
}