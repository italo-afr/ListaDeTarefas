import 'react-big-calendar/lib/css/react-big-calendar.css';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';



export function CalendarioPage() {

    moment.locale('pt-br'); // Define o idioma para português
    const localizer = momentLocalizer(moment); // Localiza as datas usando o moment.js

    const events = [
        {
            start: new Date(),
            end: moment().add(1, "hours").toDate(),
            title: "Evento de Teste"
        }
    ];

    return (
        <div>
            <h1>Calendário</h1>
            <p>Visualização de todas as tarefas em um calendário.</p>
            <div style={{ height: '70vh' }}>
                <Calendar
                    localizer={localizer}
                    events={events}
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