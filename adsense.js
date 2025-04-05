document.addEventListener('DOMContentLoaded', function() {
    const contentType = document.getElementById('content_type');
    const inputFields = document.getElementById('input_fields');

    contentType.addEventListener('change', function() {
        inputFields.innerHTML = ''; // Bestehende Felder entfernen
        const type = this.value;

        if(type === 'url') {
            inputFields.innerHTML = `
                <label for="url">URL:</label>
                <input type="url" name="url" id="url" required>
            `;
        } else if(type === 'contact') {
            inputFields.innerHTML = `
                <label for="name">Name:</label>
                <input type="text" name="name" id="name" required>

                <label for="phone">Telefon:</label>
                <input type="tel" name="phone" id="phone" required>

                <label for="email">E-Mail:</label>
                <input type="email" name="email" id="email" required>
            `;
        } else if(type === 'wifi') {
            inputFields.innerHTML = `
                <label for="ssid">SSID:</label>
                <input type="text" name="ssid" id="ssid" required>

                <label for="password">Passwort:</label>
                <input type="password" name="password" id="password" required>

                <label for="encryption">Verschlüsselung:</label>
                <select name="encryption" id="encryption" required>
                    <option value="WPA">WPA</option>
                    <option value="WEP">WEP</option>
                    <option value="nopass">Keine</option>
                </select>
            `;
        }
    });
});
