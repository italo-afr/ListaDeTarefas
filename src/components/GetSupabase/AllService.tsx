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
        .select('*');
    return { data, error };
};