document
  .getElementById("contact-form")
  .addEventListener("submit", async (e) => {
    e.preventDefault();
    const token = grecaptcha.getResponse();

    if (!token) {
      return Swal.fire("Error", "Por favor, completa el reCAPTCHA", "error");
    }

    const contactData = {
      name: document.getElementById("name").value,
      email: document.getElementById("email").value,
      phone: document.getElementById("phone").value,
      message: document.getElementById("message").value,
      "g-recaptcha-response": token,
    };

    try {
      const res = await fetch("/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(contactData),
      });

      const result = await res.json();

      if (res.ok) {
        Swal.fire("Éxito", result.message, "success");
        e.target.reset();
        grecaptcha.reset();
      } else {
        Swal.fire(
          "Error",
          `${result.error} <br> ${result.message}` || "Ocurrió un error",
          "error"
        );
      }
    } catch (error) {
      console.error(error);
      Swal.fire("Error", "Error al enviar el formulario", "error");
    }
  });
