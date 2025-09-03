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

export interface AppProps {
  toggleTheme: () => void;
  theme: string;
}

function App() {
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true); 
  const [theme, setTheme] = useState('dark');

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

  const toggleTheme = () => {
    setTheme(currentTheme => (currentTheme === 'dark' ? 'light' : 'dark'));
  };

  if (loading) {
    return null; 
  }

  return (
    <div className={theme}>
      <BrowserRouter>
        <Routes>
          {/* Rotas públicas */}
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<LoginPage />} />

          {/* Rota privada para o Dashboard */}
          <Route 
            path="/dashboard/*" 
            element={
              session ? <DashboardRoutes theme={theme} toggleTheme={toggleTheme} /> : <Navigate to="/login" />
            } 
          />
        </Routes>
        
      </BrowserRouter>
    </div>
  );
}

function DashboardRoutes({ theme, toggleTheme }: AppProps) {
  return (
    <Routes>
      <Route path="/" element={<DashboardLayout theme={theme} toggleTheme={toggleTheme} />}>
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