import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import DogInfo from "../Components/dogInfo";
import Favorites from "../Components/favorites";

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
  const [filterZipCode, setFilterZipcode] = useState("All");
  const [filterBreed, setFilterBreed] = useState("All");
  const [breeds, setBreeds] = useState<string[]>([]);
  const [dogIDs, setDogIDs] = useState<string[]>([]);
  const [favorites, setFavorites] = useState<Dog[]>([]);
  const navigate = useNavigate();

  const dogsBaseURL = "https://frontend-take-home-service.fetch.com";

  const fetchDogs = async () => {
    let url = `${dogsBaseURL}/dogs/search?sort=breed:asc&breeds=`;

    if (filterBreed !== "All") {
      url += encodeURIComponent(filterBreed);
    } else {
      url = `${dogsBaseURL}/dogs/search?sort=breed:asc`;
    }
    console.log("Fetching dogs with URL:", url);

    const response = await fetch(url, {
      method: "GET",
      credentials: "include",
    });

    if (!response.ok) {
      // Redirect to login if not authenticated
      navigate("/");
    }

    const data = await response.json();
    setDogIDs(data.resultIds);
    console.log("Dog IDs fetched:", data.resultIds);
  };

  const fetchDogInfo = async () => {
    const response = await fetch(
      "https://frontend-take-home-service.fetch.com/dogs",
      {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(dogIDs),
      }
    );
    const dogsData = await response.json();
    setDogs(dogsData);
    console.log("Response from /dogs:", dogsData);

    if (!response.ok) {
      throw new Error(`Failed to fetch Dogs: ${response.status}`);
    }
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
    console.log(filterBreed, "- has changed"); //Debugging, listen to state change
    //TO DO:form query on selected breed change.
    fetchDogs();
  }, [filterBreed]);

  useEffect(() => {
    if (dogIDs.length > 0) {
      fetchDogInfo();
    }
  }, [dogIDs]);

  useEffect(() => {
    console.log("Dogs array has changed");
    console.log(dogs);
  }, [dogs]);

  const handleBreedSelect = (breed: string) => {
    setFilterBreed(breed);
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
    setFavorites([...favorites, dog]); // Create a new array without mutation
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

  const dogInfo = dogs.map((item) => (
    <div className="card" key={item.id} style={{ width: "18rem" }}>
      <DogInfo
        id={item.id}
        img={item.img}
        name={item.name}
        age={item.age}
        zip_code={item.zip_code}
        breed={item.breed}
      />
      <button
        onClick={() => addToFavorites(item, favorites, setFavorites)}
        className="btn btn-primary"
      >
        Add to Favorites
      </button>
    </div>
  ));

  return (
    <>
      <title>Search</title>
      <h1>Search Page</h1>

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
          <ul className="dropdown-menu dropdown-menu-dark">
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
            State: {filterZipCode}
          </button>
          <ul className="dropdown-menu dropdown-menu-dark">
            <li>
              <button className="dropdown-item" type="button"></button>
            </li>
            {}
          </ul>
        </div>
      </div>
      <Favorites dogs={favorites} />
      <h2 className="mt-3">Dogs</h2>
      <div className="d-flex flex-wrap justify-content-center gap-3 mt-3">
        <div className="container text-center">
          {dogInfo}
          {dogs.length === 0 && (
            <div className="alert alert-info" role="alert">
              No dogs found. Please try a different filter.
            </div>
          )}
        </div>
      </div>
    </>
  );
}

export default Search;
