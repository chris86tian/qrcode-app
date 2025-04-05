document.addEventListener('DOMContentLoaded', () => {
    const contentTypeButtonsContainer = document.getElementById('content-type-buttons');
    const contentTypeHiddenInput = document.getElementById('content_type');
    const inputFieldsDiv = document.getElementById('input_fields');
    const qrForm = document.getElementById('qrForm');
    const qrCodeResultDiv = document.getElementById('qr-code-result');
    // Color inputs (added)
    const darkColorInput = document.getElementById('darkColor');
    const lightColorInput = document.getElementById('lightColor');

    const fieldTemplates = {
        url: `
            <div class="form-group">
                <label for="url">URL:</label>
                <input type="url" name="url" id="url" placeholder="https://beispiel.com" required>
            </div>
        `,
        contact: `
            <div class="form-group">
                <label for="firstName">Vorname:</label>
                <input type="text" name="firstName" id="firstName">
            </div>
            <div class="form-group">
                <label for="lastName">Nachname:</label>
                <input type="text" name="lastName" id="lastName" required>
            </div>
            <div class="form-group">
                <label for="organization">Organisation:</label>
                <input type="text" name="organization" id="organization">
            </div>
             <div class="form-group">
                <label for="position">Position:</label>
                <input type="text" name="position" id="position">
            </div>
            <div class="form-group">
                <label for="phoneWork">Telefon (Arbeit):</label>
                <input type="tel" name="phoneWork" id="phoneWork">
            </div>
            <div class="form-group">
                <label for="phoneMobile">Telefon (Mobil):</label>
                <input type="tel" name="phoneMobile" id="phoneMobile">
            </div>
            <div class="form-group">
                <label for="email">E-Mail:</label>
                <input type="email" name="email" id="email">
            </div>
             <div class="form-group">
                <label for="website">Webseite:</label>
                <input type="url" name="website" id="website" placeholder="https://beispiel.com">
            </div>
            <div class="form-group">
                <label for="street">Straße & Hausnr.:</label>
                <input type="text" name="street" id="street">
            </div>
            <div class="form-group">
                <label for="zip">PLZ:</label>
                <input type="text" name="zip" id="zip">
            </div>
            <div class="form-group">
                <label for="city">Stadt:</label>
                <input type="text" name="city" id="city">
            </div>
            <div class="form-group">
                <label for="country">Land:</label>
                <input type="text" name="country" id="country">
            </div>
        `,
        wifi: `
            <div class="form-group">
                <label for="wifi_ssid">Netzwerkname (SSID):</label>
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
                    Netzwerk ist versteckt
                </label>
            </div>
        `,
        text: `
            <div class="form-group">
                <label for="text">Text:</label>
                <textarea name="text" id="text" rows="4" required></textarea>
            </div>
        `,
        // --- New Templates ---
        email: `
            <div class="form-group">
                <label for="email_address">Empfänger E-Mail:</label>
                <input type="email" name="email_address" id="email_address" required>
            </div>
            <div class="form-group">
                <label for="email_subject">Betreff:</label>
                <input type="text" name="email_subject" id="email_subject">
            </div>
            <div class="form-group">
                <label for="email_body">Nachricht:</label>
                <textarea name="email_body" id="email_body" rows="3"></textarea>
            </div>
        `,
        sms: `
            <div class="form-group">
                <label for="sms_number">Telefonnummer:</label>
                <input type="tel" name="sms_number" id="sms_number" placeholder="+49123456789" required>
            </div>
            <div class="form-group">
                <label for="sms_body">Nachricht:</label>
                <textarea name="sms_body" id="sms_body" rows="3"></textarea>
            </div>
        `,
        whatsapp: `
            <div class="form-group">
                <label for="whatsapp_number">WhatsApp Nummer:</label>
                <input type="tel" name="whatsapp_number" id="whatsapp_number" placeholder="49123456789" required>
                <small>Internationale Vorwahl ohne '+' oder '00'. Beispiel: 49 für Deutschland.</small>
            </div>
            <div class="form-group">
                <label for="whatsapp_message">Nachricht (optional):</label>
                <textarea name="whatsapp_message" id="whatsapp_message" rows="3"></textarea>
            </div>
        `
    };

    function updateFormFields() {
        const selectedType = contentTypeHiddenInput.value;
        inputFieldsDiv.innerHTML = fieldTemplates[selectedType] || '<p style="text-align: center; color: #6c757d; margin-top: 15px;">Bitte wähle einen Inhaltstyp aus.</p>';
    }

    contentTypeButtonsContainer.addEventListener('click', (event) => {
        if (event.target.classList.contains('content-type-btn')) {
            const selectedButton = event.target;
            const selectedValue = selectedButton.dataset.value;

            contentTypeHiddenInput.value = selectedValue;

            const allButtons = contentTypeButtonsContainer.querySelectorAll('.content-type-btn');
            allButtons.forEach(btn => btn.classList.remove('active'));
            selectedButton.classList.add('active');

            updateFormFields();
        }
    });

    updateFormFields(); // Initial call

    qrForm.addEventListener('submit', async (event) => {
        event.preventDefault();
        qrCodeResultDiv.innerHTML = '<p>Generiere QR-Code...</p>';

        if (!contentTypeHiddenInput.value) {
             qrCodeResultDiv.innerHTML = '<p style="color: red;">Bitte wähle zuerst einen Inhaltstyp aus.</p>';
             return;
        }

        const formData = new FormData(qrForm);

        // Append color values (already included by default form behavior if named)
        // formData.append('darkColor', darkColorInput.value);
        // formData.append('lightColor', lightColorInput.value);

        try {
            const response = await fetch('/generate', {
                method: 'POST',
                body: formData // FormData handles multipart/form-data automatically
            });

            if (!response.ok) {
                let errorMsg = 'Fehler beim Generieren des QR-Codes.';
                try {
                    const errorData = await response.json();
                    errorMsg = errorData.error || errorMsg;
                } catch (e) { /* Ignore if response is not JSON */ }
                throw new Error(`${response.status}: ${errorMsg}`);
            }

            const result = await response.json();

            if (result.qrCodeUrl) {
                qrCodeResultDiv.innerHTML = `
                    <h2>Dein QR-Code:</h2>
                    <img src="${result.qrCodeUrl}" alt="Generierter QR-Code" style="background-color: ${lightColorInput.value};"> <!-- Add background color to img preview -->
                    <br>
                    <a href="${result.qrCodeUrl}" download="qr-code.png" class="download-button">
                        Download PNG
                    </a>
                `;
            } else {
                 qrCodeResultDiv.innerHTML = '<p style="color: red;">Konnte keinen QR-Code empfangen.</p>';
            }

        } catch (error) {
            console.error('Form submission error:', error);
            qrCodeResultDiv.innerHTML = `<p style="color: red;">Fehler: ${error.message}</p>`;
        }
    });
});
