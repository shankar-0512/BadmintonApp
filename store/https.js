import axios from "axios";

/* export async function addToPool() {
  const requestBody = { key: "value" };
  const response = await axios.post(
    "http://127.0.0.1:8000/app/addToPool/",
    requestBody
  );
  return response; // Return the data from the response
} */

export async function addToPool() {
  try {
    const requestConfig = {
      method: "POST", // Set the request method to POST
      headers: {
        "Content-Type": "application/json", // Set the content type to JSON
      },
      body: JSON.stringify({}), // Add the request body as an empty JSON object
    };

    const response = await fetch(
      "http://10.126.197.37:8000/app/addToPool/",
      requestConfig
    );

    // Check if the response is successful (status code 2xx)
    if (response.ok) {
      const responseData = await response.json();

      // Handle the response data
      console.log("Response data:", responseData);
      return responseData;
    } else {
      // Handle the response error
      console.error("Error:", response.statusText);
    }
  } catch (error) {
    // Handle any errors that occurred during the API call
    console.error("Error:", error.message);
  }
}
