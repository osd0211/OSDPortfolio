// assets/js/contact.js
document.addEventListener("DOMContentLoaded", () => {
  // Ensure EmailJS SDK is loaded
  if (!window.emailjs) {
    console.error("EmailJS SDK not loaded. Check CDN <script> tag.");
    return;
  }

  // Initialize EmailJS with your Public Key
  emailjs.init({ publicKey: "p1sOB_wohSe5JrFGs" });

  const form = document.getElementById("contact-form");
  const status = document.getElementById("contact-status");
  const sendBtn = document.getElementById("send-btn");
  if (!form) return;

  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    e.stopPropagation();

    // Bootstrap client-side validation
    form.classList.add("was-validated");
    if (!form.checkValidity()) return;

    // Gather params (MUST match your EmailJS template variable names)
    const params = {
      user_name: form.user_name.value.trim(),
      user_email: form.user_email.value.trim(),
      subject: form.subject.value.trim(),
      message: form.message.value.trim(),

      // If your template expects a "to_email", include it.
      // Otherwise remove this line or align with your template fields.
      to_email: "dagliomerserif@gmail.com"
    };

    // Lock UI and show status
    sendBtn.disabled = true;
    status.textContent = "Sending...";

    try {
      const SERVICE_ID = "service_bfe2aas";
      const TEMPLATE_ID = "template_go3d94i";

      // Send via EmailJS
      await emailjs.send(SERVICE_ID, TEMPLATE_ID, params);

      // Success UX
      status.textContent = "Message sent successfully. Thank you!";
      form.reset();
      form.classList.remove("was-validated");
    } catch (err) {
      console.error("EmailJS error:", err);

      // Provide helpful hints to the user
      const msg = (err?.text || err?.message || "").toLowerCase();
      if (msg.includes("origin") || msg.includes("domain")) {
        status.textContent = "Your domain is not allowed in EmailJS. Add it under Account → Domains.";
      } else if (msg.includes("service") && msg.includes("not found")) {
        status.textContent = "Service ID is incorrect. Check your EmailJS Service ID.";
      } else if (msg.includes("template") && msg.includes("not found")) {
        status.textContent = "Template ID is incorrect. Check your EmailJS Template ID.";
      } else if (msg.includes("public key") || msg.includes("user id")) {
        status.textContent = "Public key is invalid or not initialized.";
      } else if (msg.includes("required") && msg.includes("params")) {
        status.textContent = "Template variables mismatch. Ensure names match your EmailJS template.";
      } else {
        status.textContent = "Failed to send. Please try again later.";
      }
    } finally {
      sendBtn.disabled = false;
    }
  });
});
