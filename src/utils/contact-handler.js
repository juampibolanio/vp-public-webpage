/**
 * Initializes the contact form client-side behavior.
 *
 * Responsibilities:
 * - Attach a submit handler to the contact form.
 * - Serialize form data into JSON format.
 * - Send the data to the contact API endpoint.
 * - Provide user feedback based on request state and response.
 *
 * This function is designed to run in the browser and should be
 * executed after the DOM is available.
 */
export function initContactForm() {
  const form = document.querySelector("#contact-form");
  const statusDiv = document.querySelector("#form-status");

  form?.addEventListener("submit", async (e) => {
    e.preventDefault();

    // Update UI to indicate submission in progress
    statusDiv.textContent = "Enviando mensaje...";
    statusDiv.className = "form-status sending";
    statusDiv.style.display = "block";

    const formData = new FormData(e.target);
    const data = Object.fromEntries(formData);

    try {
      const response = await fetch("/api/send-email", {
        method: "POST",
        body: JSON.stringify(data),
        headers: {
          "Content-Type": "application/json",
        },
      });

      const result = await response.json();

      if (response.ok) {
        // Successful submission feedback
        statusDiv.textContent = result.message;
        statusDiv.className = "form-status success";
        form.reset();
      } else {
        // Validation or server-side error feedback
        statusDiv.textContent = result.message;
        statusDiv.className = "form-status error";
      }
    } catch (err) {
      // Network or unexpected client-side error
      statusDiv.textContent = "Error de conexión con el servidor.";
      statusDiv.className = "form-status error";
    }
  });
}
