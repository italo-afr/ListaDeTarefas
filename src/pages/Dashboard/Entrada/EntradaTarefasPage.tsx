import { useEffect, useState } from 'react';
import styles from './EntradaTarefas.module.css';
import { getTasks, updateTaskCompletion, deleteTask } from '../../../components/GetSupabase/AllService';
import { Modal } from '../../../components/Modal/Modal';
import { ptBR } from 'date-fns/locale';
import { format } from 'date-fns';

export function EntradaTarefas() {
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
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedTask, setSelectedTask] = useState<Task | null>(null);

    // useEffect para buscar as tarefas (sem alterações)
    useEffect(() => {
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

    // useEffect para controlar a classe do body (sem alterações)
    useEffect(() => {
        if (isModalOpen) {
            document.body.classList.add('modal-open');
        } else {
            document.body.classList.remove('modal-open');
        }
        return () => {
            document.body.classList.remove('modal-open');
        };
    }, [isModalOpen]);
    
    if (loading) {
        return <div className={styles.centeredMessage}>Carregando tarefas...</div>;
    }
    if (error) {
        return <div className={styles.centeredMessage}>{error}</div>;
    }

    const completedTask = async (taskId: number) => {
        const completedAt = new Date().toISOString();
        const { error } = await updateTaskCompletion(taskId, true, completedAt);
        if (error) {
            console.error('Erro ao concluir tarefa:', error);
        } else {
            window.location.reload();
        }
    };
    
    const deleteTasks = async (taskId: number) => {
        const { error } = await deleteTask(taskId);
        if (error) {
            console.error('Erro ao deletar tarefa:', error);
        } else {
            window.location.reload();
        }
    };

    // Funções de controle do Modal (sem alterações)
    const handleTaskClick = (task: Task) => {
        setSelectedTask(task);
        setIsModalOpen(true);
    };
    const handleCloseModal = () => {
        setIsModalOpen(false);
        setSelectedTask(null);
    };

    return (
        <div className={styles.pageContainer}>
            <h1 className={styles.pageTitle}>Caixa de Entrada</h1>

            {tasks.length === 0 ? (
                <p className={styles.centeredMessage}>Você ainda não tem tarefas. Crie uma nova!</p>
            ) : (
                <div className={styles.taskList}>
                    {tasks.map((task) => (
                        <div key={task.id} className={styles.taskCard} onClick={() => handleTaskClick(task)}>
                            <h2>{task.title}</h2>
                            <div className={styles.taskCard2Layer}>
                                {task.finish_date && (
                                    <div className={styles.termDate}>
                                        <span>Prazo: {format(new Date(task.finish_date), "dd 'de' MMMM, yyyy", { locale: ptBR })}</span>
                                    </div>
                                )}
                                <div className={styles.taskActions}>
                                    <button onClick={(e) => { e.stopPropagation(); completedTask(task.id); }}>Concluir</button>
                                    <button onClick={(e) => { e.stopPropagation(); deleteTasks(task.id); }}>Deletar</button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
            
            <Modal isOpen={isModalOpen} onClose={handleCloseModal}>
                {selectedTask && (
                    <div>
                        <h2>{selectedTask.title}</h2>
                        <p style={{ marginTop: '1rem', lineHeight: '1.6' }}>
                            {selectedTask.description}
                        </p>
                    </div>
                )}
            </Modal>
        </div>
    );
}