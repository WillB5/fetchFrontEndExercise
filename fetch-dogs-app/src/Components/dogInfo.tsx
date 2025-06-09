interface Dog {
  id: string;
  img: string;
  name: string;
  age: number;
  zip_code: string;
  breed: string;
}

function DogInfo(dog: Dog) {
  return (
    <div className="card" key={dog.id}>
      <img
        src={dog.img}
        alt={dog.name}
        className="card-img-top object-fit-fill border rounded"
        style={{ height: "200px", width: "100%" }}
      />
      <div className="card-body">
        <h2 className="card-title">{dog.name}</h2>
        <p className="card-text">Age: {dog.age}</p>
        <p className="card-text">Breed: {dog.breed}</p>
        <p className="card-text">Zip Code: {dog.zip_code}</p>
      </div>
    </div>
  );
}

export default DogInfo;
