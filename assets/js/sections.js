// assets/js/sections.js
document.addEventListener("DOMContentLoaded", () => {
  // Load sections (hero first for typed.js stability)
  const sections = [
    { id: "hero-placeholder",   url: "feature/hero.html" },
    { id: "about-placeholder",  url: "feature/about.html" },
    { id: "resume-placeholder", url: "feature/resume.html" },
    { id: "contact-placeholder",url: "feature/contact.html" },
  ];

  sections.forEach(async ({ id, url }) => {
    const host = document.getElementById(id);
    if (!host) return;
    try {
      const res = await fetch(url, { cache: "no-store" });
      if (!res.ok) throw new Error(`${url} not found`);
      host.innerHTML = await res.text();
      if (window.AOS) AOS.refresh();
    } catch (err) {
      host.innerHTML = `<div class="container"><div class="alert alert-danger">Failed to load ${url}. ${err.message}</div></div>`;
      console.error(err);
    }
  });
});
