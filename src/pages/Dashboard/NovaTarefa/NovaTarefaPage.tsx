import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import styles from './NovaTarefaPage.module.css';
import { createTask, getTaskById, updateTask } from '../../../components/GetSupabase/AllService';
import { useEffect, useRef } from 'react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { DayPicker } from 'react-day-picker';
import 'react-day-picker/dist/style.css';
import TextareaAutosize from 'react-textarea-autosize';
import { CalendarDays } from 'lucide-react';

export function NovaTarefaPage() {
    
    const navigate = useNavigate();
    
    const { taskId } = useParams<{ taskId: string }>(); // Pega o ID da tarefa dos parâmetros da URL

    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [start_date, setStartDate] = useState<Date | undefined>(undefined);
    const [finish_date, setFinishDate] = useState<Date | undefined>(undefined);
    const [openDatePicker, setOpenDatePicker] = useState<string | null>(null);
    const datePickerRef = useRef<HTMLDivElement>(null);
    const [startTime, setStartTime] = useState(''); 
    const [finishTime, setFinishTime] = useState('');


    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const taskData = {
        title: title,
        description: description,
        start_date: start_date ? start_date.toISOString() : new Date().toISOString(),
        finish_date: finish_date ? finish_date.toISOString() : new Date().toISOString(),
        start_time: startTime,
        finish_time: finishTime,
    };

    if (taskId) {
        const { error } = await updateTask(taskId, taskData);

        if (error) {
            console.error('Erro ao atualizar tarefa:', error);
            alert('Falha ao atualizar a tarefa.');
        } else {
            alert('Tarefa atualizada com sucesso!');
            navigate('/dashboard/entrada'); 
        }
    } else {
        const { error } = await createTask(taskData); 

        if (error) {
            console.error('Erro ao criar tarefa:', error);
            alert('Falha ao criar a tarefa.');
        } else {
            alert('Tarefa criada com sucesso!');
            navigate('/dashboard/entrada'); 
        }
    }
};

    useEffect(() => {
        // Se a URL tiver um taskId, entra em modo de edição
        if (taskId) {
            const fetchTaskData = async () => {
            const { data, error } = await getTaskById(taskId);
            if (error) {
                console.error("Erro ao buscar dados da tarefa:", error);
                alert("Não foi possível carregar os dados da tarefa para edição.");
            } else if (data) {
                // Preenchemos os estados do formulário com os dados recebidos
                setTitle(data.title);
                setDescription(data.description);
                // As datas precisam de ser convertidas de texto para objetos Date
                if (data.start_date) {
                setStartDate(new Date(data.start_date));
                }
                if (data.finish_date) {
                setFinishDate(new Date(data.finish_date));
                }
            }
            };
            fetchTaskData();
        }
    }, [taskId]);

    // Efeito para fechar o calendário ao clicar fora dele
    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (datePickerRef.current && !datePickerRef.current.contains(event.target as Node)) {
                setOpenDatePicker(null);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [datePickerRef]);


    return (
        <div className={styles.pageContainer}>
            <div className={styles.titleForm}>
                <h1>Criar Nova Tarefa</h1>
            </div>
            <p className={styles.description}>
                Preencha os campos abaixo para criar uma nova tarefa.
            </p>
            <form onSubmit={handleSubmit} className={styles.form}>
                <label>Título</label>
                <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} required />

                <label>Descrição</label>
                <TextareaAutosize value={description} minRows={3} onChange={(e) => setDescription(e.target.value)} className={styles.autoSizingTextarea} required />
                <div className={styles.formGroup}>
                    <div className={styles.formStartDate}>
                        <label htmlFor="date-input">Início</label>
                        <div className={styles.datePickerContainer}>
                            <div className={styles.dateInputWrapper} onClick={() => setOpenDatePicker('start')}>
                                <input id="date-input" type="text" readOnly value={start_date ? format(start_date, 'dd/MM/yyyy') : ''} placeholder="Selecione uma data" />
                                <CalendarDays size={20} className={styles.calendarIcon} />
                            </div>
                            <div className={styles.formTime}>
                            <label htmlFor="start-time-input">Horário de início</label>
                            <input
                                id="start-time-input"
                                type="time"
                                value={startTime}
                                onChange={(e) => setStartTime(e.target.value)}
                                className={styles.timeInput}
                            />
                        </div>
                            {openDatePicker === 'start' && (
                                <div ref={datePickerRef} className={styles.datePickerPopover}>
                                    <DayPicker mode="single" selected={start_date} onSelect={(date) => {
                                        setStartDate(date); setOpenDatePicker(null); // Fecha ao selecionar
                                    }} locale={ptBR} fromYear={new Date().getFullYear()} showOutsideDays fixedWeeks />
                                </div>
                            )}
                        </div>
                    </div>
                    <div className={styles.formFinishDate}>
                        <label htmlFor="date-input">Conclusão</label>
                        <div className={styles.datePickerContainer}>
                            <div className={styles.dateInputWrapper} onClick={() => setOpenDatePicker('finish')}>
                                <input id="date-input" type="text" readOnly value={finish_date ? format(finish_date, 'dd/MM/yyyy') : ''} placeholder="Selecione uma data" />
                                <CalendarDays size={20} className={styles.calendarIcon} />
                            </div>
                            <div className={styles.formTime}>
                                <label htmlFor="finish-time-input">Horário de conclusão</label>
                                <input
                                    id="finish-time-input"
                                    type="time"
                                    value={finishTime}
                                    onChange={(e) => setFinishTime(e.target.value)}
                                    className={styles.timeInput} // Reutilizamos o estilo
                                />
                            </div>
                            {openDatePicker === 'finish' && (
                                <div ref={datePickerRef} className={styles.datePickerPopover}>
                                    <DayPicker mode="single" selected={finish_date} onSelect={(date) => {
                                        setFinishDate(date); setOpenDatePicker(null); // Fecha ao selecionar
                                    }} locale={ptBR} fromYear={new Date().getFullYear()} showOutsideDays fixedWeeks />
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                <button type="submit" className={styles.submitButton}>Salvar tarefa</button>
            </form>
        </div>
    );
}
