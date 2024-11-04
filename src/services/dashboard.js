export const fetchCarDetails = async (email) => {
  try {
    const response = await fetch(
      `http://localhost:8080/CarRentalService/rest/cars/getDetails?email=${email}`
    );
    if (!response.ok) {
      throw new Error("Failed to fetch car details");
    }
    return await response.json();
  } catch (error) {
    console.error("Error fetching car details:", error);
    return [];
  }
};

export const fetchCarById = async (carId) => {
  try {
    const response = await fetch(
      `http://localhost:8080/CarRentalService/rest/cars/getCarById?carId=${carId}`
    );
    if (!response.ok) {
      throw new Error("Failed to fetch car details");
    }
    return await response.json();
  } catch (error) {
    console.error("Error fetching car details:", error);
    throw error;
  }
};
export const updateCar = async (carData) => {
    try {
      const response = await fetch(
        `http://localhost:8080/CarRentalService/rest/cars/updateCar`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(carData),
        }
      );
  
      if (!response.ok) {
        const errorMessage = await response.text(); 
        throw new Error(errorMessage);
      }
  
      return await response.text(); 
    } catch (error) {
      console.error("Error updating car:", error);
      throw error;
    }
  };
  
export const deleteCarById = async (carId) => {
  try {
    const response = await fetch(
      `http://localhost:8080/CarRentalService/rest/cars/deleteCar?carId=${carId}`,
      {
        method: "DELETE",
      }
    );

    if (!response.ok) {
      throw new Error("Failed to delete car");
    }
    return true;
  } catch (error) {
    console.error("Error deleting car:", error);
    throw error;
  }
};
export const addCar = async (carData) => {
    try {
      const response = await fetch(`http://localhost:8080/CarRentalService/rest/cars/addCar`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(carData),
      });
  
      if (!response.ok) {
        throw new Error("Failed to add car");
      }
      return true;
    } catch (error) {
      console.error("Error adding car:", error);
      throw error; 
    }
  };
  export const returnCarById = async (email, carId) => {
    try {
      const response = await fetch(`http://localhost:8080/CarRentalService/rest/cars/returnCar?email=${encodeURIComponent(email)}&carId=${carId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        }
      });
  
      if (!response.ok) {
        throw new Error(await response.text()); 
      }
  
      return await response.text(); 
    } catch (error) {
      console.error("Error returning car:", error);
      throw error; 
    }
  };
  
  