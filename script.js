// Background Remover
document.getElementById('uploadForm').addEventListener('submit', async function(event) {
    event.preventDefault();

    const fileInput = document.getElementById('fileInput');
    const resultContainer = document.getElementById('resultContainer');
    const loadingMessage = document.getElementById('loadingMessage');
    const file = fileInput.files[0];
    
    if (!file) {
        alert('Por favor, selecciona una imagen.');
        return;
    }
    
    loadingMessage.style.display = 'block';
    resultContainer.innerHTML = '';

    const formData = new FormData();
    formData.append('image_file', file);
    formData.append('size', 'auto');

    try {
        const response = await fetch('https://api.remove.bg/v1.0/removebg', {
            method: 'POST',
            headers: {
                'X-Api-Key': '8DBrdWgD89kJ9SBLXVjy2Mkr'
            },
            body: formData
        });

        if (response.ok) {
            const blob = await response.blob();
            const url = URL.createObjectURL(blob);

            const img = new Image();
            img.src = url;
            
            img.onload = () => {
                const canvas = document.createElement('canvas');
                const ctx = canvas.getContext('2d');
                
                canvas.width = 1000;
                canvas.height = 1000;

                ctx.fillStyle = "#FFFFFF";
                ctx.fillRect(0, 0, canvas.width, canvas.height);

                const aspectRatio = img.width / img.height;
                let drawWidth, drawHeight;
                if (aspectRatio > 1) {
                    drawWidth = 1000;
                    drawHeight = 1000 / aspectRatio;
                } else {
                    drawHeight = 1000;
                    drawWidth = 1000 * aspectRatio;
                }
                const drawX = (1000 - drawWidth) / 2;
                const drawY = (1000 - drawHeight) / 2;

                ctx.drawImage(img, drawX, drawY, drawWidth, drawHeight);

                const downloadUrl = canvas.toDataURL('image/png');
                resultContainer.innerHTML = `
                    <img src="${downloadUrl}" alt="Resultado">
                    <a href="${downloadUrl}" download="no-bg.png" class="download-button">Descargar Imagen</a>
                `;
            };
        } else {
            const error = await response.text();
            alert('Error al eliminar el fondo: ' + error);
        }
    } catch (error) {
        alert('Ocurrió un error: ' + error);
    } finally {
        loadingMessage.style.display = 'none';
    }
});

// Code Lottery
function realizarSorteo() {
    const nombresTexto = document.getElementById('nombres').value;
    const nombresArray = nombresTexto.split(',').map(nombre => nombre.trim()).filter(nombre => nombre !== '');
    if (nombresArray.length > 1) {
        const nombreGanador = nombresArray[Math.floor(Math.random() * nombresArray.length)];
        document.getElementById('resultado').innerHTML = `<p>El ganador es: <strong>${nombreGanador}</strong></p>`;
    } else {
        document.getElementById('resultado').innerHTML = '<p>Por favor, ingresa al menos dos nombres.</p>';
    }
}

// Translator
function splitText(text, maxLength) {
    const parts = [];
    let start = 0;
    while (start < text.length) {
        let end = start + maxLength;
        if (end > text.length) end = text.length;
        parts.push(text.substring(start, end));
        start = end;
    }
    return parts;
}

function translateText() {
    const inputText = document.getElementById('inputText').value;
    const targetLang = document.getElementById('languageSelect').value;
    
    if (inputText.trim() === '') {
        document.getElementById('translatedText').value = '';
        return;
    }
    
    const maxLength = 500;
    const textParts = splitText(inputText, maxLength);
    let translatedParts = [];
    
    const promises = textParts.map(part => {
        const url = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=auto&tl=${targetLang}&dt=t&q=${encodeURIComponent(part)}`;
        return fetch(url)
            .then(response => response.json())
            .then(data => translatedParts.push(data[0][0][0]))
            .catch(error => {
                console.error('Error al traducir:', error);
                translatedParts.push('Error al traducir esta parte. Inténtalo de nuevo.');
            });
    });

    Promise.all(promises).then(() => {
        document.getElementById('translatedText').value = translatedParts.join(' ');
    });
}

// Image Processor
document.getElementById('imageUpload').addEventListener('change', function(event) {
    const file = event.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function(e) {
            const img = new Image();
            img.onload = function() {
                const canvas = document.getElementById('canvas');
                const ctx = canvas.getContext('2d');

                const canvasSize = 1000;

                canvas.width = canvasSize;
                canvas.height = canvasSize;

                ctx.fillStyle = 'white';
                ctx.fillRect(0, 0, canvas.width, canvas.height);

                const scale = Math.min(canvasSize / img.width, canvasSize / img.height);
                const imgWidth = img.width * scale;
                const imgHeight = img.height * scale;

                const x = (canvasSize - imgWidth) / 2;
                const y = (canvasSize - imgHeight) / 2;

                ctx.drawImage(img, x, y, imgWidth, imgHeight);

                const outputImage = document.getElementById('outputImage');
                outputImage.src = canvas.toDataURL('image/png');
                outputImage.style.display = 'block';

                const downloadBtn = document.getElementById('downloadBtn');
                downloadBtn.style.display = 'block';
                downloadBtn.onclick = function() {
                    const link = document.createElement('a');
                    link.href = canvas.toDataURL('image/png');
                    link.download = 'imagen_procesada.png';
                    link.click();
                };
            };
            img.src = e.target.result;
        };
        reader.readAsDataURL(file);
    }
});

// Video Code Generator
function generateVideoCode() {
    const url = document.getElementById('video-url').value;
    const width = document.getElementById('width').value || '2000';
    const height = document.getElementById('height').value || '1000';

    const videoCode = `<video autoplay loop muted height="${height}" width="${width}">
<source src="${url}" type="video/mp4">
</video>`;

    document.getElementById('video-code').value = videoCode;

    document.getElementById('preview-source').src = url;
    const videoPreview = document.getElementById('video-preview');
    videoPreview.load();
    document.getElementById('preview').style.display = 'block';
}

// Code Editor
document.getElementById("editor").addEventListener("input", function() {
    var code = document.getElementById("editor").value;
    var iframe = document.getElementById("output");
    iframe.srcdoc = code;
});

// Execute code immediately on page load
document.getElementById("editor").dispatchEvent(new Event('input'));

// Popup functions
function openChatGPT() {
    window.open(
        'https://chat.openai.com/',
        'ChatGPTPopup',
        'width=600,height=800,scrollbars=yes,resizable=yes'
    );
}

function openGoogleLens() {
    window.open(
        'https://lens.google/',
        'GoogleLensPopup',
        'width=600,height=800,scrollbars=yes,resizable=yes'
    );
}