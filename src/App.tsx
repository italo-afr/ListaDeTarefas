import { useState, useEffect } from 'react';
import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom"; 
import { supabase } from './config/supabaseClient';
import type { Session } from '@supabase/supabase-js';

// Páginas e layouts
import { DashboardLayout } from "./layouts/DashboardLayout";
import { DashboardPage } from "./pages/Dashboard/DashboardPage";
import { EntradaTarefas } from "./pages/Dashboard/Entrada/EntradaTarefasPage";
import { NovaTarefaPage } from "./pages/Dashboard/NovaTarefa/NovaTarefaPage";
import { ConcluidoPage } from "./pages/Dashboard/Concluido/ConcluidoPage";
import { ArquivadasPage } from "./pages/Dashboard/Arquivadas/ArquivadasPage";
import { CalendarioPage } from "./pages/Dashboard/Calendario/CalendarioPage";
import { LoginPage } from "./pages/auth/LoginPage";

function App() {
  // Guardar a sessão do utilizador aqui. Começa como null (ninguém logado).
  const [session, setSession] = useState<Session | null>(null);
  useEffect(() => {
    // Pede ao Supabase a sessão atual (caso o usuário já tivesse logado)
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
    });

    // Cria um método que nos avisa sempre que o estado de login muda
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    // Limpa o método quando o componente é deslogado
    return () => subscription.unsubscribe();
  }, []);

  return (
    <BrowserRouter>
      {!session ? (
        <Routes>
          <Route path="*" element={<LoginPage />} />
        </Routes>
      ) : (
        <Routes>
          <Route path="/" element={<Navigate to="/dashboard" />} />
          <Route path="/dashboard" element={<DashboardLayout />}>
            <Route index element={<DashboardPage />} />
            <Route path="nova-tarefa" element={<NovaTarefaPage />} />
            <Route path="entrada" element={<EntradaTarefas />} />
            <Route path="concluido" element={<ConcluidoPage />} />
            <Route path="arquivadas" element={<ArquivadasPage />} />
            <Route path="calendario" element={<CalendarioPage />} />
          </Route>
        </Routes>
      )}
    </BrowserRouter>
  );
}

export default App;