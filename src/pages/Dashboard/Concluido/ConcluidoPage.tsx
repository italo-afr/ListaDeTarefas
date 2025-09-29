import styles from './Concluido.module.css';
import { useEffect, useState } from 'react';
import { Modal } from '../../../components/Modal/Modal';
import { deleteTask, getTasksCompletion, updateTaskCompletion } from '../../../components/GetSupabase/AllService';
import { ptBR } from 'date-fns/locale';
import { format } from 'date-fns';
import { motion, AnimatePresence } from 'framer-motion';

export function ConcluidoPage() {
  interface Task {
    id: number;
    title: string;
    description: string;
    completed: boolean;
    completed_at: string | null;
  };

  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [selectedTask, setSelectedTask] = useState<Task | null>(null); 
  const [taskToDelete, setTaskToDelete] = useState<Task | null>(null);  

  // Buscar concluídas
  const fetchTasks = async () => {
    setLoading(true);
    const { data, error } = await getTasksCompletion();
    if (error) {
      console.error('Erro ao buscar tarefas:', error);
      setError('Não foi possível carregar as tarefas.');
    } else if (data) {
      setTasks(data);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  useEffect(() => {
    if (selectedTask || taskToDelete) {
      document.body.classList.add('modal-open');
    } else {
      document.body.classList.remove('modal-open');
    }
    return () => {
      document.body.classList.remove('modal-open');
    };
  }, [selectedTask, taskToDelete]);

  const handleUndoTask = async (taskId: number) => {
    await updateTaskCompletion(taskId, false, null);
    fetchTasks(); // 🔑 refaz o fetch para refletir no banco
  };

  const handleDeleteTask = async (taskId: number) => {
    await deleteTask(taskId);
    fetchTasks();
    setTaskToDelete(null);
  };

  const handleTaskClick = (task: Task) => setSelectedTask(task);
  const handleCloseModal = () => setSelectedTask(null);

  if (loading) return <div className={styles.centeredMessage}>Carregando tarefas concluídas...</div>;
  if (error) return <div className={styles.centeredMessage}>{error}</div>;

  return (
    <div className={styles.ConcluidoPage}>
      <h1 className={styles.pageTitle}>Tarefas Concluídas</h1>
      {tasks.length === 0 ? (
        <p className={styles.centeredMessage}>Você ainda não tem tarefas concluídas.</p>
      ) : (
        <div className={styles.taskList}>
          <AnimatePresence>
            {tasks.map((task) => (
              <motion.div 
                key={task.id} 
                layout
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, x: 50 }}
                transition={{ duration: 0.3 }}
                className={styles.taskCard} 
                onClick={() => handleTaskClick(task)}
              >
                <h2>{task.title}</h2>
                <div className={styles.taskDetails}>
                  <div className={styles.taskInfo}>
                    <span>
                      Concluída em: {task.completed_at ? format(new Date(task.completed_at), "dd 'de' MMMM, yyyy", { locale: ptBR }) : "Data não disponível"}
                    </span>
                  </div>
                  <div className={styles.taskActions}>
                    <button onClick={(e) => { e.stopPropagation(); handleUndoTask(task.id); }}>Desfazer</button>
                    <button onClick={(e) => { e.stopPropagation(); setTaskToDelete(task); }}>Deletar</button>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}
      
      {/* Modal detalhes */}
      <Modal isOpen={!!selectedTask} onClose={handleCloseModal}>
        {selectedTask && (
          <div>
            <h2>{selectedTask.title}</h2>
            <p style={{ marginTop: '1rem', lineHeight: '1.6' }}>
              {selectedTask.description}
            </p>
          </div>
        )}
      </Modal>
      
      {/* Modal exclusão */}
      <Modal isOpen={!!taskToDelete} onClose={() => setTaskToDelete(null)}>
        {taskToDelete && (
          <div>
            <h2>Tem certeza que deseja deletar a tarefa?</h2>
            <p className={styles.taskTitle} style={{ marginTop: '1rem', fontWeight: 'bold' }}>
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
