// assets/js/contact.js
document.addEventListener("DOMContentLoaded", () => {
  // === Helpers ===
  const $ = (sel) => document.querySelector(sel);

  const alerts = $("#form-alerts");
  const status = $("#contact-status");
  const form = $("#contact-form");
  const sendBtn = $("#send-btn");
  const spinner = sendBtn?.querySelector(".spinner-border");
  const btnText = sendBtn?.querySelector(".btn-text");

  // Show a Bootstrap alert (type: 'success' | 'danger' | 'warning' | 'info')
  function showAlert(type, message) {
    if (!alerts) return;
    alerts.innerHTML = `
      <div class="alert alert-${type} alert-dismissible fade show" role="alert">
        ${message}
        <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
      </div>`;
    // Move focus to alert for accessibility
    alerts.querySelector(".alert")?.focus?.();
  }

  // Toggle button loading state
  function setButtonLoading(isLoading) {
    if (!sendBtn || !spinner || !btnText) return;
    sendBtn.disabled = isLoading;
    spinner.classList.toggle("d-none", !isLoading);
    btnText.style.opacity = isLoading ? 0.7 : 1;
  }

  // Update small status text (non-blocking)
  function setStatusText(text) {
    if (!status) return;
    status.textContent = text || "";
  }

  // === EmailJS SDK check/init ===
  if (!window.emailjs) {
    console.error("EmailJS SDK not loaded. Check the CDN <script> in <head>.");
    showAlert("danger", "Mesaj servisi yüklenemedi. Lütfen sayfayı yenileyin.");
    return;
  }

  // Initialize with your Public Key
  emailjs.init({ publicKey: "p1sOB_wohSe5JrFGs" });

  if (!form) return;

  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    e.stopPropagation();

    // Bootstrap validation
    form.classList.add("was-validated");
    if (!form.checkValidity()) {
      showAlert("warning", "Lütfen tüm alanları doğru doldurun.");
      return;
    }

    // Collect params (MUST match EmailJS template variables)
    const params = {
      user_name: form.user_name.value.trim(),
      user_email: form.user_email.value.trim(),
      subject: form.subject.value.trim(),
      message: form.message.value.trim(),
      // If your template uses a dynamic recipient:
      to_email: "dagliomerserif@gmail.com",
      // So replies go to the sender:
      reply_to: form.user_email.value.trim()
    };

    // IDs from your EmailJS dashboard
    const SERVICE_ID = "service_bfe2aas";
    const TEMPLATE_ID = "template_go3d94i";

    // UI: show "sending"
    setButtonLoading(true);
    setStatusText("Sending...");
    showAlert("info", "Mesajınız gönderiliyor…");

    try {
      const res = await emailjs.send(SERVICE_ID, TEMPLATE_ID, params);
      // Success UX
      setStatusText("Message sent successfully. Thank you!");
      showAlert("success", "Mesajınız başarıyla gönderildi. Teşekkürler!");
      form.reset();
      form.classList.remove("was-validated");
      // Optional: focus to the first field after success
      form.querySelector("input, textarea")?.focus?.();
      console.log("EmailJS send OK:", res);
    } catch (err) {
      console.error("EmailJS error:", err);
      // Smarter error mapping
      const msg = (err?.text || err?.message || "").toLowerCase();

      if (msg.includes("origin") || msg.includes("domain")) {
        showAlert("danger", "Gönderen domain izinli değil. EmailJS → Account → Domains kısmına bu domaini ekleyin.");
      } else if (msg.includes("service") && msg.includes("not found")) {
        showAlert("danger", "Service ID hatalı. EmailJS panelindeki Service ID ile eşitleyin.");
      } else if (msg.includes("template") && msg.includes("not found")) {
        showAlert("danger", "Template ID hatalı. EmailJS panelindeki Template ID ile eşitleyin.");
      } else if (msg.includes("public key") || msg.includes("user id")) {
        showAlert("danger", "Public Key hatalı veya init edilmedi. emailjs.init(...) kısmını kontrol edin.");
      } else if (msg.includes("required") && msg.includes("params")) {
        showAlert("danger", "Şablon değişken isimleri uyuşmuyor. Template alan adlarını ve JS params'ı eşitleyin.");
      } else if (msg.includes("failed to fetch") || msg.includes("network")) {
        showAlert("danger", "Ağ/CORS hatası. HTTPS, ad-block ve domain izinlerini kontrol edin.");
      } else {
        showAlert("danger", "Mesaj gönderilemedi. Lütfen daha sonra tekrar deneyin.");
      }

      setStatusText("Failed to send.");
    } finally {
      setButtonLoading(false);
    }
  });
});
