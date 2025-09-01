// assets/js/contact.js
(() => {
  let initialized = false;

  function showAlert(type, message) {
    let alerts = document.querySelector("#form-alerts");
    if (!alerts) {
      const form = document.querySelector("#contact-form");
      if (form) {
        alerts = document.createElement("div");
        alerts.id = "form-alerts";
        alerts.className = "mb-3";
        alerts.setAttribute("aria-live", "polite");
        alerts.setAttribute("aria-atomic", "true");
        form.parentElement.insertBefore(alerts, form);
      }
    }
    if (!alerts) return;
    alerts.innerHTML = `
      <div class="alert alert-${type} alert-dismissible fade show" role="alert" tabindex="-1">
        ${message}
        <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
      </div>`;
    alerts.querySelector(".alert")?.focus?.();
  }

  function setButtonLoading(isLoading) {
    const sendBtn = document.querySelector("#send-btn");
    const spinner = sendBtn?.querySelector(".spinner-border");
    const btnText = sendBtn?.querySelector(".btn-text");
    if (!sendBtn || !spinner || !btnText) return;
    sendBtn.disabled = isLoading;
    spinner.classList.toggle("d-none", !isLoading);
    btnText.style.opacity = isLoading ? 0.6 : 1;
  }

  function bindIfReady() {
    if (initialized) return false;

    const form = document.querySelector("#contact-form");
    const status = document.querySelector("#contact-status");
    const sendBtn = document.querySelector("#send-btn");
    if (!form || !sendBtn) return false;

    // EmailJS v4 SDK
    if (!window.emailjs) {
      console.error("EmailJS SDK bulunamadı.");
      showAlert("danger", "Mesaj servisi yüklenemedi. Sayfayı yenileyin.");
      return true;
    }
    try {
      emailjs.init({ publicKey: "p1sOB_wohSe5JrFGs" }); // kendi public key'in
    } catch (e) {
      console.error("EmailJS init hatası:", e);
      showAlert("danger", "Mesaj servisi başlatılamadı.");
      return true;
    }

    initialized = true;

    form.addEventListener("submit", async (e) => {
      e.preventDefault();
      e.stopPropagation();

      form.classList.add("was-validated");
      if (!form.checkValidity()) {
        showAlert("warning", "Lütfen tüm alanları doldurun.");
        return;
      }

      // !!! ŞABLONLA BİREBİR AYNI İSİMLER !!!
      // Template değişkenlerin: {{name}}, {{email}}, {{title}}, {{message}}, {{time}}
      const userEmail = form.user_email.value.trim();
      const params = {
        name:    form.user_name.value.trim(), // -> {{name}}
        email:   userEmail,                   // -> {{email}}
        title:   form.subject.value.trim(),   // -> {{title}} (Subject'te kullanılıyor)
        message: form.message.value.trim(),   // -> {{message}}
        time:    new Date().toLocaleString(), // -> {{time}}
        // Bazı kurulumlarda Reply-To için ayrıca lazım olabiliyor:
        reply_to: userEmail
      };

      setButtonLoading(true);
      status && (status.textContent = "Sending...");
      showAlert("info", "Mesajınız gönderiliyor…");

      try {
        await emailjs.send("service_bfe2aas", "template_go3d94i", params);
        showAlert("success", "Mesajınız başarıyla gönderildi. Teşekkürler!");
        status && (status.textContent = "Message sent successfully.");
        form.reset();
        form.classList.remove("was-validated");
      } catch (err) {
        console.error("EmailJS error:", err);
        const msg = (err?.text || err?.message || "").toLowerCase();
        if (msg.includes("origin") || msg.includes("domain")) {
          showAlert("danger", "Domain izni yok. EmailJS → Account → Domains kısmına bu domaini ekleyin.");
        } else if (msg.includes("service") && msg.includes("not found")) {
          showAlert("danger", "Service ID hatalı. EmailJS panelinden kontrol edin.");
        } else if (msg.includes("template") && msg.includes("not found")) {
          showAlert("danger", "Template ID hatalı. EmailJS panelinden kontrol edin.");
        } else if (msg.includes("public key") || msg.includes("user id")) {
          showAlert("danger", "Public Key hatalı veya init edilmedi.");
        } else if (msg.includes("required") && msg.includes("params")) {
          showAlert("danger", "Şablon değişken adları uyuşmuyor. Template alanları ile JS paramlarını eşitleyin.");
        } else if (msg.includes("failed to fetch") || msg.includes("network")) {
          showAlert("danger", "Ağ/CORS hatası. HTTPS/ad-block/Domain iznini kontrol edin.");
        } else {
          showAlert("danger", "Mesaj gönderilemedi. Lütfen daha sonra tekrar deneyin.");
        }
        status && (status.textContent = "Failed to send.");
      } finally {
        setButtonLoading(false);
      }
    });

    return true;
  }

  // Sayfa yüklenince bağlan, yoksa DOM değişimini izle
  if (!bindIfReady()) {
    const obs = new MutationObserver(() => {
      if (bindIfReady()) obs.disconnect();
    });
    obs.observe(document.documentElement, { childList: true, subtree: true });
  }
})();
