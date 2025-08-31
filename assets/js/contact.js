// assets/js/contact.js
(function () {
  // Replace with your EmailJS PUBLIC key, e.g. 'public_ABC123'
  emailjs.init('p1sOB_wohSe5JrFGs');
})();

document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("contact-form");
  const status = document.getElementById("contact-status");
  if (!form) return;

  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    e.stopPropagation();
    form.classList.add("was-validated");
    if (!form.checkValidity()) return;

    const params = {
      user_name: form.user_name.value.trim(),
      user_email: form.user_email.value.trim(),
      subject: form.subject.value.trim(),
      message: form.message.value.trim(),
    };

    status.textContent = "Sending...";
    try {
      // Replace with your SERVICE and TEMPLATE IDs
      await emailjs.send("service_bfe2aas", "template_go3d94i", params);
      status.textContent = "Message sent successfully. Thank you!";
      form.reset();
      form.classList.remove("was-validated");
    } catch (err) {
      console.error(err);
      status.textContent = "Failed to send. Please try again later.";
    }
  });
});
