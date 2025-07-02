export const NewTask = () => {
    return (
        <div className="new-task">
            <h2>Nova Tarefa</h2>
            <form>
                <label>
                    Título:
                    <input type="text" name="title" required />
                </label>
                <label>
                    Descrição:
                    <textarea name="description" required></textarea>
                </label>
                <button type="submit">Adicionar Tarefa</button>
            </form>
        </div>
    );
};