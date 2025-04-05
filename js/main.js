document.addEventListener('DOMContentLoaded', () => {
    // Removed contentTypeSelect
    const contentTypeButtonsContainer = document.getElementById('content-type-buttons');
    const contentTypeHiddenInput = document.getElementById('content_type'); // Hidden input
    const inputFieldsDiv = document.getElementById('input_fields');
    const qrForm = document.getElementById('qrForm');
    const qrCodeResultDiv = document.getElementById('qr-code-result');

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
        `
    };

    function updateFormFields() {
        // Get value from the hidden input
        const selectedType = contentTypeHiddenInput.value;
        inputFieldsDiv.innerHTML = fieldTemplates[selectedType] || '<p style="text-align: center; color: #6c757d; margin-top: 15px;">Bitte wähle einen Inhaltstyp aus.</p>';
    }

    // Add event listener to the button container (event delegation)
    contentTypeButtonsContainer.addEventListener('click', (event) => {
        if (event.target.classList.contains('content-type-btn')) {
            const selectedButton = event.target;
            const selectedValue = selectedButton.dataset.value;

            // Update hidden input value
            contentTypeHiddenInput.value = selectedValue;

            // Update button active states
            const allButtons = contentTypeButtonsContainer.querySelectorAll('.content-type-btn');
            allButtons.forEach(btn => btn.classList.remove('active'));
            selectedButton.classList.add('active');

            // Update the dynamic fields
            updateFormFields();
        }
    });

    // Initial state - no fields shown until a button is clicked
    updateFormFields();

    // Handle form submission (remains the same)
    qrForm.addEventListener('submit', async (event) => {
        event.preventDefault();
        qrCodeResultDiv.innerHTML = '<p>Generiere QR-Code...</p>';

        // Check if a content type is selected
        if (!contentTypeHiddenInput.value) {
             qrCodeResultDiv.innerHTML = '<p style="color: red;">Bitte wähle zuerst einen Inhaltstyp aus.</p>';
             return; // Stop submission if no type is selected
        }

        const formData = new FormData(qrForm);

        try {
            const response = await fetch('/generate', {
                method: 'POST',
                body: formData
            });

            if (!response.ok) {
                let errorMsg = 'Fehler beim Generieren des QR-Codes.';
                try {
                    const errorData = await response.json();
                    errorMsg = errorData.error || errorMsg;
                } catch (e) { /* Ignore */ }
                throw new Error(`${response.status}: ${errorMsg}`);
            }

            const result = await response.json();

            if (result.qrCodeUrl) {
                qrCodeResultDiv.innerHTML = `
                    <h2>Dein QR-Code:</h2>
                    <img src="${result.qrCodeUrl}" alt="Generierter QR-Code">
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
