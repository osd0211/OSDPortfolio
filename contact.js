(function() {
    // Public Key
    emailjs.init("p1sOB_wohSe5JrFGs");

    document.getElementById("contact-form").addEventListener("submit", function(event) {
        event.preventDefault();

        emailjs.sendForm("service_bfe2aas", "service_bfe2aas", this)
            .then(function() {
                alert("Message sent successfully!");
            }, function(error) {
                console.log("FAILED...", error);
                alert("Failed to send message. Please try again.");
            });
    });
})();
