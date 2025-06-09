import DogInfo from "./dogInfo";

interface Dog {
  id: string;
  img: string;
  name: string;
  age: number;
  zip_code: string;
  breed: string;
}

function Favorites({ dogs }: { dogs: Dog[] }) {
  return (
    <div className="favorites">
      <h2>Favorites</h2>
      {dogs.length > 0 ? (
        dogs.map((dog) => (
          <DogInfo
            key={dog.id}
            id={dog.id}
            img={dog.img}
            name={dog.name}
            age={dog.age}
            zip_code={dog.zip_code}
            breed={dog.breed}
          />
        ))
      ) : (
        <p>No favorite dogs found.</p>
      )}
    </div>
  );
}

export default Favorites;
