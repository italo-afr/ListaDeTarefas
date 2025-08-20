import { useState, useEffect } from 'react';
import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom"; 
import { supabase } from './config/supabaseClient';
import type { Session } from '@supabase/supabase-js';

// Suas páginas e layouts
import { HomePage } from './pages/Home/HomePage'; // Página inicial pública
import { LoginPage } from "./pages/auth/LoginPage";
import { DashboardLayout } from "./layouts/DashboardLayout";
import { DashboardPage } from "./pages/Dashboard/DashboardPage";
import { EntradaTarefas } from "./pages/Dashboard/Entrada/EntradaTarefasPage";
import { NovaTarefaPage } from "./pages/Dashboard/NovaTarefa/NovaTarefaPage";
import { ConcluidoPage } from "./pages/Dashboard/Concluido/ConcluidoPage";
import { CalendarioPage } from "./pages/Dashboard/Calendario/CalendarioPage";

function App() {
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true); 

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setLoading(false); 
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, []);

  if (loading) {
    return null; 
  }

  return (
    <BrowserRouter>
      <Routes>
        {/* Rotas públicas */}
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<LoginPage />} />

        {/* Rota privada para o Dashboard */}
        <Route 
          path="/dashboard/*" 
          element={
            session ? <DashboardRoutes /> : <Navigate to="/login" />
          } 
        />
      </Routes>
    </BrowserRouter>
  );
}

function DashboardRoutes() {
  return (
    <Routes>
      <Route path="/" element={<DashboardLayout />}>
        <Route index element={<DashboardPage />} />
        <Route path="nova-tarefa" element={<NovaTarefaPage />} />
        <Route path="entrada" element={<EntradaTarefas />} />
        <Route path="concluido" element={<ConcluidoPage />} />
        <Route path="calendario" element={<CalendarioPage />} />
      </Route>
    </Routes>
  );
}

export default App;