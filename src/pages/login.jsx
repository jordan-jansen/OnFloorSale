import { useNavigate } from "react-router-dom";
import { useCart } from "../cartContext.jsx";

export default function Login() {
  const navigate = useNavigate();
  const { setStore } = useCart();

  function handleLogin(e) {
    e.preventDefault();

    const formData = new FormData(e.target); //  capital F
    const storeValue = formData.get("store"); //  must match input name
    // const usernameValue = formData.get("username");

    //  save into context so other pages (like PrintOrder) can use it
    setStore(storeValue);
    // setUsername(usernameValue);

    navigate("/fo-start");
  }

  return (
    
    <div style={styles.container} >
      <>
        <h1>Login</h1>
        <form onSubmit={handleLogin} style={styles.form}>
          {/* <input
            name="username"
            placeholder="Username"
            style={styles.input}
            required
          /> */}
          <input
            name="store"   //  changed to lowercase "store"
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
    minHeight: "100vh", // full page height
    display: "flex",
    flexDirection: "column", // stack items top-to-bottom
    justifyContent: "center", // vertical center
    alignItems: "center", // horizontal center
    textAlign: "center", // center the text itself
    },
    


 
  };

