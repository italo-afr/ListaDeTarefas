import { supabase } from "../../config/supabaseClient";

type NewTask = {
    title: string;
    description: string;
    date_check: string;
};

export const createTask = async (taskData: NewTask) => {
    const { data, error } = await supabase.from('tableList')
        .insert([{ title: taskData.title, description: taskData.description, date_check: taskData.date_check }])
        .select().single();
    return { data, error };
};

export const getTasks = async () => {
    const { data, error } = await supabase.from('tableList')
        .select('*')
        .eq('completed', false)
        .order('created_at', { ascending: false });
    return { data, error };
};

export const getTasksCompletion = async () => {
    const { data, error } = await supabase.from('tableList')
        .select('*')
        .eq('completed', true)
        .order('created_at', { ascending: false });
    return { data, error };
};

export const updateTaskCompletion = async (taskId: number, completed: boolean) => {
    const { data, error } = await supabase.from('tableList')
        .update({ completed })
        .eq('id', taskId);
    return { data, error };
};

export const deleteTask = async (taskId: number) => {
    const { data, error } = await supabase.from('tableList')
        .delete()
        .eq('id', taskId);
    return { data, error };
};