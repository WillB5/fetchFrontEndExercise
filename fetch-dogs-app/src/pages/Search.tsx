import { useEffect, useState } from "react";

function Search() {
  const [count, setCount] = useState(0);
  const dogs = ["Husky", "German Shepherd"]; //example for testing
  const dogsBaseURL = "https://frontend-take-home-service.fetch.com";

  const dogList = dogs.map((item, index) => (
    <li class="list-group-item" key={index}>
      {item}
    </li>
  ));

  return (
    <>
      <title>Search</title>
      <h1>Search Page</h1>
      <ul class="list-group">{dogList}</ul>
    </>
  );
}

export default Search;
