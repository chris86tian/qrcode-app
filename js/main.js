document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('qrForm');
    const inputFieldsDiv = document.getElementById('input_fields');
    const qrCodeResultDiv = document.getElementById('qr-code-result');
    const contentTypeButtons = document.querySelectorAll('.content-type-btn');
    const contentTypeInput = document.getElementById('content_type');
    const logoInput = document.getElementById('logo');
    const darkColorInput = document.getElementById('darkColor');
    const lightColorInput = document.getElementById('lightColor');

    // --- Content Type Selection ---
    contentTypeButtons.forEach(button => {
        button.addEventListener('click', function() {
            // Set hidden input value
            const selectedType = this.dataset.value;
            contentTypeInput.value = selectedType;

            // Update button styles
            contentTypeButtons.forEach(btn => btn.classList.remove('active'));
            this.classList.add('active');

            // Generate input fields for the selected type
            generateInputFields(selectedType);

            // Clear previous result
            qrCodeResultDiv.innerHTML = '';
        });
    });

    // --- Generate Input Fields Dynamically ---
    function generateInputFields(type) {
        inputFieldsDiv.innerHTML = ''; // Clear previous fields
        let fieldsHtml = '';

        switch (type) {
            case 'url':
                fieldsHtml = `
                    <div class="form-group">
                        <label for="url">Webseiten-URL:</label>
                        <input type="url" name="url" id="url" placeholder="https://beispiel.de" required>
                    </div>`;
                break;
            case 'contact':
                fieldsHtml = `
                    <h4>Kontaktdaten (vCard)</h4>
                    <div class="form-row">
                        <div class="form-group">
                            <label for="firstName">Vorname:</label>
                            <input type="text" name="firstName" id="firstName">
                        </div>
                        <div class="form-group">
                            <label for="lastName">Nachname:*</label>
                            <input type="text" name="lastName" id="lastName" required>
                        </div>
                    </div>
                    <div class="form-row">
                        <div class="form-group">
                            <label for="organization">Firma:</label>
                            <input type="text" name="organization" id="organization">
                        </div>
                        <div class="form-group">
                            <label for="position">Position:</label>
                            <input type="text" name="position" id="position">
                        </div>
                    </div>
                     <div class="form-row">
                        <div class="form-group">
                            <label for="phoneWork">Telefon (Geschäftlich):</label>
                            <input type="tel" name="phoneWork" id="phoneWork" placeholder="+49 30 123456">
                        </div>
                        <div class="form-group">
                            <label for="phoneMobile">Telefon (Mobil):</label>
                            <input type="tel" name="phoneMobile" id="phoneMobile" placeholder="+49 170 1234567">
                        </div>
                    </div>
                    <div class="form-group">
                        <label for="email">E-Mail:</label>
                        <input type="email" name="email" id="email" placeholder="max.mustermann@firma.de">
                    </div>
                    <div class="form-group">
                        <label for="website">Webseite:</label>
                        <input type="url" name="website" id="website" placeholder="https://firma.de">
                    </div>
                    <h4>Adresse</h4>
                     <div class="form-group">
                        <label for="street">Straße & Hausnr.:</label>
                        <input type="text" name="street" id="street">
                    </div>
                    <div class="form-row">
                        <div class="form-group">
                            <label for="zip">PLZ:</label>
                            <input type="text" name="zip" id="zip">
                        </div>
                        <div class="form-group">
                            <label for="city">Stadt:</label>
                            <input type="text" name="city" id="city">
                        </div>
                    </div>
                    <div class="form-group">
                        <label for="country">Land:</label>
                        <input type="text" name="country" id="country">
                    </div>
                    <small>* Pflichtfeld</small>
                    `;
                break;
            case 'wifi':
                fieldsHtml = `
                    <h4>WLAN-Zugangsdaten</h4>
                    <div class="form-group">
                        <label for="wifi_ssid">Netzwerkname (SSID):*</label>
                        <input type="text" name="wifi_ssid" id="wifi_ssid" required>
                    </div>
                    <div class="form-group">
                        <label for="wifi_password">Passwort:</label>
                        <input type="password" name="wifi_password" id="wifi_password">
                    </div>
                    <div class="form-group">
                        <label for="wifi_encryption">Verschlüsselung:</label>
                        <select name="wifi_encryption" id="wifi_encryption">
                            <option value="WPA" selected>WPA/WPA2</option>
                            <option value="WEP">WEP</option>
                            <option value="nopass">Keine Verschlüsselung</option>
                        </select>
                    </div>
                     <div class="form-group">
                         <label>
                            <input type="checkbox" name="wifi_hidden" id="wifi_hidden" value="true">
                            Netzwerk ist versteckt (Hidden SSID)
                         </label>
                    </div>
                     <small>* Pflichtfeld</small>
                    `;
                break;
            case 'text':
                fieldsHtml = `
                    <div class="form-group">
                        <label for="text">Textinhalt:</label>
                        <textarea name="text" id="text" rows="4" placeholder="Geben Sie hier Ihren Text ein..."></textarea>
                    </div>`;
                break;
            case 'email':
                 fieldsHtml = `
                    <h4>E-Mail erstellen</h4>
                    <div class="form-group">
                        <label for="email_address">Empfänger E-Mail:*</label>
                        <input type="email" name="email_address" id="email_address" required placeholder="empfaenger@beispiel.de">
                    </div>
                    <div class="form-group">
                        <label for="email_subject">Betreff:</label>
                        <input type="text" name="email_subject" id="email_subject">
                    </div>
                    <div class="form-group">
                        <label for="email_body">Nachricht:</label>
                        <textarea name="email_body" id="email_body" rows="3"></textarea>
                    </div>
                     <small>* Pflichtfeld</small>
                    `;
                break;
             case 'sms':
                 fieldsHtml = `
                    <h4>SMS erstellen</h4>
                    <div class="form-group">
                        <label for="sms_number">Telefonnummer:*</label>
                        <input type="tel" name="sms_number" id="sms_number" required placeholder="+491701234567">
                    </div>
                    <div class="form-group">
                        <label for="sms_body">Nachricht:</label>
                        <textarea name="sms_body" id="sms_body" rows="3"></textarea>
                    </div>
                     <small>* Pflichtfeld</small>
                    `;
                break;
            case 'whatsapp':
                 fieldsHtml = `
                    <h4>WhatsApp Nachricht</h4>
                    <div class="form-group">
                        <label for="whatsapp_number">WhatsApp Nummer (mit Ländercode):*</label>
                        <input type="tel" name="whatsapp_number" id="whatsapp_number" required placeholder="491701234567 (ohne + oder 00)">
                    </div>
                    <div class="form-group">
                        <label for="whatsapp_message">Vorgefertigte Nachricht (optional):</label>
                        <textarea name="whatsapp_message" id="whatsapp_message" rows="3"></textarea>
                    </div>
                     <small>* Pflichtfeld</small>
                    `;
                break;
             case 'spotify':
                fieldsHtml = `
                    <div class="form-group">
                        <label for="spotify_url">Spotify URL (Song, Album, Playlist, Artist):*</label>
                        <input type="url" name="spotify_url" id="spotify_url" placeholder="https://open.spotify.com/..." required>
                        <small>Teilen-Link aus der Spotify App oder Webseite kopieren.</small>
                    </div>
                     <small>* Pflichtfeld</small>
                    `;
                break;
            case 'youtube':
                fieldsHtml = `
                    <div class="form-group">
                        <label for="youtube_url">YouTube URL (Video, Kanal, Playlist):*</label>
                        <input type="url" name="youtube_url" id="youtube_url" placeholder="https://www.youtube.com/watch?v=..." required>
                         <small>Link aus der Adresszeile oder über "Teilen" kopieren.</small>
                    </div>
                     <small>* Pflichtfeld</small>
                    `;
                break;
            // --- NEU: Bewertungen ---
            case 'review':
                fieldsHtml = `
                    <h4>Bewertungslink</h4>
                    <div class="form-group">
                        <label for="review_url">URL zur Bewertungsseite:*</label>
                        <input type="url" name="review_url" id="review_url" placeholder="https://search.google.com/local/writereview?placeid=..." required>
                        <small>z.B. der "Bewertung schreiben"-Link von Ihrem Google Unternehmensprofil.</small>
                    </div>
                     <small>* Pflichtfeld</small>
                    `;
                break;
            default:
                fieldsHtml = '<p style="text-align: center; color: #6c757d;">Bitte wähle einen Inhaltstyp aus.</p>';
        }
        inputFieldsDiv.innerHTML = fieldsHtml;
    }

    // --- Form Submission ---
    form.addEventListener('submit', async function(event) {
        event.preventDefault(); // Prevent default form submission
        qrCodeResultDiv.innerHTML = '<p>Generiere QR-Code...</p>'; // Show loading message

        // Create FormData object from the form
        const formData = new FormData(form);

        // Log FormData content for debugging
        // console.log("FormData entries:");
        // for (let [key, value] of formData.entries()) {
        //     console.log(`${key}:`, value);
        // }

        try {
            const response = await fetch('/generate', {
                method: 'POST',
                body: formData // Send form data directly
                // No 'Content-Type' header needed for FormData, browser sets it with boundary
            });

            const result = await response.json();

            if (!response.ok) {
                // Throw an error with the message from the server's JSON response
                throw new Error(result.error || `HTTP error! status: ${response.status}`);
            }

            if (result.qrCodeUrl) {
                qrCodeResultDiv.innerHTML = `
                    <h3>Dein QR-Code:</h3>
                    <img src="${result.qrCodeUrl}" alt="Generierter QR-Code" style="max-width: 100%; height: auto;">
                    <div style="margin-top: 15px;">
                        <a href="${result.qrCodeUrl}" download="qr-code-${Date.now()}.png" class="btn-download">
                            Download PNG
                        </a>
                        <!-- Add SVG/PDF download later if needed -->
                    </div>`;
                 // Check if it was saved (indicated by button text change)
                 const generateButton = document.getElementById('generate-button');
                 if (generateButton.textContent.includes('speichern')) {
                     // Optionally show a success message or redirect
                     console.log("QR Code generated and likely saved.");
                     // Maybe add a small success message below the QR code
                     const successMsg = document.createElement('p');
                     successMsg.textContent = "QR-Code wurde in 'Meine Codes' gespeichert.";
                     successMsg.style.color = 'green';
                     successMsg.style.fontSize = '0.9em';
                     qrCodeResultDiv.appendChild(successMsg);
                 }

            } else {
                 qrCodeResultDiv.innerHTML = '<p style="color: red;">Fehler: QR-Code konnte nicht generiert werden (keine URL zurückgegeben).</p>';
            }

        } catch (error) {
            console.error('Error generating QR code:', error);
            // Display the specific error message from the server or fetch failure
            qrCodeResultDiv.innerHTML = `<p style="color: red;">Fehler: ${error.message}</p>`;
        }
    });

     // --- Initial Field Generation ---
     // Select 'url' by default or based on URL parameter if needed
     const initialType = 'url'; // Default to URL
     const urlButton = document.querySelector(`.content-type-btn[data-value="${initialType}"]`);
     if (urlButton) {
         urlButton.click(); // Simulate click to activate and generate fields
     } else {
         generateInputFields(''); // Show default message if 'url' button not found
     }

});
