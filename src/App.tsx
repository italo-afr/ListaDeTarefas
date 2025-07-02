//import { useState, useEffect } from 'react';
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { DashboardPage } from "./pages/Dashboard/DashboardPage";
//import { supabase } from './config/supabaseClient';
import { HomePage } from "./pages/Home/HomePage";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/dashboard" element={<DashboardPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;