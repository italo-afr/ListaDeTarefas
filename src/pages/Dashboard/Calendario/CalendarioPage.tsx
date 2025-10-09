import 'react-big-calendar/lib/css/react-big-calendar.css';
import { Calendar, momentLocalizer, Views, type View } from 'react-big-calendar';
import moment from 'moment';
import 'moment/locale/pt-br';
import { getTasks } from '../../../components/GetSupabase/AllService';
import { useCallback, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './Calendario.module.css';
import { Modal } from '../../../components/Modal/Modal'; 

interface Task {
    id: number;
    title: string;
    completed: boolean;
    description: string;
    start_date: string;
    finish_date: string | null;
    start_time: string | null;
    finish_time: string | null;
    color?: string;
};

export function CalendarioPage() {
    moment.locale('pt-br');
    const localizer = momentLocalizer(moment);
    
    const [tasks, setTasks] = useState<Task[]>([]);
    const [selectedTask, setSelectedTask] = useState<Task | null>(null);
    const [date, setDate] = useState(new Date());
    const [view, setView] = useState<View>(Views.MONTH);

    const navigate = useNavigate();

    useEffect(() => {
        const fetchTasks = async () => {
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
 
    const events = tasks
        .filter(task => task.start_date && !task.completed)
        .map(task => {
            const startDateTime = moment(`${task.start_date} ${task.start_time || '00:00:00'}`, "YYYY-MM-DD HH:mm:ss").toDate();
            const finishDate = task.finish_date || task.start_date;
            const finishTime = task.finish_time || task.start_time || '00:00:00'; 
            const endDateTime = moment(`${finishDate} ${finishTime}`, "YYYY-MM-DD HH:mm:ss").toDate();

            return {
                ...task,
                start: startDateTime,
                end: endDateTime,
                allDay: !task.start_time,
                color: task.color || '#555555',
            };
    });

    const eventStyleGetter = (event: any) => {
        const style = {
            backgroundColor: event.color || 'var(--primary-color)',
            borderRadius: '5px',
            opacity: 0.8,
            color: 'white',
            border: '0px',
            display: 'block'
        };
    return { style };
};

    const handleSelectTask = (event: Task) => {
        setSelectedTask(event);
    };

    const handleEditTask = (taskId: number) => {
        setSelectedTask(null);
        navigate(`/dashboard/editar-tarefa/${taskId}`);
    }

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
                    onSelectEvent={handleSelectTask}
                    date={date}
                    view={view}
                    onNavigate={handleNavigate}
                    onView={handleView}
                    eventPropGetter={eventStyleGetter} // Aplica as cores personalizadas
                    messages={{
                        next: "Próximo",
                        previous: "Anterior",
                        today: "Hoje",
                        month: "Mês",
                        week: "Semana",
                        day: "Dia",
                        agenda: "Agenda",
                        date: "Data",
                        time: "Hora",
                        event: "Evento",
                        noEventsInRange: "Não há tarefas neste período.",
                        showMore: total => `+ Ver mais (${total})`
                    }}
                />
            </div>

            <Modal isOpen={!!selectedTask} onClose={() => setSelectedTask(null)}>
                {selectedTask && (
                    <div>
                        <h2>{selectedTask.title}</h2>
                        <p style={{ marginTop: '1rem', lineHeight: '1.6' }}>
                            {selectedTask.description}
                        </p>
                        <div className={styles.modalActions}>
                            <button 
                                onClick={() => handleEditTask(selectedTask.id)} 
                                className={styles.editButton}
                            >
                                Editar Tarefa
                            </button>
                        </div>
                    </div>
                )}
            </Modal>
        </div>
    );
}