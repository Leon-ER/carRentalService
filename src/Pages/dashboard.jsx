import React, { useEffect, useState } from "react";
import { Modal, Button, Form } from "react-bootstrap";
import Menu from "../Components/menu";
import "../CSS/dashboard.css";
import { pdfInvoice } from "../Components/pdfInvoice";
import  {fetchCarDetails, fetchCarById, updateCar, deleteCarById,addCar, returnCarById } from "../services/dashboard";

export function Dashboard() {
  const userEmail = localStorage.getItem("userEmail");
  const [filteredCars, setFilteredCars] = useState([]);
  const [selectedCar, setSelectedCar] = useState(null);
  const [open, setOpen] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showModifyModal, setShowModifyModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const initialCarFields = {
    carId: "",
    make: "",
    model: "",
    mileage: "",
    available: "",
    price: "",
    year: "",
    location: "",
    type: "",
  };
  const [carFields, setCarFields] = useState(initialCarFields);
  const role = localStorage.getItem("userRole");

  useEffect(() => {
    const loadCars = async () => {
      try {
        const data = await fetchCarDetails(userEmail);
        setFilteredCars(data);
      } catch (error) {
        console.error("Error loading cars:", error);
      } finally {
      }
    };
      loadCars();
  }, [userEmail]);

  const handleOpen = (car) => {
    setSelectedCar(car);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setSelectedCar(null);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCarFields((prevFields) => ({ ...prevFields, [name]: value }));
  };

  const handleModifyOpen = async (carId) => {
    try {
      const car = await fetchCarById(carId); 
      
      setCarFields({
        carId: car.carId,
        make: car.make,
        model: car.model,
        mileage: car.mileage,
        available: car.available,
        price: car.price,
        year: car.year,
        location: car.location,
        type: car.type,
      });
  
      setShowModifyModal(true);
    } catch (error) {
      console.error("Error fetching car details:", error);
    }
  };

  const handleUpdateCar = async () => {
    try {
      const formattedCarFields = {
        ...carFields,
        carId: carFields.carId ? parseInt(carFields.carId, 10) : undefined,
        mileage: carFields.mileage ? parseInt(carFields.mileage, 10) : 0,
        year: carFields.year ? parseInt(carFields.year, 10) : 0,
        price: carFields.price ? parseFloat(carFields.price) : 0.0,
      };
  
      await updateCar(formattedCarFields);
  
      alert("Car updated successfully!");
      setShowModifyModal(false);
      setCarFields(initialCarFields);
      window.location.reload();
    } catch (error) {
      console.error("Error updating car:", error);
    }
  };

  const handleDeleteCar = async () => {
    try {
      await deleteCarById(carFields.carId);
  
      alert("Car deleted successfully!");
      setShowDeleteModal(false);
      setCarFields(initialCarFields);
    } catch (error) {
      console.error("Error deleting car:", error);
    }
  };

  const handleAddCar = async () => {
    try {
      const formattedCarFields = {
        ...carFields,
        carId: carFields.carId ? parseInt(carFields.carId, 10) : undefined,
        mileage: carFields.mileage ? parseInt(carFields.mileage, 10) : 0,
        year: carFields.year ? parseInt(carFields.year, 10) : 0,
        price: carFields.price ? parseFloat(carFields.price) : 0.0,
      };
  
      await addCar(formattedCarFields);
  
      alert("Car added successfully!");
      setShowAddModal(false);
      setCarFields(initialCarFields);  
    } catch (error) {
      console.error("Error adding car:", error);
    }
  };

  const donnloadInvoice = () => {
    if (selectedCar && selectedCar.timeBorrowed) {
      pdfInvoice(selectedCar, userEmail, selectedCar.timeBorrowed);
    } else {
      alert("Unable to generate invoice. Missing rental details.");
    }
  };

  const returnCar = async () => {
    try {
      const responseData = await returnCarById(userEmail, selectedCar.carId);
      console.log(responseData);
      alert("car returned");
      handleClose(false);  
      window.location.reload();
    } catch (error) {
      console.error("Error:", error);
    }
  };
  
  return (
    <div
      className="container-fluid"
      style={{
        background: "linear-gradient(to right, #1f1f1f, #282c34)", 
        minHeight: "100vh",
        padding: "2rem",
        color: "#ffffff",
        fontFamily: "'Poppins', sans-serif",
      }}
    >
      <Menu />
      {userEmail && <h1 style={{ color: "#61dafb" }}>Hello, {userEmail}</h1>}
      <div className="row">
        {/* Admin Controls */}
        {role === "Admin" && (
          <aside
            className="col-md-3"
            style={{
              padding: "20px",
              color: "#fff",
              backgroundColor: "#3a3f47",
              borderRadius: "8px",
              boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
            }}
          >
            <h3>Admin Functions</h3>
            <div
              style={{ display: "flex", flexDirection: "column", gap: "10px" }}
            >
              <Button
                variant="primary"
                onClick={() => {
                  setShowAddModal(true);
                  setCarFields(initialCarFields);
                }}
                style={{
                  backgroundColor: "#61dafb",
                  borderColor: "#61dafb",
                  color: "#282c34",
                  borderRadius: "8px",
                  transition: "background-color 0.3s ease",
                }}
                onMouseEnter={(e) =>
                  (e.target.style.backgroundColor = "#4aaedb")
                }
                onMouseLeave={(e) =>
                  (e.target.style.backgroundColor = "#61dafb")
                }
              >
                Add Car
              </Button>
              <Button
                variant="primary"
                onClick={() => {
                  const carId = prompt("Please enter the Car ID to modify:");
                  if (carId) {
                    handleModifyOpen(carId);
                  }
                }}
                style={{
                  backgroundColor: "#61dafb",
                  borderColor: "#61dafb",
                  color: "#282c34",
                  borderRadius: "8px",
                  transition: "background-color 0.3s ease",
                }}
                onMouseEnter={(e) =>
                  (e.target.style.backgroundColor = "#4aaedb")
                }
                onMouseLeave={(e) =>
                  (e.target.style.backgroundColor = "#61dafb")
                }
              >
                Modify Car
              </Button>
              <Button
                variant="primary"
                onClick={() => {
                  const carId = prompt("Please enter the Car ID to delete:");
                  if (carId) {
                    setCarFields((prevFields) => ({ ...prevFields, carId }));
                    setShowDeleteModal(true);
                  }
                }}
                style={{
                  backgroundColor: "#61dafb",
                  borderColor: "#61dafb",
                  color: "#282c34",
                  borderRadius: "8px",
                  transition: "background-color 0.3s ease",
                }}
                onMouseEnter={(e) =>
                  (e.target.style.backgroundColor = "#4aaedb")
                }
                onMouseLeave={(e) =>
                  (e.target.style.backgroundColor = "#61dafb")
                }
              >
                Delete Car
              </Button>
            </div>
          </aside>
        )}

        {/* Car Listings */}
        <div className="col-md-9">
          <div className="row">
            {filteredCars.map((car) => (
              <div
                key={car.carId}
                className="col-md-4 mb-3"
                onClick={() => handleOpen(car)}
              >
                <div
                  className="card h-100"
                  style={{
                    backgroundColor: "#3a3f47",
                    color: "#fff",
                    borderColor: "#555",
                    borderRadius: "8px",
                    boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
                    transition: "transform 0.3s ease",
                  }}
                  onMouseEnter={(e) =>
                    (e.currentTarget.style.transform = "scale(1.05)")
                  }
                  onMouseLeave={(e) =>
                    (e.currentTarget.style.transform = "scale(1)")
                  }
                >
                  <div className="card-body">
                    <h5 className="card-title">
                      {car.make} {car.model}
                    </h5>
                    <p className="card-text">Mileage: {car.mileage} km</p>
                    <p className="card-text">
                      Time Borrowed: {car.timeBorrowed} days
                    </p>
                    <p className="card-text">Location: {car.location}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Car Details Modal */}
      <Modal show={open} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Car Details</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedCar && (
            <>
              <h5>
                {selectedCar.make} {selectedCar.model}
              </h5>
              <p>Return car</p>
            </>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button id="rentBtn" onClick={returnCar}>
            Return car
          </Button>
          <Button id="downloadPdf" onClick={donnloadInvoice}>
            Download invoice
          </Button>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Add Car Modal */}
      <Modal
        show={showAddModal}
        onHide={() => {
          setShowAddModal(false);
          setCarFields(initialCarFields);
        }}
      >
        <Modal.Header closeButton>
          <Modal.Title>Add Car</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group>
              <Form.Label>Make</Form.Label>
              <Form.Control
                name="make"
                value={carFields.make}
                onChange={handleInputChange}
              />
            </Form.Group>
            <Form.Group>
              <Form.Label>Model</Form.Label>
              <Form.Control
                name="model"
                value={carFields.model}
                onChange={handleInputChange}
              />
            </Form.Group>
            <Form.Group>
              <Form.Label>Mileage</Form.Label>
              <Form.Control
                name="mileage"
                value={carFields.mileage}
                onChange={handleInputChange}
              />
            </Form.Group>
            <Form.Group>
              <Form.Label>Available</Form.Label>
              <Form.Control
                as="select"
                name="available"
                value={carFields.available}
                onChange={handleInputChange}
              >
                <option value="Yes">Yes</option>
                <option value="No">No</option>
              </Form.Control>
            </Form.Group>
            <Form.Group>
              <Form.Label>Price</Form.Label>
              <Form.Control
                name="price"
                value={carFields.price}
                onChange={handleInputChange}
              />
            </Form.Group>
            <Form.Group>
              <Form.Label>Year</Form.Label>
              <Form.Control
                name="year"
                value={carFields.year}
                onChange={handleInputChange}
              />
            </Form.Group>
            <Form.Group>
              <Form.Label>Location</Form.Label>
              <Form.Control
                name="location"
                value={carFields.location}
                onChange={handleInputChange}
              />
            </Form.Group>
            <Form.Group>
              <Form.Label>Type</Form.Label>
              <Form.Control
                as="select"
                name="type"
                value={carFields.type}
                onChange={handleInputChange}
              >
                <option value="">Select a Type</option>
                <option value="Convertible">Convertible</option>
                <option value="Coupe">Coupe</option>
                <option value="Hatchback">Hatchback</option>
                <option value="Luxury">Luxury</option>
                <option value="Minivan">Minivan</option>
                <option value="Sedan">Sedan</option>
                <option value="Sport">Sport</option>
                <option value="Supercar">Supercar</option>
                <option value="SUV">SUV</option>
                <option value="Truck">Truck</option>
                <option value="Van">Van</option>
              </Form.Control>
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="primary" onClick={handleAddCar}>
            Add Car
          </Button>
          <Button
            variant="secondary"
            onClick={() => {
              setShowAddModal(false);
              setCarFields(initialCarFields);
            }}
          >
            Close
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Modify Car Modal */}
      <Modal
        show={showModifyModal}
        onHide={() => {
          setShowModifyModal(false);
          setCarFields(initialCarFields);
        }}
      >
        <Modal.Header closeButton>
          <Modal.Title>Modify Car</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group>
              <Form.Label>Car ID</Form.Label>
              <Form.Control
                name="carId"
                value={carFields.carId}
                onChange={handleInputChange}
                disabled
              />
            </Form.Group>
            <Form.Group>
              <Form.Label>Make</Form.Label>
              <Form.Control
                name="make"
                value={carFields.make}
                onChange={handleInputChange}
              />
            </Form.Group>
            <Form.Group>
              <Form.Label>Model</Form.Label>
              <Form.Control
                name="model"
                value={carFields.model}
                onChange={handleInputChange}
              />
            </Form.Group>
            <Form.Group>
              <Form.Label>Mileage</Form.Label>
              <Form.Control
                name="mileage"
                value={carFields.mileage}
                onChange={handleInputChange}
              />
            </Form.Group>
            <Form.Group>
              <Form.Label>Available</Form.Label>
              <Form.Control
                as="select"
                name="available"
                value={carFields.available}
                onChange={handleInputChange}
              >
                <option value="Yes">Yes</option>
                <option value="No">No</option>
              </Form.Control>
            </Form.Group>
            <Form.Group>
              <Form.Label>Price</Form.Label>
              <Form.Control
                name="price"
                value={carFields.price}
                onChange={handleInputChange}
              />
            </Form.Group>
            <Form.Group>
              <Form.Label>Year</Form.Label>
              <Form.Control
                name="year"
                value={carFields.year}
                onChange={handleInputChange}
              />
            </Form.Group>
            <Form.Group>
              <Form.Label>Location</Form.Label>
              <Form.Control
                name="location"
                value={carFields.location}
                onChange={handleInputChange}
              />
            </Form.Group>
            <Form.Group>
              <Form.Label>Type</Form.Label>
              <Form.Control
                as="select"
                name="type"
                value={carFields.type}
                onChange={handleInputChange}
              >
                <option value="">Select a Type</option>
                <option value="Convertible">Convertible</option>
                <option value="Coupe">Coupe</option>
                <option value="Hatchback">Hatchback</option>
                <option value="Luxury">Luxury</option>
                <option value="Minivan">Minivan</option>
                <option value="Sedan">Sedan</option>
                <option value="Sport">Sport</option>
                <option value="Supercar">Supercar</option>
                <option value="SUV">SUV</option>
                <option value="Truck">Truck</option>
                <option value="Van">Van</option>
              </Form.Control>
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="primary" onClick={handleUpdateCar}>
            Modify Car
          </Button>
          <Button
            variant="secondary"
            onClick={() => {
              setShowModifyModal(false);
              setCarFields(initialCarFields);
            }}
          >
            Close
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Delete Car Modal */}
      <Modal
        show={showDeleteModal}
        onHide={() => {
          setShowDeleteModal(false);
          setCarFields(initialCarFields);
        }}
      >
        <Modal.Header closeButton>
          <Modal.Title>Delete Car</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>
            Are you sure you want to delete the car with ID: {carFields.carId}?
          </p>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="danger" onClick={handleDeleteCar}>
            Delete Car
          </Button>
          <Button
            variant="secondary"
            onClick={() => {
              setShowDeleteModal(false);
              setCarFields(initialCarFields);
            }}
          >
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}
