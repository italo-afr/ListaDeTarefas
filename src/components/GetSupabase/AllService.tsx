import { supabase } from "../../config/supabaseClient";

type NewTask = {
    title: string;
    description: string;
};

export const createTask = async (taskData: NewTask) => {
    const { data, error } = await supabase
        .from('tableList')
        .insert([{ title: taskData.title, description: taskData.description, completed: false, arquivado: false }])
        .select()
        .single();
    return { data, error };
};