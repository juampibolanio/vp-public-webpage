export function initContactForm() {
    const form = document.querySelector('#contact-form');
    const statusDiv = document.querySelector('#form-status');

    form?.addEventListener('submit', async (e) => {
        e.preventDefault();
    
        statusDiv.textContent = 'Enviando mensaje...';
        statusDiv.className = 'form-status sending';
        statusDiv.style.display = 'block';

    const formData = new FormData(e.target);
    const data = Object.fromEntries(formData);

    try {
        const response = await fetch('/api/send-email', {
            method: 'POST',
            body: JSON.stringify(data),
            headers: { 'Content-Type': 'application/json' }
        });

        const result = await response.json();

        if (response.ok) {
            statusDiv.textContent = result.message;
            statusDiv.className = 'form-status success';
            form.reset();
        } else {
            statusDiv.textContent = result.message;
            statusDiv.className = 'form-status error';
        }
        } catch (err) {
            statusDiv.textContent = 'Error de conexión con el servidor.';
            statusDiv.className = 'form-status error';
        }
    });
}