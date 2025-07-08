//import { useState, useEffect } from 'react';
//import { supabase } from './config/supabaseClient';
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { HomePage } from "./pages/Home/HomePage";
import { DashboardLayout } from "./layouts/DashboardLayout";
import { DashboardPage } from "./pages/Dashboard/DashboardPage";
import { DescricaoTarefas } from "./pages/Dashboard/DescricaoTarefas/DescricaoTarefasPage";
import { NovaTarefaPage } from "./pages/Dashboard/NovaTarefa/NovaTarefaPage";
import { HojePage } from "./pages/Dashboard/HojePage/HojePage";
import { ConcluidoPage } from "./pages/Dashboard/ConcluidoPage/ConcluidoPage";
import { ArquivadasPage } from "./pages/Dashboard/ArquivadasPage/ArquivadasPage";
import { CalendarioPage } from "./pages/Dashboard/CalendarioPage/CalendarioPage";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/dashboard" element={<DashboardLayout />}>
          {/* Dashboard (/dashboard) */}
          <Route index element={<DashboardPage />} />
          {/* Sub-rotas para o dashboard */}
          <Route path="nova-tarefa" element={<NovaTarefaPage />} />
          <Route path="entrada" element={<DescricaoTarefas />} />
          <Route path="hoje" element={<HojePage />} />
          <Route path="concluido" element={<ConcluidoPage />} />
          <Route path="arquivadas" element={<ArquivadasPage />} />
          <Route path="calendario" element={<CalendarioPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;