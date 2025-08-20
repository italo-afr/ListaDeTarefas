import { Navigate } from 'react-router-dom';
import type { Session } from '@supabase/supabase-js';

interface ProtectedRouteProps {
  session: Session | null;
  children: React.ReactNode;
}

export function ProtectedRoute({ session, children }: ProtectedRouteProps) {
  if (!session) {
    // Se não tiver uma sessão, redireciona para a página de login
    return <Navigate to="/login" replace />;
  }

  // Se tiver uma sessão, renderiza o componente filho (a página protegida)
  return <>{children}</>;
}