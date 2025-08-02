import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './NovaTarefaPage.module.css';
import { createTask } from '../../../components/GetSupabase/AllService';
import { useEffect, useRef } from 'react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { DayPicker } from 'react-day-picker';
import 'react-day-picker/dist/style.css';
import TextareaAutosize from 'react-textarea-autosize';
import { CalendarDays } from 'lucide-react';

export function NovaTarefaPage() {
    const navigate = useNavigate();
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [date_check, setDateCheck] = useState<Date | undefined>(undefined);
    const [isDatePickerOpen, setIsDatePickerOpen] = useState(false);
    const datePickerRef = useRef<HTMLDivElement>(null);

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault(); // Impede o recarregamento da página

        console.log('Formulário enviado. Título:', title, 'Descrição:', description);

        const response = await createTask({
            title: title,
            description: description,
            date_check: date_check ? date_check.toISOString() : ''
        });

        if (response.error) {
            console.error('Erro ao criar tarefa:', response.error);
            return;
        } else {
            alert('Tarefa criada com sucesso!');
            setTitle('');
            setDescription('');
            setDateCheck(undefined);
            navigate('/dashboard/entrada');
        }
    };

    // Efeito para fechar o calendário ao clicar fora dele
    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (datePickerRef.current && !datePickerRef.current.contains(event.target as Node)) {
                setIsDatePickerOpen(false);
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
                    <label htmlFor="date-input">Data de Conclusão</label>
                    <div className={styles.datePickerContainer}>
                        <div className={styles.dateInputWrapper} onClick={() => setIsDatePickerOpen(true)}>
                            <input id="date-input" type="text" readOnly value={date_check ? format(date_check, 'dd/MM/yyyy') : ''} placeholder="Selecione uma data" />
                            <CalendarDays size={20} className={styles.calendarIcon} />
                        </div>
                        {isDatePickerOpen && (
                            <div ref={datePickerRef} className={styles.datePickerPopover}>
                                <DayPicker mode="single" selected={date_check} onSelect={(date) => {
                                    setDateCheck(date); setIsDatePickerOpen(false); // Fecha ao selecionar
                                }} locale={ptBR} fromYear={new Date().getFullYear()} showOutsideDays fixedWeeks />
                            </div>
                        )}
                    </div>
                </div>

                <button type="submit" className={styles.submitButton}>Salvar tarefa</button>
            </form>
        </div>
    );
}
