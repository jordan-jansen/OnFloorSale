import { useState } from "react";
import { useNavigate } from "react-router-dom";


export default function Admin(){
    
    const [admin, setAdmin] = useState("");
    const nav = useNavigate();
    function handleLogin() {
        if (admin.length == 0) {
            alert("You need to enter valid admin login");
        }
        setAdmin(admin);
       nav("/products") 
    }

    result(
        <div style={styles.container}>
            <>
                <form onSubmit={handleLogin}>
                <h1 >ADMIN LOG IN</h1>
                <input 
                type="text"
                placeholder="Enter admin log in details"
                required
                />

                <input
                type="password"
                placeholder="Enter your password"/>
                required
                </form>
            </>

        </div>
    )
}