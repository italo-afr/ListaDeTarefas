import 'react-big-calendar/lib/css/react-big-calendar.css';
import { Calendar, momentLocalizer, Views, type View } from 'react-big-calendar'; // Adicione 'type View'
import moment from 'moment';
import { getTasks } from '../../../components/GetSupabase/AllService'; 
import { useCallback, useEffect, useState } from 'react';
import styles from './Calendario.module.css';
import { Modal } from '../../../components/Modal/Modal'; // 1. Importe o Modal

// A nossa interface de Tarefa, completa
interface Task {
    id: number;
    title: string;
    description: string;
    start_date: string;
    finish_date: string | null; 
};

export function CalendarioPage() {
    moment.locale('pt-br');
    const localizer = momentLocalizer(moment);

    // 2. Adicione os estados para as tarefas e o modal
    const [tasks, setTasks] = useState<Task[]>([]);
    const [selectedTask, setSelectedTask] = useState<Task | null>(null);
    const [date, setDate] = useState(new Date());
    const [view, setView] = useState<View>(Views.MONTH);

    // 3. Busca de dados usando a função do Supabase
    useEffect(() => {
        const fetchTasks = async () => {
            // A sua função getTasks original, que já sabe buscar apenas
            // as tarefas do usuário logado através do Supabase.
            const { data, error } = await getTasks(); 
            if (data) {
                setTasks(data);
            }
            if (error) {
                console.error("Erro ao buscar tarefas:", error);
            }
        };

        fetchTasks();
    }, []); 
  
    // 4. Mapeia os dados para o formato do calendário, incluindo todos os campos
    const events = tasks
        .filter(task => task.start_date)
        .map(task => ({
            ...task,
            start: new Date(task.start_date),
            end: new Date(task.finish_date || task.start_date),
        }));

    // 5. A função que o calendário vai chamar quando um evento for clicado
    const handleSelectTask = (event: Task) => {
        setSelectedTask(event);
    };

    const handleNavigate = useCallback((newDate: Date) => setDate(newDate), [setDate]);
    const handleView = useCallback((newView: View) => setView(newView), [setView]);

    return (
        <div className={styles.pageContainer}>
            <h1>Calendário</h1>
            <p>Visualização de todas as tarefas em um calendário.</p>
            <div className={styles.calendarContainer}>
                <Calendar
                    localizer={localizer}
                    events={events} 
                    startAccessor="start"
                    endAccessor="end"
                    messages={{  }}
                    onSelectEvent={handleSelectTask}
                    date={date}
                    view={view}
                    onNavigate={handleNavigate}
                    onView={handleView}
                />
            </div>

            {/* 7. O nosso componente Modal que mostra os detalhes */}
            <Modal isOpen={!!selectedTask} onClose={() => setSelectedTask(null)}>
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