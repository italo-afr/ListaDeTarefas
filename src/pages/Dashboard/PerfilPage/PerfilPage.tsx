// Em PerfilPage.tsx
import { useState, useEffect } from 'react';
import styles from './PerfilPage.module.css';
// Importe as funções que vamos usar
import { getUserProfile, updateUserData, updateUserProfileName } from '../../../components/GetSupabase/AllService';
import { supabase } from '../../../config/supabaseClient'; 

export function PerfilPage() {

  // Estado para controlar qual seção está ativa
  const [activeView, setActiveView] = useState('nome');

  // Estados para o perfil
  const [newFullName, setNewFullName] = useState('');
  const [loading, setLoading] =useState(true);

  // Estados para a alteração de senha
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  
  // Novo estado para o email
  const [newEmail, setNewEmail] = useState('');

  // Estado para controlar qual seção está ativa
  useEffect(() => {
    const hash = window.location.hash.replace('#', '');
    if (['nome', 'senha', 'email'].includes(hash)) {
      setActiveView(hash);
    }
  }, []);

  // Busca os dados do perfil ao carregar a página
  useEffect(() => {
    const fetchProfile = async () => {
      setLoading(true);
      const profileData = await getUserProfile();
      if (profileData && 'full_name' in profileData) {
        setNewFullName(profileData.full_name);
      }
      setLoading(false);
    };
    fetchProfile();
  }, []);

  // Função para lidar com a alteração do nome
  const handleNameUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Pega o usuário atual para saber o ID
    const { data: { user } } = await supabase.auth.getUser(); 
    if (!user) return;

    // Atualiza o nome nos dois locais
    const { error: authError } = await updateUserData({ full_name: newFullName });
    const { error: profileError } = await updateUserProfileName(user.id, newFullName);

    if (authError || profileError) {
      alert("Ocorreu um erro ao atualizar o seu nome.");
      console.error(authError || profileError);
    } else {
      alert("Nome atualizado com sucesso!");
      setNewFullName(newFullName);
      window.location.reload();
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
  };
  
  if (loading) {
      return <p>Carregando perfil...</p>
  }

  // Função para lidar com a alteração de senha
  const handlePasswordUpdate = async (e: React.FormEvent) => {
      e.preventDefault();
      if (newPassword !== confirmPassword) {
          alert("As senhas não coincidem!");
          return;
      }
      // Verifica se a senha é forte (mínimo 6 caracteres o padrão do Supabase)
      if (newPassword.length < 6) {
          alert("A nova senha precisa de ter pelo menos 6 caracteres.");
          return;
      }
      const { error } = await updateUserData({ password: newPassword });

      if (error) {
          alert("Ocorreu um erro ao atualizar a sua senha.");
          console.error(error);
      } else {
          alert("Senha atualizada com sucesso!");
          setNewPassword(''); // Limpa os campos
          setConfirmPassword('');
          window.location.reload();
      }
  };

  // Função para lidar com a alteração de e-mail
  const handleEmailUpdate = async (e: React.FormEvent) => {
      e.preventDefault();

      const { error } = await updateUserData({ email: newEmail });

      if (error) {
          alert("Ocorreu um erro ao tentar alterar o seu e-mail.");
          console.error(error);
      } else {
          alert("Pedido de alteração de e-mail enviado! Por favor, verifique a sua nova caixa de entrada para confirmar.");
          setNewEmail(''); // Limpa o campo
          window.location.reload();
      }
  };

  return (
    <div className={styles.pageContainer}>
      <h1 className={styles.title}>Configurações de Perfil</h1>
      
      <div className={styles.settingsContainer}>
        {/* NAVEGAÇÃO DAS ABAS */}
        <div className={styles.tabsNav}>
          <button 
            className={`${styles.tabButton} ${activeView === 'nome' ? styles.activeTab : ''}`}
            onClick={() => setActiveView('nome')}
          >
            Alterar Nome
          </button>
          <button 
            className={`${styles.tabButton} ${activeView === 'senha' ? styles.activeTab : ''}`}
            onClick={() => setActiveView('senha')}
          >
            Alterar Senha
          </button>
          <button 
            className={`${styles.tabButton} ${activeView === 'email' ? styles.activeTab : ''}`}
            onClick={() => setActiveView('email')}
          >
            Alterar E-mail
          </button>
        </div>

        {/* ÁREA DE CONTEÚDO DAS ABAS */}
        <div className={styles.tabContent}>
          {/* Formulário de Nome*/}
          {activeView === 'nome' && (
            <form id="nome" onSubmit={handleNameUpdate} className={styles.formSection}>
              <h2>Alterar Nome</h2>
              <label htmlFor="fullName">Nome Completo</label>
              <input
                id="fullName"
                type="text"
                value={newFullName}
                onChange={(e) => setNewFullName(e.target.value)}
                className={styles.input}
              />
              <button type="submit" className={styles.submitButton}>Salvar Alterações</button>
            </form>
          )}

          {/* Formulário de Senha */}
          {activeView === 'senha' && (
            <form onSubmit={handlePasswordUpdate} className={styles.formSection}>
              <h2>Alterar Senha</h2>
                <label htmlFor="newPassword">Nova Senha</label>
                <input
                  id="newPassword"
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className={styles.input}
                  placeholder="Mínimo de 6 caracteres"
                />
                <label htmlFor="confirmPassword">Confirmar Nova Senha</label>
                <input
                  id="confirmPassword"
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className={styles.input}
                />
                <button type="submit" className={styles.submitButton}>Alterar Senha</button>
            </form>
          )}

          {/* Formulário de E-mail */}
          {activeView === 'email' && (
            <form onSubmit={handleEmailUpdate} className={styles.formSection}>
              <h2>Alterar E-mail</h2>
                <label htmlFor="newEmail">Novo E-mail</label>
                <input
                  id="newEmail"
                  type="email"
                  value={newEmail}
                  onChange={(e) => setNewEmail(e.target.value)}
                  className={styles.input}
                  placeholder="seu.novo.email@exemplo.com"
                />
              <button type="submit" className={styles.submitButton}>Alterar E-mail</button>
            </form>
          )}
        </div>
      </div>

      <div className={styles.actionsContainer}>
          <button onClick={handleLogout} className={styles.logoutButton}>Sair da Conta</button>
      </div>
    </div>
  );
}