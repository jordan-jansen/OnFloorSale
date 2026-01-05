import { useNavigate } from "react-router-dom";
import { useCart } from "../cartContext.jsx";

export default function Login() {
  const navigate = useNavigate();
  const { setStore } = useCart();

  function handleLogin(e) {
    e.preventDefault();

    const formData = new FormData(e.target);
    const storeValue = formData.get("store");

    setStore(storeValue);
    navigate("/fo-start");
  }

  return (
    <div style={styles.container}>
      <>
        <h1>Login</h1>
        <form onSubmit={handleLogin} style={styles.form}>
          {/* 
          <input
            name="username"
            placeholder="Username"
            style={styles.input}
            required
          /> 
          */}
          <input
            name="store"
            placeholder="Store"
            style={styles.input}
            required
          />
          <button type="submit" style={styles.button}>
            Log In
          </button>
        </form>
      </>
    </div>
  );
}

const styles = {
  form: {
    display: "flex",
    flexDirection: "column",
    gap: 10,
  },
  input: {
    padding: 8,
    fontSize: 14,
  },
  button: {
    padding: 10,
    cursor: "pointer",
  },
  container: {
    minHeight: "100vh",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    textAlign: "center",
  },
};
