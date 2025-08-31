document.addEventListener("DOMContentLoaded", function() {
    // Yüklenecek HTML bölümlerini ve hedeflerini belirle
    const sections = [
      { id: 'hero-placeholder', url: 'feature/hero.html' },
        { id: 'about-placeholder', url: 'feature/about.html' },
        { id: 'resume-placeholder', url: 'feature/resume.html' },
        { id: 'contact-placeholder', url: 'feature/contact.html' }
    ];

    // Her bir bölümü sırayla yükle
    sections.forEach(section => {
        fetch(section.url)
            .then(response => {
                // Eğer dosya bulunamazsa hata ver
                if (!response.ok) {
                    throw new Error(`Network response was not ok for ${section.url}`);
                }
                return response.text();
            })
            .then(data => {
                // Gelen HTML içeriğini ilgili placeholder'a yerleştir
                const placeholder = document.getElementById(section.id);
                if (placeholder) {
                    placeholder.innerHTML = data;
                }
            })
            .catch(error => {
                console.error('Error fetching the section:', error);
                const placeholder = document.getElementById(section.id);
                if (placeholder) {
                    placeholder.innerHTML = `<p>Error loading content from ${section.url}.</p>`;
                }
            });
    });
});