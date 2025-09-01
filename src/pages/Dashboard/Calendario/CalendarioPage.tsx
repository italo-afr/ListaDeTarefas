import 'react-big-calendar/lib/css/react-big-calendar.css';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import { getTasks } from '../../../components/GetSupabase/AllService';
import { useEffect, useState } from 'react';
import styles from './Calendario.module.css';

type Tarefa = {
  title: string; 
  start_date: string;
  finish_date: string | null; 
};

export function CalendarioPage() {
  moment.locale('pt-br');
  const localizer = momentLocalizer(moment);

  // Estado para guardar as tarefas originais do Supabase
  const [tarefas, setTarefas] = useState<Tarefa[]>([]);

  useEffect(() => {
    const fetchTasks = async () => {
      const { data, error } = await getTasks(); 
      if (data) {
        setTarefas(data);
      }
      if (error) {
        console.error("Erro ao buscar tarefas:", error);
      }
    };

    fetchTasks();
  }, []); 
  
  // Transforma as tarefas em eventos para o calendário
  const eventos = tarefas
    // Filtro para usar apenas tarefas que tenham uma data de fim
    .filter(tarefa => tarefa.start_date)
    // Mapea o resultado para o formato correto
    .map(tarefa => ({
      title: tarefa.title,
      start: new Date(tarefa.start_date),
      end: new Date(tarefa.finish_date || tarefa.start_date),
      allDay: false
    }));

  return (
    <div className={styles.pageContainer}>
      <h1>Calendário</h1>
      <p>Visualização de todas as tarefas em um calendário.</p>
      <div className={styles.calendarContainer}>
        <Calendar
          localizer={localizer}
          events={eventos} 
          startAccessor="start"
          endAccessor="end"
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
            noEventsInRange: "Não há eventos neste período.",
            showMore: total => `+ Ver mais (${total})`
          }}
        />
      </div>
    </div>
  );
}