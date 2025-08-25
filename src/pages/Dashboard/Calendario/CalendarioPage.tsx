import 'react-big-calendar/lib/css/react-big-calendar.css';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import { getTasks } from '../../../components/GetSupabase/AllService';
import { useEffect, useState } from 'react';
import styles from './Calendario.module.css';

type Tarefa = {
  title: string;
  created_at: string;
  date_check: string | null; 
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
    .filter(tarefa => tarefa.date_check) 
    // Mapea o resultado para o formato correto
    .map(tarefa => ({
      title: tarefa.title,
      start: new Date(tarefa.created_at),
      end: new Date(tarefa.date_check!),
      allDay: false
    }));

  return (
    <div>
      <h1 className={styles.title}>Calendário</h1>
      <p className={styles.description}>Visualização de todas as tarefas em um calendário.</p>
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