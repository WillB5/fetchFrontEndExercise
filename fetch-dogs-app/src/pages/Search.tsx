import { useEffect, useState } from "react";
import DogInfo from "../Components/dogInfo";

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
  const [dogIDs, setDogIDs] = useState<string[]>([]);

  const dogsBaseURL = "https://frontend-take-home-service.fetch.com";

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

  function formQuery(breed: string, zipCode: string) {
    if (zipCode == "All" && breed == "All") {
      return "";
    }
  }

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

  const dogIDList = breeds.map((item, index) => (
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

  const dogInfo = dogs.map((item) => (
    <div className="card" key={item.id}>
      <DogInfo
        id={item.id}
        img={item.img}
        name={item.name}
        age={item.age}
        zip_code={item.zip_code}
        breed={item.breed}
      />
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
        <div className="row">{dogInfo}</div>
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
