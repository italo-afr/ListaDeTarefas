import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import styles from './NovaTarefaPage.module.css';
import { createTask, getTaskById, updateTask, getProjects } from '../../../components/GetSupabase/AllService';
import { useEffect, useRef } from 'react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { DayPicker } from 'react-day-picker';
import 'react-day-picker/dist/style.css';
import TextareaAutosize from 'react-textarea-autosize';
import { CalendarDays } from 'lucide-react';
import { TimeInput } from '../../../components/TimeInput/TimeInput';

export function NovaTarefaPage() {

    const [color, setColor] = useState('#555555');
    
    const navigate = useNavigate();
    
    const { taskId } = useParams<{ taskId: string }>(); 

    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [start_date, setStartDate] = useState<Date | undefined>(undefined);
    const [finish_date, setFinishDate] = useState<Date | undefined>(undefined);
    const [openDatePicker, setOpenDatePicker] = useState<string | null>(null);
    const datePickerRef = useRef<HTMLDivElement>(null);
    const [startTime, setStartTime] = useState(''); 
    const [finishTime, setFinishTime] = useState('');

    // Carregar projetos disponíveis
    const [projects, setProjects] = useState<{ id: string; name: string }[]>([]); 
    const [selectedProjectId, setSelectedProjectId] = useState('');


    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const taskData = {
        title: title,
        description: description,
        start_date: start_date ? start_date.toISOString() : new Date().toISOString(),
        finish_date: finish_date ? finish_date.toISOString() : new Date().toISOString(),
        start_time: startTime,
        finish_time: finishTime,
        project_id: selectedProjectId || null,
        color: color,
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

    // Carregar projetos disponíveis
    useEffect(() => {
        const fetchProjects = async () => {
            const { data } = await getProjects();
            if (data) {
                setProjects(data);
            }
        };
        fetchProjects();
    }, []);


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
                <TextareaAutosize value={description} minRows={3} onChange={(e) => setDescription(e.target.value)} className={styles.autoSizingTextarea} />
                    <label htmlFor="project-select">Projeto</label>
                    <div className={styles.formGroup}>
                        <select
                            id="project-select"
                            value={selectedProjectId}
                            onChange={(e) => setSelectedProjectId(e.target.value)}
                            className={styles.selectInput}
                        >
                            <option value="">Nenhum (Caixa de Entrada)</option>
                            {projects.map(project => (
                                <option key={project.id} value={project.id}>
                                    {project.name}
                                </option>
                            ))}
                        </select>
                    </div>

                        <div className={styles.colorInput}>
                            <label htmlFor="task-color">Cor da Tarefa</label>
                            <input
                                id="task-color"
                                type="color"
                                value={color}
                                onChange={(e) => setColor(e.target.value)}
                                className={styles.colorInput}
                            />
                        </div>
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
                            <TimeInput value={startTime} onChange={setStartTime} />
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
    <TimeInput value={finishTime} onChange={setFinishTime} />
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
