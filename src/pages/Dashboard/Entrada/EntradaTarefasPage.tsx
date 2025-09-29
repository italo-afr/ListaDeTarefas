import { useEffect, useState } from 'react';
import styles from './EntradaTarefas.module.css';
import { getIncompleteTasks, updateTaskCompletion, deleteTask } from '../../../components/GetSupabase/AllService';
import { Modal } from '../../../components/Modal/Modal';
import { ptBR } from 'date-fns/locale';
import { format, parseISO } from 'date-fns';
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate, useSearchParams } from 'react-router-dom';

export function EntradaTarefas() {
  const navigate = useNavigate();

  interface Task {
    id: number;
    title: string;
    description: string;
    finish_date: string;
    start_date: string;
    completed: boolean;
    completed_at: string | null;
  }

  const [searchParams] = useSearchParams();
  const taskId = searchParams.get("taskId");

  const [searchTerm, setSearchTerm] = useState('');
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [taskToDelete, setTaskToDelete] = useState<Task | null>(null);

  // Buscar tarefas pendentes
  useEffect(() => {
    const fetchTasks = async () => {
      setLoading(true);
      const { data, error } = await getIncompleteTasks();
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

  // Abrir modal se tiver taskId na URL
  useEffect(() => {
    if (taskId && tasks.length > 0) {
      const task = tasks.find(t => t.id === Number(taskId));
      if (task) {
        setSelectedTask(task);
        setIsModalOpen(true);
      }
    }
  }, [taskId, tasks]);

  // Modal trava scroll
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

  // --- Funções ---
  const handleDeleteTask = (taskIdToDelete: number) => {
    setTasks(currentTasks => currentTasks.filter(task => task.id !== taskIdToDelete));
    setTaskToDelete(null);
    deleteTask(taskIdToDelete).catch(err => {
      console.error("Erro ao deletar no servidor:", err);
    });
  };

  const handleCompleteTask = (taskIdToComplete: number) => {
    setTasks(currentTasks => currentTasks.filter(task => task.id !== taskIdToComplete));
    const completedAt = new Date().toISOString();
    updateTaskCompletion(taskIdToComplete, true, completedAt).catch(err => {
      console.error("Erro ao concluir no servidor:", err);
    });
  };

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

  if (loading) return <div className={styles.centeredMessage}>Carregando tarefas...</div>;
  if (error) return <div className={styles.centeredMessage}>{error}</div>;

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
              <motion.div
                key={task.id}
                layout
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, x: -50 }}
                transition={{ duration: 0.3 }}
                className={styles.taskCard}
                onClick={() => handleTaskClick(task)}
              >
                <h2>{task.title}</h2>
                <div className={styles.taskCard2Layer}>
                  {task.finish_date && (
                    <div className={styles.termDate}>
                      <span>
                        Prazo: {format(parseISO(task.finish_date), "dd 'de' MMMM, yyyy", { locale: ptBR })}
                      </span>
                    </div>
                  )}
                  <div className={styles.taskActions}>
                    <button onClick={(e) => { e.stopPropagation(); handleCompleteTask(task.id); }}>Concluir</button>
                    <button onClick={(e) => { e.stopPropagation(); navigate(`/dashboard/editar-tarefa/${task.id}`); }} className={styles.editButton}>Editar</button>
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
          <div className="modalContent">
            <h2>{selectedTask.title}</h2>
            <p>{selectedTask.description}</p>
          </div>
        )}
      </Modal>

      <Modal isOpen={!!taskToDelete} onClose={() => setTaskToDelete(null)}>
        {taskToDelete && (
          <div>
            <h2>Tem certeza que deseja deletar a tarefa?</h2>
            <p className={styles.taskTitle} style={{ marginTop: '2rem', fontWeight: 'bold' }}>
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
