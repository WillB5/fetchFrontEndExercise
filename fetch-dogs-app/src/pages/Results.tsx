import { useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import Navbar from "../Components/navbar";

interface Dog {
  id: string;
  img: string;
  name: string;
  age: number;
  zip_code: string;
  breed: string;
}
function Results() {
  const location = useLocation();
  const favorites = location.state?.favorites || [];
  console.log(favorites);
  const [match, setMatch] = useState<Dog>();

  const getDogMatch = async () => {
    const response = await fetch(
      "https://frontend-take-home-service.fetch.com/dogs/match",
      {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(favorites.map((dog: Dog) => dog.id)),
      }
    );

    const data = await response.json();
    console.log("match found: ", data.match);

    //fetch dog info after getting IDs
    const dogInfoResponse = await fetch(
      "https://frontend-take-home-service.fetch.com/dogs",
      {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify([data.match]),
      }
    );

    const dogsData = await dogInfoResponse.json();
    setMatch(dogsData[0]);
  };

  useEffect(() => {
    getDogMatch();
  }, []);

  return (
    <>
      <title>Results</title>
      <Navbar favorites={[]} />
      <div
        className="d-flex justify-content-center align-items-center mt-4"
        style={{ minHeight: "70vh" }}
      >
        <div className="container">
          <h1 className="text-center mb-4">Your Match is:</h1>
          {match && (
            <div
              className="card mx-auto w-100 w-md-75 w-lg-50"
              style={{ maxWidth: "500px" }}
              key={match.id}
            >
              <img
                src={match.img}
                alt={match.name}
                className="card-img-top object-fit-fill border rounded"
                style={{ maxHeight: "300px", objectFit: "cover" }}
              />
              <div className="card-body text-center">
                <h2 className="card-title">{match.name}</h2>
                <p className="card-text">Age: {match.age}</p>
                <p className="card-text">Breed: {match.breed}</p>
                <p className="card-text">Zip Code: {match.zip_code}</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}

export default Results;
