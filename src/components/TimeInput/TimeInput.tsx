import { useState, useEffect, useRef } from 'react';
import styles from './TimeInput.module.css';
import { Clock } from 'lucide-react';

interface TimeInputProps {
  value: string | null;
  onChange: (newTime: string) => void;
}

export function TimeInput({ value, onChange }: TimeInputProps) {
  const [isOpen, setIsOpen] = useState(false);
  const popoverRef = useRef<HTMLDivElement>(null);
  
  // Estados temporários para o seletor
  const [hour, setHour] = useState('00');
  const [minute, setMinute] = useState('00');

  // Efeito para preencher o seletor quando o valor inicial muda
  useEffect(() => {
  function handleClickOutside(event: MouseEvent) {
    if (popoverRef.current && !popoverRef.current.contains(event.target as Node)) {
      setIsOpen(false); // Fecha o pop-up
    }
  }
  // Adiciona o "ouvinte" de cliques
  document.addEventListener("mousedown", handleClickOutside);
  return () => {
    // Limpa o "ouvinte" quando o componente é desmontado
    document.removeEventListener("mousedown", handleClickOutside);
  };
}, [popoverRef]);

  const displayValue = value || '--:--';

  const handleSetTime = () => {
    const formattedHour = String(hour).padStart(2, '0');
    const formattedMinute = String(minute).padStart(2, '0');
    const newTime = `${formattedHour}:${formattedMinute}`;
    
    onChange(newTime);
    setIsOpen(false);
  };

  return (
    <div className={styles.timeInputContainer}>
      <div className={styles.timeInputDisplay} onClick={() => setIsOpen(true)}>
        <span>{displayValue}</span>
        <Clock size={20} className={styles.clockIcon} />
      </div>

      {isOpen && (
        <div ref={popoverRef} className={styles.timePickerPopover}>
          <div className={styles.pickerControls}>
            <input 
              type="number"
              min="0"
              max="23"
              value={hour}
              onChange={(e) => setHour(e.target.value)}
              className={styles.timeValueInput}
            />
            <span>:</span>
            <input 
              type="number"
              min="0"
              max="59"
              step="5"
              value={minute}
              onChange={(e) => setMinute(e.target.value)}
              className={styles.timeValueInput}
            />
          </div>
          <div className={styles.pickerActions}>
            <button onClick={() => setIsOpen(false)} className={styles.cancelButton}>
              Cancelar
            </button>
            <button onClick={handleSetTime} className={styles.confirmButton}>
              Definir Hora
            </button>
          </div>
        </div>
      )}
    </div>
  );
}