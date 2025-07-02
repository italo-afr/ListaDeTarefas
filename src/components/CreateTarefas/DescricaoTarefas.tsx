import styles from './DescricaoTarefas.module.css';
const DescricaoTarefas = () => {
    return (
        <div className={styles.DescricaoTarefas}>
            <div className={styles.InputContainer}>
                <label className={styles.InputText}>Tarefas em andamento</label>
            </div>
            <div className={styles.DataTable}>
                <text>Tarefa 1</text>
                <text>Tarefa 2</text>
                <text>Tarefa 3</text>
            </div>
        </div>
    )
}

export default DescricaoTarefas
