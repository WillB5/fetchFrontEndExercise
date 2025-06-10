import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function Login() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    //ensure no one is logged in when they visit the login page
    const logout = async () => {
      await fetch("https://frontend-take-home-service.fetch.com/auth/logout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
      });
    };
    logout();
  }, []);

  const handleSubmit = (e: { preventDefault: () => void }) => {
    e.preventDefault();
    console.log("handleSubmit ran");
    console.log("name submitted: ", name);
    console.log("email submitted: ", email);
    login(name, email);
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
        console.log("Login successful");
        navigate("/search");
      }
    } catch (error) {
      console.error("Network or server error:", error);
    }
  };

  return (
    <>
      <title>Login</title>
      <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
        <div className="container-fluid">
          <span className="navbar-brand mb-0 h1">
            Dog Matcher <i className="bi bi-search-heart-fill"></i>
          </span>
          <ul className="navbar-nav">
            <li className="nav-item"></li>
          </ul>
        </div>
      </nav>
      <form className="mx-auto p-4" onSubmit={handleSubmit}>
        <div className="mb-3">
          <label htmlFor="inputName" className="form-label">
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
          <label htmlFor="inputEmail" className="form-label">
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
