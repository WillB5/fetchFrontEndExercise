import { createContext, useContext, useState } from "react";
import { useNavigate } from "react-router-dom";

function Login() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    // Prevent the browser from reloading the page
    e.preventDefault();
    console.log("handleSubmit ran"); //Debugging
    console.log("name submitted: ", name); //Debugging
    console.log("email submitted: ", email); //Debugging
    login(name, email);
    console.log("end of handleSubmit"); //Debugging
  };

  const login = async (name: string, email: string) => {
    try {
      const response = await fetch(
        "https://frontend-take-home-service.fetch.com/auth/login",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify({ name, email }),
        }
      );

      if (response.ok) {
        console.log("Login successful"); //Debugging
        navigate("/search");
      } else {
        console.error(`Login failed. Status: ${response.status}`); //Debugging
      }
    } catch (error) {
      console.error("Network or server error:", error);
    }
  };

  return (
    <>
      <title>Login</title>
      <form className="mx-auto p-4" onSubmit={handleSubmit}>
        <div className="mb-3">
          <label for="inputName" class="form-label">
            Name
          </label>
          <input
            type="text"
            className="form-control"
            id="inputName"
            onChange={(e) => setName(e.target.value)}
          ></input>
        </div>
        <div className="mb-3">
          <label for="inputEmail" class="form-label">
            Email address
          </label>
          <input
            type="email"
            className="form-control"
            id="inputEmail"
            aria-describedby="emailHelp"
            onChange={(e) => setEmail(e.target.value)}
          ></input>
        </div>

        <button type="submit" className="btn btn-primary">
          Submit
        </button>
      </form>
    </>
  );
}

export default Login;
