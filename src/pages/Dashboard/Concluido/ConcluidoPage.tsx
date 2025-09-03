import styles from './Concluido.module.css'
import { useEffect, useState } from 'react';
import { Modal } from '../../../components/Modal/Modal';
import { deleteTask, getTasksCompletion, updateTaskCompletion } from '../../../components/GetSupabase/AllService';
import { ptBR } from 'date-fns/locale';
import { format } from 'date-fns';

export function ConcluidoPage() {

    interface Task {
            id: number;
            title: string;
            description: string;
            date_check: string;
            completed: boolean;
            completed_at: string | null;
        };
    
        const [tasks, setTasks] = useState<Task[]>([]);
        const [loading, setLoading] = useState(true);
        const [error, setError] = useState<string | null>(null);
        const [isModalOpen, setIsModalOpen] = useState(false);
        const [selectedTask, setSelectedTask] = useState<Task | null>(null);
        const [taskToDelete, setTaskToDelete] = useState<Task | null>(null);

    
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
            return <div className={styles.centeredMessage}>Carregando tarefas concluídas...</div>;
        }

        if (error) {
            return <div className={styles.centeredMessage}>{error}</div>;
        }

        const noCompletedTasks = async (taskId: number) => {
            const { error } = await updateTaskCompletion(taskId, false, null);
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

    const handleTaskClick = (task: Task) => {
        setSelectedTask(task);
        setIsModalOpen(true);
    };
    const handleCloseModal = () => {
        setIsModalOpen(false);
        setSelectedTask(null);
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
                            <div key={task.id} className={styles.taskCard} onClick={() => handleTaskClick(task)}>
                                <h2>{task.title}</h2>
                                <div className={styles.taskDetails}>
                                    <div className={styles.taskInfo}>
                                        <span>
                                            Concluída em: {task.completed_at ? format(new Date(task.completed_at), "dd 'de' MMMM, yyyy", { locale: ptBR }) : "Data não disponível"}
                                        </span>
                                    </div>
                                    <div className={styles.taskActions}>
                                        <button onClick={() => noCompletedTasks(task.id)}>Desfazer{task.completed}</button>
                                        <button onClick={(e) => { e.stopPropagation(); setTaskToDelete(task); }}>Deletar</button>
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
            <Modal isOpen={!!taskToDelete} onClose={() => setTaskToDelete(null)}>
                {taskToDelete && (
                    <div>
                        <h2>Tem certeza que deseja deletar a tarefa?</h2>
                        <p className={styles.taskTitle} style={{ marginTop: '1rem', fontWeight: 'bold' }}   >
                            {taskToDelete.title}
                        </p>
                        <div className={styles.modalActions}>
                            <button onClick={() => deleteTasks(taskToDelete.id)} className={styles.confirmButton}>Sim</button>
                            <button onClick={() => setTaskToDelete(null)} className={styles.cancelButton}>Não</button>
                        </div>
                    </div>
                )}
            </Modal>
        </div>
    );
}