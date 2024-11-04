export const login = async (email, password) => {
  const response = await fetch(
    `http://localhost:8080/CarRentalService/rest/cars/login?email=${encodeURIComponent(
      email
    )}&password=${encodeURIComponent(password)}`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    }
  );

  if (!response.ok) {
    const errorText = await response.json();
    throw new Error(errorText.message || "Login failed");
  }

  const data = await response.json();
  const role = data.role;

  return { message: data.message, role };
};

export const signup = async (
  lastName,
  firstName,
  phoneNumber,
  email,
  password
) => {
  const response = await fetch(
    `http://localhost:8080/CarRentalService/rest/cars/signUp`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        lastName,
        firstName,
        phoneNumber,
        email,
        password,
      }),
    }
  );
  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(errorText || "Signup failed");
  }
};
