import { useNavigate } from "react-router-dom";

interface Dog {
  id: string;
  img: string;
  name: string;
  age: number;
  zip_code: string;
  breed: string;
}

export default function Navbar({ favorites }: { favorites: Dog[] }) {
  const navigate = useNavigate();
  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
      <div className="container-fluid">
        <span className="navbar-brand mb-0 h1">
          Dog Matcher <i className="bi bi-search-heart-fill"></i>
        </span>
        <ul className="navbar-nav gap-2">
          <li className="nav-item">
            {favorites.length > 0 && (
              <button
                className="btn btn-warning"
                type="button"
                onClick={() => navigate("/results", { state: { favorites } })}
              >
                Submit Favorites
              </button>
            )}
          </li>
          <li className="nav-item">
            <button
              className="btn btn-danger"
              type="button"
              onClick={() => navigate("/")}
            >
              Log Out
            </button>
          </li>
        </ul>
      </div>
    </nav>
  );
}
