// assets/js/contact.js
document.addEventListener("DOMContentLoaded", () => {
  // 1) EmailJS init (SDK yüklü olmalı)
  if (!window.emailjs) {
    console.error("EmailJS SDK yüklenemedi. CDN script etiketini kontrol edin.");
    return;
  }
  // Public key'ini aynen bırakıyorum, seninkiyse çalışır:
  emailjs.init({ publicKey: "p1sOB_wohSe5JrFGs" });

  const form = document.getElementById("contact-form");
  const status = document.getElementById("contact-status");
  const sendBtn = document.getElementById("send-btn");
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

    // UX: butonu kilitle & durum yaz
    sendBtn.disabled = true;
    status.textContent = "Sending...";

    try {
      // Kendi SERVICE_ID ve TEMPLATE_ID'ni kullan:
      // EmailJS panelinde bu template'in değişken adları params ile aynı olmalı.
      const SERVICE_ID = "service_bfe2aas";
      const TEMPLATE_ID = "template_go3d94i";

      await emailjs.send(SERVICE_ID, TEMPLATE_ID, params);

      status.textContent = "Message sent successfully. Thank you!";
      form.reset();
      form.classList.remove("was-validated");
    } catch (err) {
      console.error("EmailJS error:", err);
      status.textContent = "Failed to send. Please try again later.";
    } finally {
      sendBtn.disabled = false;
    }
  });
});
