import DogInfo from "./dogInfo";

interface Dog {
  id: string;
  img: string;
  name: string;
  age: number;
  zip_code: string;
  breed: string;
}

function Favorites({
  dogs,
  removeFromFavorites,
}: {
  dogs: Dog[];
  removeFromFavorites: (id: string) => void;
}) {
  return (
    <>
      <h2 className="mt-3">Favorite Dogs</h2>
      <div className="d-flex flex-wrap justify-content-center gap-3">
        {dogs.map((dog) => (
          <div
            key={dog.id}
            className="card text-center"
            style={{ width: "18rem" }}
          >
            <DogInfo
              id={dog.id}
              img={dog.img}
              name={dog.name}
              age={dog.age}
              zip_code={dog.zip_code}
              breed={dog.breed}
            />
            <button
              className="btn btn-danger"
              onClick={() => removeFromFavorites(dog.id)}
            >
              Remove
            </button>
          </div>
        ))}
      </div>
    </>
  );
}

export default Favorites;
