import { supabase } from "../../config/supabaseClient";

type NewTask = {
    title: string;
    description: string;
    finish_date: string;
    start_date: string;
    finish_time: string;
    start_time: string;
    color?: string;
    project_id?: string | null;
};

// Cria as tarefas
export const createTask = async (taskData: NewTask) => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return { data: null, error: new Error("Usuário não autenticado") };

    // Garantimos que os novos campos de hora são incluídos
    const taskToInsert = {
        title: taskData.title,
        description: taskData.description,
        start_date: taskData.start_date,
        finish_date: taskData.finish_date,
        start_time: taskData.start_time,
        finish_time: taskData.finish_time,
        user_id: user.id,
        project_id: taskData.project_id || null,
        color: taskData.color
    };

    const { data, error } = await supabase
        .from('tableList')
        .insert([taskToInsert]);
    
    return { data, error };
};

// Traz as tarefas pendentes
export const getTasks = async () => {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { data: [], error: null };

  const { data, error } = await supabase
    .from('tableList')
    .select('id, title, description, start_date, finish_date, start_time, finish_time, completed, color')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false }); 
  
  return { data, error };
};

// Traz as tarefas pendentes
export const getIncompleteTasks = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return { data: [], error: new Error("Usuário não autenticado") };

    const { data, error } = await supabase
        .from('tableList')
        .select('*')
        .eq('user_id', user.id)
        .eq('completed', false)
        .order('created_at', { ascending: false });
    
    return { data, error };
};

// Traz as tarefas concluídas
export const getTasksCompletion = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return { data: [], error: new Error("Usuário não autenticado") };

    const { data, error } = await supabase
        .from('tableList')
        .select('*')
        .eq('user_id', user.id)
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

// Função para buscar UMA ÚNICA tarefa pelo seu ID
export const getTaskById = async (taskId: string) => {
  const { data, error } = await supabase
    .from('tableList')
    .select('*')
    .eq('id', taskId)
    .single();

  return { data, error };
};

// Função para ATUALIZAR uma tarefa existente
export const updateTask = async (taskId: string, updates: any) => {
  const { data, error } = await supabase
    .from('tableList')
    .update(updates)
    .eq('id', taskId);

  return { data, error };
};

// Busca todos os projetos do usuário logado
export const getProjects = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return { data: [], error: new Error("Usuário não autenticado") };

    const { data, error } = await supabase
        .from('projects')
        .select('*')
        .eq('user_id', user.id)
        .order('name', { ascending: true });

    return { data, error };
};

// Cria um novo projeto
export const createProject = async (projectName: string) => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return { data: null, error: new Error("Usuário não autenticado") };

    const { data, error } = await supabase
        .from('projects')
        .insert([{
            name: projectName,
            user_id: user.id
        }])
        .select() 
        .single();
    return { data, error };
};

// Busca as tarefas PENDENTES de um projeto específico
export const getTasksByProject = async (projectId: string) => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return { data: [], error: null };

    const { data, error } = await supabase
        .from('tableList')
        .select('*')
        .eq('user_id', user.id)
        .eq('completed', false)
        .eq('project_id', projectId) 
        .order('created_at', { ascending: false });
    
    return { data, error };
};

// Deleta um projeto pelo seu ID
export const deleteProject = async (projectId: number) => {
    const { error } = await supabase
        .from('projects')
        .delete()
        .eq('id', projectId);

    return { error };
};

// Atualiza os dados do usuário na tabela de autenticação
export const updateUserData = async (updates: { full_name?: string, password?: string, email?: string }) => {
    const { data, error } = await supabase.auth.updateUser({
        data: updates
    });
    return { data, error };
};

// Uma função específica para atualizar o nome no perfil público
export const updateUserProfileName = async (userId: string, newName: string) => {
    const { data, error } = await supabase
        .from('profiles')
        .update({ full_name: newName })
        .eq('id', userId);
    return { data, error };
};