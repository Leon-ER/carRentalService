export const borrowCarService = async (selectedCar, userEmail, days) => {
  const soapEndpoint =
    "http://localhost:8080/CarRentalService/CarBookingSOAPService";
  const soapAction =
    '"http://soap.carRentREST/CarBookingSOAPService/bookCarRequest"';

  const xmlPayload = `
      <soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:car="http://soap.carRentREST/">
         <soapenv:Header/>
         <soapenv:Body>
            <car:bookCar>
               <carId>${selectedCar.carId}</carId>
               <customerEmail>${userEmail}</customerEmail>
               <timeBorrowed>${days}</timeBorrowed>
            </car:bookCar>
         </soapenv:Body>
      </soapenv:Envelope>
    `;

  try {
    const response = await fetch(soapEndpoint, {
      method: "POST",
      headers: {
        "Content-Type": "text/xml;charset=UTF-8",
        SOAPAction: soapAction,
      },
      body: xmlPayload,
    });

    if (!response.ok) {
      throw new Error(`Server responded with status: ${response.status}`);
    }

    const responseText = await response.text();
    console.log("SOAP response:", responseText);
    return responseText;
  } catch (err) {
    console.error("Error occurred during the fetch:", err);
    throw new Error("Failed to make booking request");
  }
};

export const fetchCars = async () =>{
  try {
    const response = await fetch("http://localhost:8080/CarRentalService/rest/cars/getAllCars");
    if (!response.ok) {
      throw new Error("Failed to fetch cars");
    }
    return await response.json();
  } catch (error) {
    console.error("Error fetching cars:", error);
  }
}
