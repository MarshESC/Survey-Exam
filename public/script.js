async function handleSubmit(event) {
  event.preventDefault(); // Prevents the default form submission
  const form = event.target; // The form that triggered the event

  // Collect form data
  const formData = {
    name: form.name.value,
    email: form.email.value,
    age: form.age.value,
    recommend: form.recommend.value,

    // Collect selected device checkboxes and join them into a string
    device: Array.from(
      form.querySelectorAll('input[name="device"]:checked')
    ).map((el) => el.value), // Collect checked values
  };

  // If no checkboxes are checked, device will be an empty array
  if (formData.device.length === 0) {
    console.log("No devices selected");
  } else {
    console.log("Selected devices:", formData.device);
  }

  formData.referrer = form.referrer.value;
  formData.bio = form.bio.value;

  try {
    const response = await fetch("/api/submit", {
      method: "POST", // Sending data as a POST request
      headers: { "Content-Type": "application/json" }, // Content-Type set to JSON
      body: JSON.stringify(formData), // Convert form data to JSON
    });

    const data = await response.json(); // Parse the response as JSON
    alert(data.message); // Display the response message (e.g., success or error)
  } catch (error) {
    alert("Error submitting form."); // Show an error if something went wrong
  }
}

// Attach the handleSubmit function to the form submit event
document.getElementById("survey-form").addEventListener("submit", handleSubmit);
