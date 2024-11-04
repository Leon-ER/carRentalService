import React, { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { Modal, Button } from "react-bootstrap";
import Menu from "../Components/menu";
import "../CSS/home.css";
import { borrowCarService, fetchCars } from "../services/home";

const Home = () => {
  const itemsPerPage = 12;
  const [filteredCars, setFilteredCars] = useState([]);
  const [filters, setFilters] = useState({
    make: "",
    location: "",
    minPrice: "",
    maxPrice: "",
    type: "",
  });
  const [currentPage, setCurrentPage] = useState(1);
  const [open, setOpen] = useState(false);
  const [selectedCar, setSelectedCar] = useState(null);
  const userEmail = localStorage.getItem("userEmail");
  let [date1, setDate1] = useState(null);
  let [date2, setDate2] = useState(null);
  const [days, setDays] = useState(0);
  const [totalPrice, setTotalPrice] = useState(0);
  const today = new Date().toISOString().split("T")[0];
  const indexOfLastCar = currentPage * itemsPerPage;
  const indexOfFirstCar = indexOfLastCar - itemsPerPage;
  const currentCars = filteredCars.slice(indexOfFirstCar, indexOfLastCar);
  const totalPages = Math.ceil(filteredCars.length / itemsPerPage);

  useEffect(() => {
    const loadCars = async () => {
      try {
        const data = await fetchCars();
        setFilteredCars(data);
      } catch (error) {
        console.error("Error loading cars:", error);
      }
    };
    loadCars();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFilters((prevState) => ({ ...prevState, [name]: value }));
  };

  const handleFilter = async () => {
    const { make, location, minPrice, maxPrice, type } = filters;
    try {
      const data = await fetchCars()
      const filtered = data.filter(
        (car) =>
          (!make || car.make?.toLowerCase().includes(make.toLowerCase())) &&
          (!location ||
            car.location?.toLowerCase().includes(location.toLowerCase())) &&
          (!type || car.type?.toLowerCase().includes(type.toLowerCase())) &&
          (!minPrice || (car.price && car.price >= parseFloat(minPrice))) &&
          (!maxPrice || (car.price && car.price <= parseFloat(maxPrice)))
      );
      setFilteredCars(filtered);
      setCurrentPage(1);
    } catch (error) {
      console.error("Error filtering cars:", error);
    }
  };

  const handleOpen = (car) => {
    setSelectedCar(car);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setSelectedCar(null);
    setDate1(null);
    setDate2(null);
  };

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  useEffect(() => {
    if (date1 && date2) {
      const calculatedDays = ConvertDate(date1, date2);
      setDays(calculatedDays);
      setTotalPrice(calculatedDays * (selectedCar?.price || 0));
    }
  }, [date1, date2, selectedCar]);

  const ConvertDate = (startDate, endDate) => {
    if (!startDate || !endDate) return 0;

    const day = 1000 * 60 * 60 * 24;

    const d1 = Date.parse(startDate);
    const d2 = Date.parse(endDate);

    let difference = Math.round((d2 - d1) / day);

    return difference > 0 ? difference : 0;
  };

  const rentNow = async () => {
    try {
      const response = await borrowCarService(selectedCar, userEmail, days);

      if (!response) {
        console.error("No response received from the server.");
        alert(
          "An error occurred while processing your request. Please try again."
        );
        return;
      }

      if (response.ok) {
        alert("Car booked successfully! ");
        handleClose();
      } else {
        const errorMessage = await response.text();
        console.error("Booking failed:", errorMessage);
      }
    } catch (err) {
      console.error("Error occurred during the rent now process:", err);
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
      <div className="row">
        {/* Filter Sidebar */}
        <div className="col-md-3">
          <div
            className="card p-3 mb-4"
            style={{
              backgroundColor: "#3a3f47",
              borderColor: "#555",
              color: "#fff",
              borderRadius: "8px", 
              boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
            }}
          >
            <h5>Filter Cars</h5>

            <div className="form-group">
              <label>Car Make</label>
              <input
                type="text"
                className="form-control"
                name="make"
                value={filters.make}
                onChange={handleChange}
                placeholder="Search by make"
                style={{
                  backgroundColor: "#555",
                  color: "#fff",
                  border: "1px solid #777",
                  borderRadius: "4px",
                }}
              />
            </div>

            <div className="form-group">
              <label>Type</label>
              <select
                className="form-control"
                name="type"
                value={filters.type}
                onChange={handleChange}
                style={{
                  backgroundColor: "#555",
                  color: "#fff",
                  border: "1px solid #777",
                  borderRadius: "4px",
                }}
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
              </select>
            </div>

            <div className="form-group">
              <label>Location</label>
              <input
                type="text"
                className="form-control"
                name="location"
                value={filters.location}
                onChange={handleChange}
                placeholder="Search by location"
                style={{
                  backgroundColor: "#555",
                  color: "#fff",
                  border: "1px solid #777",
                  borderRadius: "4px",
                }}
              />
            </div>

            <div className="form-group">
              <label>Min Price</label>
              <input
                type="number"
                className="form-control"
                name="minPrice"
                value={filters.minPrice}
                onChange={handleChange}
                placeholder="Min Price"
                style={{
                  backgroundColor: "#555",
                  color: "#fff",
                  border: "1px solid #777",
                  borderRadius: "4px",
                }}
              />
            </div>

            <div className="form-group">
              <label>Max Price</label>
              <input
                type="number"
                className="form-control"
                name="maxPrice"
                value={filters.maxPrice}
                onChange={handleChange}
                placeholder="Max Price"
                style={{
                  backgroundColor: "#555",
                  color: "#fff",
                  border: "1px solid #777",
                  borderRadius: "4px",
                }}
              />
            </div>

            <button
              className="btn btn-primary mt-2"
              onClick={handleFilter}
              style={{
                backgroundColor: "#61dafb",
                borderColor: "#61dafb",
                color: "#282c34",
                borderRadius: "8px",
                transition: "background-color 0.3s ease",
              }}
              onMouseEnter={(e) => (e.target.style.backgroundColor = "#4aaedb")}
              onMouseLeave={(e) => (e.target.style.backgroundColor = "#61dafb")}
            >
              Apply Filters
            </button>
          </div>
        </div>

        {/* Car List */}
        <div className="col-md-9">
          <div className="row">
            {currentCars.map((car) => (
              <div
                key={car.id}
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
                    <p className="card-text">Price: ${car.price} / day</p>
                    <p className="card-text">Year: {car.year}</p>
                    <p className="card-text">Available: {car.available}</p>
                    <p className="card-text">Location: {car.location}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <Modal show={open} onHide={handleClose}>
            <form onSubmit={rentNow}>
              <Modal.Header closeButton={handleClose}>
                <Modal.Title>Car Details</Modal.Title>
              </Modal.Header>
              <Modal.Body>
                {selectedCar && (
                  <>
                    <h5>
                      {selectedCar.make} {selectedCar.model}
                    </h5>
                    <div className="Date">
                      <p>Dates</p>
                      <input
                        type="date"
                        onChange={(e) => setDate1(e.target.value)}
                        required
                        min={today}
                        style={{
                          borderRadius: "4px",
                          border: "1px solid #777",
                          backgroundColor: "#f8f9fa",
                          padding: "0.5rem",
                        }}
                      />
                      --
                      <input
                        type="date"
                        onChange={(e) => setDate2(e.target.value)}
                        required
                        min={today}
                        style={{
                          borderRadius: "4px",
                          border: "1px solid #777",
                          backgroundColor: "#f8f9fa",
                          padding: "0.5rem",
                        }}
                      />
                    </div>
                    <p>Price: ${selectedCar.price} / day</p>
                    <p>Total price: ${totalPrice}</p>
                  </>
                )}
              </Modal.Body>
              <Modal.Footer>
                <Button id="rentBtn" type="submit">
                  Rent now
                </Button>
                <Button variant="secondary" onClick={handleClose}>
                  Close
                </Button>
              </Modal.Footer>
            </form>
          </Modal>

          {/* Pagination Menu */}
          <div className="d-flex justify-content-center mt-3">
            <nav>
              <ul className="pagination">
                <li
                  className={`page-item ${currentPage === 1 ? "active" : ""}`}
                >
                  <button
                    className="page-link"
                    onClick={() => handlePageChange(1)}
                  >
                    1
                  </button>
                </li>

                {currentPage > 4 && (
                  <li className="page-item disabled">
                    <span className="page-link">...</span>
                  </li>
                )}

                {Array.from({ length: totalPages }, (_, index) => index + 1)
                  .filter((pageNumber) => {
                    return (
                      pageNumber > 1 &&
                      pageNumber < totalPages &&
                      ((currentPage <= 4 && pageNumber <= 5) ||
                        (currentPage >= totalPages - 3 &&
                          pageNumber > totalPages - 5) ||
                        (pageNumber >= currentPage - 2 &&
                          pageNumber <= currentPage + 2))
                    );
                  })
                  .slice(0, 4)
                  .map((pageNumber) => (
                    <li
                      key={pageNumber}
                      className={`page-item ${
                        currentPage === pageNumber ? "active" : ""
                      }`}
                    >
                      <button
                        className="page-link"
                        onClick={() => handlePageChange(pageNumber)}
                      >
                        {pageNumber}
                      </button>
                    </li>
                  ))}

                {currentPage < totalPages - 3 && (
                  <li className="page-item disabled">
                    <span className="page-link">...</span>
                  </li>
                )}

                {totalPages > 1 && currentPage !== totalPages && (
                  <li
                    className={`page-item ${
                      currentPage === totalPages ? "active" : ""
                    }`}
                  >
                    <button
                      className="page-link"
                      onClick={() => handlePageChange(totalPages)}
                    >
                      {totalPages}
                    </button>
                  </li>
                )}
              </ul>
            </nav>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
