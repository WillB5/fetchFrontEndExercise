import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import DogInfo from "../Components/dogInfo";
import Favorites from "../Components/favorites";
import Navbar from "../Components/navbar";

interface Dog {
  id: string;
  img: string;
  name: string;
  age: number;
  zip_code: string;
  breed: string;
}

function Search() {
  const [dogs, setDogs] = useState<Dog[]>([]);
  const [sortOrder, setSortOrder] = useState("asc");
  const [filterBreed, setFilterBreed] = useState("All");
  const [breeds, setBreeds] = useState<string[]>([]);
  const [nextPage, setNextPage] = useState<string | null>(null);
  const [prevPage, setPrevPage] = useState<string | null>(null);
  const [favorites, setFavorites] = useState<Dog[]>([]);
  const navigate = useNavigate();

  const dogsBaseURL = "https://frontend-take-home-service.fetch.com";

  function formQuery() {
    if (filterBreed == "All") {
      return `${dogsBaseURL}/dogs/search?sort=breed:${sortOrder}`;
    } else {
      return `${dogsBaseURL}/dogs/search?sort=breed:${sortOrder}&breeds=${encodeURIComponent(
        filterBreed
      )}`;
    }
  }

  const fetchDogs = async (url?: string) => {
    if (!url) {
      url = formQuery();
      setNextPage(null);
      setPrevPage(null);
    } else {
      url = `${dogsBaseURL}${url}`;
    }

    const response = await fetch(url, {
      method: "GET",
      credentials: "include",
    });

    if (!response.ok) {
      console.error("Failed to fetch dogs:", response.status);
      navigate("/");
      return;
    }

    const data = await response.json();

    //check if next page is empty
    const nextResponse = await fetch(dogsBaseURL + data.next, {
      method: "GET",
      credentials: "include",
    });
    const nextData = await nextResponse.json();
    if (nextData.resultIds?.length === 0) {
      setNextPage(null);
    } else {
      setNextPage(data.next);
    }
    setPrevPage(data.prev);

    console.log("Dog IDs fetched:", data.resultIds);

    //fetch dog info after getting IDs
    const dogInfoResponse = await fetch(`${dogsBaseURL}/dogs`, {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data.resultIds),
    });

    if (!dogInfoResponse.ok) {
      throw new Error(`Failed to fetch Dogs: ${dogInfoResponse.status}`);
    }

    const dogsData = await dogInfoResponse.json();
    setDogs(dogsData);
    console.log("Dog Data:", dogsData);
  };

  const fetchBreeds = async () => {
    const response = await fetch(
      "https://frontend-take-home-service.fetch.com/dogs/breeds",
      {
        method: "GET",
        credentials: "include",
      }
    );

    if (!response.ok) {
      throw new Error(`Failed to fetch breeds: ${response.status}`);
    }

    const data = await response.json();
    setBreeds(data);
  };

  useEffect(() => {
    fetchDogs();
    fetchBreeds();
  }, []);

  useEffect(() => {
    fetchDogs();
  }, [filterBreed, sortOrder]);

  const handleBreedSelect = (breed: string) => {
    setFilterBreed(breed);
  };

  const handleSortOrderSelect = (order: string) => {
    setSortOrder(order);
  };

  const addToFavorites = (
    dog: Dog,
    favorites: Dog[],
    setFavorites: (dogs: Dog[]) => void
  ) => {
    const isAlreadyFavorite = favorites.some((fav) => fav.id === dog.id);

    if (isAlreadyFavorite) {
      console.log(`${dog.name} is already in favorites.`);
      return;
    }

    console.log(`${dog.name} added to favorites!`);
    setFavorites([...favorites, dog]);
  };

  const removeFromFavorites = (id: string) => {
    setFavorites(favorites.filter((dog) => dog.id !== id));
  };

  const dogIDList = breeds.map((item, index) => (
    <li key={index}>
      <button
        className="dropdown-item"
        onClick={() => handleBreedSelect(item)}
        type="button"
      >
        {item}
      </button>
    </li>
  ));

  return (
    <>
      <title>Search</title>

      <div className="bg-secondary bg-opacity-50 min-vh-100">
        <Navbar favorites={favorites} />

        <div className="d-flex justify-content-center mt-3">
          <div id="filterBar" className="d-flex gap-3">
            <h4>Filter by:</h4>
            <div className="dropdown">
              <button
                className="btn btn-secondary dropdown-toggle"
                type="button"
                data-bs-toggle="dropdown"
                aria-expanded="false"
              >
                Breed: {filterBreed}
              </button>
              <ul
                className="dropdown-menu dropdown-menu-dark"
                style={{ maxHeight: "30vh", overflowY: "auto" }}
              >
                <li>
                  <button
                    className="dropdown-item"
                    onClick={() => handleBreedSelect("All")}
                    type="button"
                  >
                    All
                  </button>
                </li>
                {dogIDList}
              </ul>
            </div>

            <div className="dropdown">
              <button
                className="btn btn-secondary dropdown-toggle"
                type="button"
                data-bs-toggle="dropdown"
                aria-expanded="false"
              >
                Order: {sortOrder.charAt(0).toUpperCase() + sortOrder.slice(1)}
              </button>
              <ul className="dropdown-menu dropdown-menu-dark">
                <li>
                  <button
                    className="dropdown-item"
                    onClick={() => handleSortOrderSelect("asc")}
                    type="button"
                  >
                    Ascending
                  </button>
                </li>
                <li>
                  <button
                    className="dropdown-item"
                    onClick={() => handleSortOrderSelect("desc")}
                    type="button"
                  >
                    Descending
                  </button>
                </li>
              </ul>
            </div>
          </div>
        </div>

        <div
          className="d-flex justify-content-center gap-4 mt-4"
          style={{ height: "85vh" }}
        >
          {/* Available Dogs */}
          <div
            className="border rounded border-primary p-3 overflow-auto bg-light"
            style={{ width: "45%", height: "100%" }}
          >
            <h2 className="mt-3 text-center align-middle">Available Dogs</h2>

            <div className="row row-cols-1 row-cols-sm-2 row-cols-md-3 g-3 justify-content-center">
              {dogs
                .filter((dog) => !favorites.some((fav) => fav.id === dog.id))
                .map((item) => (
                  <div
                    key={item.id}
                    className="col d-flex justify-content-center"
                  >
                    <div
                      className="card text-center"
                      style={{ width: "18rem" }}
                    >
                      <DogInfo
                        id={item.id}
                        img={item.img}
                        name={item.name}
                        age={item.age}
                        zip_code={item.zip_code}
                        breed={item.breed}
                      />
                      <button
                        onClick={() =>
                          addToFavorites(item, favorites, setFavorites)
                        }
                        className="btn btn-primary"
                      >
                        Add to Favorites
                      </button>
                    </div>
                  </div>
                ))}
            </div>

            {dogs.filter((dog) => !favorites.some((fav) => fav.id === dog.id))
              .length === 0 && (
              <div className="alert alert-info mt-3" role="alert">
                No dogs found. Please try a different filter.
              </div>
            )}
          </div>

          {/* Favorites */}
          <div
            className="border border-success rounded p-3 overflow-auto bg-light"
            style={{
              width: "30%", // behaves like Available Dogs
              maxWidth: "22rem", // ensures it never exceeds 22rem
              height: "100%",
              alignSelf: "flex-start",
            }}
          >
            <Favorites
              dogs={favorites}
              removeFromFavorites={removeFromFavorites}
            />
          </div>
        </div>
        <div className="container d-flex justify-content-center mt-3 gap-1">
          <button
            className="btn btn-primary d-flex"
            disabled={prevPage == null}
            onClick={() => {
              if (prevPage) {
                fetchDogs(prevPage);
              }
            }}
          >
            Prev
          </button>
          <button
            className="btn btn-primary d-flex"
            disabled={!nextPage || dogs.length === 0}
            onClick={() => {
              if (nextPage) {
                fetchDogs(nextPage);
              }
            }}
          >
            Next
          </button>
        </div>
      </div>
    </>
  );
}

export default Search;
