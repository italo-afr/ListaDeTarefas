import { supabase } from "../../config/supabaseClient";

type NewTask = {
    title: string;
    description: string;
    finish_date: string;
    start_date: string;
};

// Cria as tarefas
export const createTask = async (taskData: NewTask) => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
        console.error("Nenhum utilizador está logado.");
        return { data: null, error: new Error("Utilizador não autenticado") };
    }
    const { data, error } = await supabase
        .from('tableList')
        .insert([{
            title: taskData.title,
            description: taskData.description,
            finish_date: taskData.finish_date,
            start_date: taskData.start_date,
            user_id: user.id
        }])
        .select()
        .single();
    
    return { data, error };
};

// Traz as tarefas pendentes
export const getTasks = async () => {
    const { data, error } = await supabase.from('tableList')
        .select('*')
        .eq('completed', false)
        .order('created_at', { ascending: false });
    return { data, error };
};

// Traz as tarefas concluídas
export const getTasksCompletion = async () => {
    const { data, error } = await supabase.from('tableList')
        .select('*')
        .eq('completed', true)
        .order('created_at', { ascending: false });
    return { data, error };
};

// Atualiza o status de conclusão da tarefa
export const updateTaskCompletion = async (taskId: number, completed: boolean, completed_at: string | null) => {
    const { data, error } = await supabase.from('tableList')
        .update({ completed, completed_at })
        .eq('id', taskId);
    return { data, error };
};


// Deleta uma tarefa
export const deleteTask = async (taskId: number) => {
    const { data, error } = await supabase.from('tableList')
        .delete()
        .eq('id', taskId);
    return { data, error };
};

// Busca o perfil do usuário
export const getUserProfile = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
        console.error("Nenhum utilizador está logado.");
        return { data: null, error: new Error("Utilizador não autenticado") };
    }
    const { data, error } = await supabase
        .from('profiles')
        .select('full_name')
        .eq('id', user.id)
        .single();
    if (error) {
        console.error("Erro ao buscar o perfil do usuário:", error);
        return null;
    }
    return data;
};