import { useEffect, useState } from "react";

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
  const [zipCodes, setZipcodes] = useState();
  const [filterBreed, setFilterBreed] = useState("All");
  const [breeds, setBreeds] = useState<string[]>([]);

  const dogsBaseURL = "https://frontend-take-home-service.fetch.com";

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

  const fetchDogs = async () => {
    const response = await fetch(
      "https://frontend-take-home-service.fetch.com/dogs/search?",
      {
        method: "GET",
        credentials: "include",
      }
    );

    if (!response.ok) {
      throw new Error(`Failed to fetch Dogs: ${response.status}`);
    }

    const data = await response.json();
    setDogs(data);
  };

  function formQuery(breed, zipCode) {
    if (zipCode == "All" && breed == "All") {
      return "";
    }
  }

  useEffect(() => {
    fetchBreeds();
    fetchDogs();
  }, []);

  useEffect(() => {
    console.log(filterBreed, "- has changed"); //Debugging, listen to state change
  }, [filterBreed]);

  useEffect(() => {
    console.log("Dogs array has changed");
    console.log(dogs);
  }, [dogs]);

  const handleBreedSelect = (breed: string) => {
    setFilterBreed(breed);
  };

  const dogList = breeds.map((item, index) => (
    <li key={index}>
      <button
        className="dropdown-item"
        onClick={() => handleBreedSelect(item)}
        type="button"
        key={index}
      >
        {item}
      </button>
    </li>
  ));

  return (
    <>
      <title>Search</title>
      <h1>Search Page</h1>
      <div id="filterBar" className="d-flex gap-3">
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
            {dogList}
          </ul>
        </div>

        <div className="dropdown">
          <button
            className="btn btn-secondary dropdown-toggle"
            type="button"
            data-bs-toggle="dropdown"
            aria-expanded="false"
          >
            Zip Code: {filterZipCode}
          </button>
          <ul className="dropdown-menu dropdown-menu-dark">
            <li>
              <button className="dropdown-item" type="button"></button>
            </li>
            {}
          </ul>
        </div>
      </div>

      <div className="container text-center">
        <div className="row">
          <div className="col">1 of 5</div>
          <div className="col">2 of 5</div>
          <div className="col">3 of 5</div>
          <div className="col">4 of 5</div>
          <div className="col">5 of 5</div>
        </div>
        <div className="row">
          <div className="col">1 of 5</div>
          <div className="col">2 of 5</div>
          <div className="col">3 of 5</div>
          <div className="col">4 of 5</div>
          <div className="col">5 of 5</div>
        </div>
      </div>
    </>
  );
}

export default Search;
