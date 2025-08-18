import { useState } from "react";
import { supabase } from "../../config/supabaseClient";
import styles from './Login.module.css';

export function LoginPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLogin, setIsLogin] = useState(true);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (isLogin) {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) {
        alert("Algum erro aconteceu! " + error.message);
      } else {
        alert("O login ocorreu tudo certo!");
      }
    } else {
      const { error } = await supabase.auth.signUp({ email, password });
      if (error) {
        alert("Algum erro aconteceu!");
      } else {
        alert("O cadastro ocorreu tudo certo!");
      }
    }
  };

  return (
    <div className={styles.LoginPage}>
      <h1>{isLogin ? "Login" : "Cadastro"}</h1>
      <form onSubmit={handleSubmit} className={styles.LoginForm}>
        {!isLogin && (
          <label htmlFor="name" className={styles.LoginLabel}>
            Nome:
            <input
              type="text"
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className={styles.LoginInput}
            />
          </label>
        )}

        <label htmlFor="emailLogin" className={styles.LoginLabel}>
          E-mail:
          <input
            type="email"
            id="emailLogin"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className={styles.LoginInput}
          />
        </label>

        <label htmlFor="senhaEmail" className={styles.LoginLabel}>
          Senha:
          <input
            type="password"
            id="senhaLogin"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className={styles.LoginInput}
          />
        </label>
        <div className={styles.LoginButtonContainer}>
          <input type="submit" value={isLogin ? "Entrar" : "Cadastrar"} className={styles.LoginButton} />
        </div>
      </form>
      <p onClick={() => setIsLogin(!isLogin)} className={styles.LoginToggle}>
        {isLogin ? "Não tem uma conta? Cadastre-se" : "Já tem uma conta? Faça login"}
      </p>
    </div>
  );
}
