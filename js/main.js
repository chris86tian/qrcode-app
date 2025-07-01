document.addEventListener('DOMContentLoaded', () => {
    const contentTypeButtonsContainer = document.getElementById('content-type-buttons');
    const contentTypeHiddenInput = document.getElementById('content_type');
    const inputFieldsDiv = document.getElementById('input_fields');
    const qrForm = document.getElementById('qrForm');
    const qrCodeResultDiv = document.getElementById('qr-code-result');
    const darkColorInput = document.getElementById('darkColor');
    const lightColorInput = document.getElementById('lightColor');
    const logoInput = document.getElementById('logo');
    const transparencySlider = document.getElementById('transparencySlider');
    const transparencyValue = document.getElementById('transparency-value');
    const transparentHiddenInput = document.getElementById('transparent');
    const whiteQrOptionsDiv = document.getElementById('white-qr-options');

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
        `,
        spotify: `
            <div class="form-group">
                <label for="spotify_url">Spotify URL:</label>
                <input type="url" name="spotify_url" id="spotify_url" placeholder="https://open.spotify.com/track/..." required>
                <small>Link zu Song, Album, Playlist oder Künstler.</small>
            </div>
        `,
        youtube: `
            <div class="form-group">
                <label for="youtube_url">YouTube URL:</label>
                <input type="url" name="youtube_url" id="youtube_url" placeholder="https://www.youtube.com/watch?v=..." required>
                 <small>Link zu Video, Kanal oder Playlist.</small>
            </div>
        `,
        bewertung: `
            <div class="form-group">
                <label for="review_url">Bewertungs-URL:</label>
                <input type="url" name="review_url" id="review_url" placeholder="https://g.page/r/..." required>
                <small>Link zu Ihrer Bewertungsseite (z.B. Google, Yelp).</small>
            </div>
        ` // New Template
    };

    function updateFormFields() {
        const selectedType = contentTypeHiddenInput.value;
        inputFieldsDiv.innerHTML = fieldTemplates[selectedType] || '<p style="text-align: center; color: #6c757d; margin-top: 15px;">Bitte wähle einen Inhaltstyp aus.</p>';
    }

    // Funktion um zu prüfen, ob eine Farbe "weiß" oder sehr hell ist
    function isWhiteOrLightColor(hexColor) {
        // Konvertiere Hex zu RGB
        const r = parseInt(hexColor.slice(1, 3), 16);
        const g = parseInt(hexColor.slice(3, 5), 16);
        const b = parseInt(hexColor.slice(5, 7), 16);
        
        // Berechne Helligkeit (0-255)
        const brightness = (r * 299 + g * 587 + b * 114) / 1000;
        
        // Wenn Helligkeit > 200, gilt als "hell/weiß"
        return brightness > 200;
    }

    // Handle transparency slider changes and white QR detection
    function updateTransparencyControls() {
        const transparencyPercent = parseInt(transparencySlider.value);
        const isTransparent = transparencyPercent > 0;
        const isDarkColorWhite = isWhiteOrLightColor(darkColorInput.value);
        
        // Update transparency value display
        transparencyValue.textContent = transparencyPercent + '%';
        
        // Update hidden input for form submission
        transparentHiddenInput.value = isTransparent ? 'true' : 'false';
        
        // Update color input state based on transparency
        if (isTransparent) {
            // Disable background color when transparent
            lightColorInput.disabled = true;
            lightColorInput.style.opacity = '0.5';
            lightColorInput.style.cursor = 'not-allowed';
            
            // Show white QR options if dark color is white/light
            if (isDarkColorWhite) {
                whiteQrOptionsDiv.style.display = 'block';
            } else {
                whiteQrOptionsDiv.style.display = 'none';
            }
        } else {
            // Enable background color when not transparent
            lightColorInput.disabled = false;
            lightColorInput.style.opacity = '1';
            lightColorInput.style.cursor = 'pointer';
            whiteQrOptionsDiv.style.display = 'none';
        }
        
        // Update slider appearance
        const percentage = transparencyPercent;
        transparencySlider.style.background = `linear-gradient(to right, #4facfe 0%, #4facfe ${percentage}%, #ddd ${percentage}%, #ddd 100%)`;
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

    // Add event listeners for transparency slider and color changes
    transparencySlider.addEventListener('input', updateTransparencyControls);
    darkColorInput.addEventListener('change', updateTransparencyControls);

    updateFormFields(); // Initial call
    updateTransparencyControls(); // Initial call to set correct state

    qrForm.addEventListener('submit', async (event) => {
        event.preventDefault();
        qrCodeResultDiv.innerHTML = '<p>Generiere QR-Code...</p>';

        if (!contentTypeHiddenInput.value) {
             qrCodeResultDiv.innerHTML = '<p style="color: red;">Bitte wähle zuerst einen Inhaltstyp aus.</p>';
             return;
        }

        const formData = new FormData(qrForm);

        // Check if logo file input is empty and remove it from formData if so
        // This prevents sending an empty file part, which might confuse the backend
        if (logoInput.files.length === 0 || !logoInput.files[0].name) {
            formData.delete('logo');
        }

        try {
            const response = await fetch('/generate', {
                method: 'POST',
                body: formData
                // Headers are not explicitly set for FormData; browser handles it
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
                const hasUserLogo = logoInput.files.length > 0 && logoInput.files[0].name;
                const transparencyPercent = parseInt(transparencySlider.value);
                const isTransparent = transparencyPercent > 0;
                const isDarkColorWhite = isWhiteOrLightColor(darkColorInput.value);
                
                // Get selected white QR mode if applicable
                let whiteQrMode = null;
                if (isTransparent && isDarkColorWhite) {
                    const selectedMode = document.querySelector('input[name="whiteQrMode"]:checked');
                    whiteQrMode = selectedMode ? selectedMode.value : 'invert-colors';
                }
                
                // Build alt text
                const logoAltText = hasUserLogo ? "mit benutzerdefiniertem Logo" : "";
                const transparentAltText = isTransparent ? `mit ${transparencyPercent}% Transparenz` : "";
                const whiteQrAltText = whiteQrMode ? `(${whiteQrMode} Modus)` : "";
                
                const altText = `Generierter QR-Code für ${contentTypeHiddenInput.value} ${logoAltText} ${transparentAltText} ${whiteQrAltText}`.trim();
                
                // Add special classes for different QR code types
                let qrClasses = [];
                if (isTransparent) {
                    if (isDarkColorWhite && whiteQrMode) {
                        switch (whiteQrMode) {
                            case 'dark-background':
                                qrClasses.push('white-qr-dark-bg');
                                break;
                            case 'outlined':
                                qrClasses.push('white-qr-outline');
                                break;
                            case 'with-border':
                                qrClasses.push('white-qr-shadow');
                                break;
                            case 'force-transparent':
                                qrClasses.push('transparent-qr');
                                break;
                            default:
                                qrClasses.push('transparent-qr');
                        }
                    } else {
                        qrClasses.push('transparent-qr');
                    }
                }
                
                const classString = qrClasses.join(' ');
                
                // Determine background style
                let backgroundStyle = '';
                if (!isTransparent) {
                    backgroundStyle = `background-color: ${lightColorInput.value};`;
                }
                
                // Build filename
                const transparencyText = isTransparent ? `-transparent-${transparencyPercent}` : '';
                const whiteQrText = whiteQrMode ? `-${whiteQrMode}` : '';
                const filename = `qr-code-${contentTypeHiddenInput.value}${transparencyText}${whiteQrText}.png`;
                
                qrCodeResultDiv.innerHTML = `
                    <h2>Dein QR-Code:</h2>
                    <img src="${result.qrCodeUrl}" alt="${altText}" class="${classString}" style="${backgroundStyle}">
                    <br>
                    <a href="${result.qrCodeUrl}" download="${filename}" class="download-button">
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
