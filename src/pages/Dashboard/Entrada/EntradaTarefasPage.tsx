import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './EntradaTarefas.module.css';
import { getTasks, updateTaskCompletion, deleteTask } from '../../../components/GetSupabase/AllService';
import { ptBR } from 'date-fns/locale';
import { format } from 'date-fns';

export function EntradaTarefas() {
    const navigate = useNavigate();

    interface Task {
        id: number;
        title: string;
        description: string;
        finish_date: string;
        start_date: string;
        completed: boolean;
    }

    const [tasks, setTasks] = useState<Task[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        // Função para buscar os dados
        const fetchTasks = async () => {
            setLoading(true);
            setError(null);

            const { data, error } = await getTasks();

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
        return <div className={styles.centeredMessage}>Carregando tarefas...</div>;
    }

    if (error) {
        return <div className={styles.centeredMessage}>{error}</div>;
    }

    interface CompletedTaskParams {
        taskId: number;
    }

    const completedTask = async (taskId: CompletedTaskParams['taskId']) => {
        const { error } = await updateTaskCompletion(taskId, true);
        if (error) {
            console.error('Erro ao concluir tarefa:', error);
        } else {
            console.log(`Tarefa ${taskId} concluída`);
            navigate('/dashboard/concluido');
        }
    }

    const deleteTasks = async (taskId: number) => {
        const result = await deleteTask(taskId);
        if (result && result.error) {
            console.error('Erro ao deletar tarefa:', result.error);
        } else {
            navigate('/dashboard');
        }
    }

    return (
        <div className={styles.pageContainer}>
            <h1 className={styles.pageTitle}>Caixa de Entrada</h1>

            {tasks.length === 0 ? (
                <p className={styles.centeredMessage}>Você ainda não tem tarefas. Crie uma nova!</p>
            ) : (
                <div className={styles.taskList}>
                    {/* .map() para criar um componente para cada tarefa na nossa lista */}
                    {tasks.map((task) => (
                        <div key={task.id} className={styles.taskCard}>
                            <h2>{task.title}</h2>
                            <p>{task.description}</p>
                            <div className={styles.taskCard2Layer}>
                                {task.finish_date && (
                                    <div className={styles.termDate}>
                                        <span>Prazo: {format(new Date(task.finish_date), 'dd \'de\' MMMM, yyyy', { locale: ptBR })}</span>
                                    </div>
                                )}
                                
                                <div className={styles.taskActions}>
                                    <button onClick={() => completedTask(task.id)}>Concluir</button>
                                    <button onClick={() => deleteTasks(task.id)}>Deletar</button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}

