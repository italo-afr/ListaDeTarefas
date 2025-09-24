import { useEffect, useState } from 'react';
import styles from './EntradaTarefas.module.css';
import { getTasks, updateTaskCompletion, deleteTask } from '../../../components/GetSupabase/AllService';
import { Modal } from '../../../components/Modal/Modal';
import { ptBR } from 'date-fns/locale';
import { format } from 'date-fns';
import { motion, AnimatePresence } from "framer-motion";

export function EntradaTarefas() {
    interface Task {
        id: number;
        title: string;
        description: string;
        finish_date: string;
        start_date: string;
        completed: boolean;
        completed_at: string | null;
    }

    const [searchTerm, setSearchTerm] = useState('');
    const [tasks, setTasks] = useState<Task[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedTask, setSelectedTask] = useState<Task | null>(null);
    const [taskToDelete, setTaskToDelete] = useState<Task | null>(null);

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

    // Funções de controle do Modal (sem alterações)
    const handleDeleteTask = (taskIdToDelete: number) => {
  // 1. Atualização Otimista da UI: Remove a tarefa da lista local imediatamente
  setTasks(currentTasks => currentTasks.filter(task => task.id !== taskIdToDelete));
  
  // 2. Chama a API em segundo plano
  deleteTask(taskIdToDelete).catch(error => {
    console.error("Falha ao deletar no servidor:", error);
    // Opcional: Adicionar lógica para mostrar a tarefa de volta se a API falhar
  });
};

const handleCompleteTask = (taskIdToComplete: number) => {
  // A lógica é a mesma da exclusão: removemos a tarefa da lista de "Entrada"
  setTasks(currentTasks => currentTasks.filter(task => task.id !== taskIdToComplete));
  
  // E chamamos a API para marcar como concluída em segundo plano
  const completedAt = new Date().toISOString();
  updateTaskCompletion(taskIdToComplete, true, completedAt).catch(error => {
    console.error("Falha ao concluir no servidor:", error);
  });
};

    // Filtragem das tarefas com base no termo de busca
    const filteredTasks = tasks.filter(task =>
        task.title.toLowerCase().includes(searchTerm.toLowerCase())
    );

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
            <div className={styles.pageHeader}>
                <h1 className={styles.pageTitle}>Caixa de Entrada</h1>

                <div className={styles.searchContainer}>
                    <input
                        type="text"
                        placeholder="Pesquisar tarefas..."
                        className={styles.searchInput}
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
            </div>

            {tasks.length === 0 ? (
                <p className={styles.centeredMessage}>Você ainda não tem tarefas. Crie uma nova!</p>
            ) : (
                <div className={styles.taskList}>
                <AnimatePresence>
                    {filteredTasks.map((task) => (
                        <motion.div key={task.id} layout initial={{ opacity: 0, y: 50 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, x: -50 }} transition={{ duration: 0.3 }} className={styles.taskCard} onClick={() => handleTaskClick(task)}>
                            <h2>{task.title}</h2>
                            <div className={styles.taskCard2Layer}>
                                {task.finish_date && (
                                    <div className={styles.termDate}>
                                        <span>Prazo: {format(new Date(task.finish_date), "dd 'de' MMMM, yyyy", { locale: ptBR })}</span>
                                    </div>
                                )}
                                <div className={styles.taskActions}>
                                    <button onClick={(e) => { e.stopPropagation(); handleCompleteTask(task.id); }}>Concluir</button>
                                    <button onClick={(e) => { e.stopPropagation(); setTaskToDelete(task); }}>Deletar</button>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                    </AnimatePresence>
                </div>
            )}
            
            <Modal isOpen={isModalOpen} onClose={handleCloseModal}>
                {selectedTask && (
                    <div>
                        <h2>{selectedTask.title}</h2>
                        <p style={{ marginTop: '2rem', lineHeight: '1.6' }}>
                            {selectedTask.description}
                        </p>
                    </div>
                )}
            </Modal>
            <Modal isOpen={!!taskToDelete} onClose={() => setTaskToDelete(null)}>
                {taskToDelete && (
                    <div>
                        <h2>Tem certeza que deseja deletar a tarefa?</h2>
                        <p className={styles.taskTitle} style={{ marginTop: '2rem', fontWeight: 'bold' }}   >
                            {taskToDelete.title}
                        </p>
                        <div className={styles.modalActions}>
                            <button onClick={() => handleDeleteTask(taskToDelete.id)} className={styles.confirmButton}>Sim</button>
                            <button onClick={() => setTaskToDelete(null)} className={styles.cancelButton}>Não</button>
                        </div>
                    </div>
                )}
            </Modal>
        </div>
    );
}