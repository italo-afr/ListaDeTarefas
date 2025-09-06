import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';
import { Resend } from 'https://esm.sh/resend@3.2.0';
Deno.serve(async (_req)=>{
  try {
    const supabaseAdmin = createClient(Deno.env.get('SUPABASE_URL') ?? '', Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '');
    const resend = new Resend(Deno.env.get('RESEND_API_KEY'));
    // --- Buscar tarefas que vencem amanhã ---
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const tomorrowString = tomorrow.toISOString().split('T')[0];
    const { data: tasks, error: tasksError } = await supabaseAdmin.from('tableList').select('title, user_id ( email )').eq('completed', false).eq('finish_date', tomorrowString);
    if (tasksError) throw tasksError;
    if (!tasks || tasks.length === 0) {
      return new Response(JSON.stringify({
        message: "Nenhuma tarefa para notificar."
      }), {
        headers: {
          'Content-Type': 'application/json'
        },
        status: 200
      });
    }
    // Filtra tarefas que tenham um usuário e um e-mail válidos
    const validTasks = tasks.filter((task)=>task.user_id && task.user_id.email);
    // --- ENVIAR UM E-MAIL PARA CADA TAREFA ---
    for (const task of validTasks){
      const user = task.user_id; // Simplifica o acesso ao email
      await resend.emails.send({
        from: 'Lembretes <onboarding@resend.dev>',
        to: user.email,
        subject: `Lembrete: Sua tarefa "${task.title}" vence amanhã!`,
        html: `
          <h1>Olá!</h1>
          <p>Este é um lembrete de que a sua tarefa <strong>${task.title}</strong> vence amanhã.</p>
          <p>Não se esqueça de a concluir!</p>
          <p><em>- O seu Gerenciador de Tarefas</em></p>
        `
      });
    }
    return new Response(JSON.stringify({
      message: `Sucesso! ${validTasks.length} e-mails de lembrete enviados.`
    }), {
      headers: {
        'Content-Type': 'application/json'
      },
      status: 200
    });
  } catch (error) {
    return new Response(JSON.stringify({
      error: error.message
    }), {
      headers: {
        'Content-Type': 'application/json'
      },
      status: 500
    });
  }
});
