const form = document.querySelector('#img-form');
const img = document.querySelector('#img');
const outputPath = document.querySelector('#output-path');
const filename = document.querySelector('#filename');
const widthInput = document.querySelector('#width');
const heightInput = document.querySelector('#height');

function loadImage(event) {
    const file = event.target.files[0];

    if (!isFileAnImage(file)) {
        showToast('error', 'Please select an image');
        return;
    }

    // Get original dimensions
    const originalImg = new Image();
    originalImg.src = URL.createObjectURL(file);
    originalImg.onload = function () {
        widthInput.value = this.width;
        heightInput.value = this.height;
    }

    form.style.display = 'block';
    filename.innerText = file.name;
    outputPath.innerText = path.join(os.homeDir(), 'image-resizer');
}

// Send image data to main process (a.k.a. main.js)
function sendImageToMainProcessForResizing(event) {
    event.preventDefault();
    const width = widthInput.value;
    const height = heightInput.value;
    const imgPath = img.files[0].path;

    if (!img.files[0]) {
        showToast('error', 'Please upload an image');
        return;
    }

    if (width === '' || height === '') {
        showToast('error', 'Please fill in a height and width to resize to');
        return;
    }

    // Send to main using ipcRenderer
    preloadIpcRenderer.send('image:resize', {
        imgPath,
        width,
        height
    });
}

// Catch the 'image:done' event
preloadIpcRenderer.on('image:done', () => {
    showToast('success', `Image resized to W:${widthInput.value}px x H: ${heightInput.value}px`)
});

// Check if file is an image
function isFileAnImage(file) {
    const acceptedImageTypes = ['image/gif', 'image/png', 'image/jpeg', 'image/jpg'];

    return file && acceptedImageTypes.includes(file['type']);
}

function showToast(type, message) {
    Toastify.toast({
        text: message,
        duration: 3000,
        close: false,
        style: {
            background: type === 'success' ? 'green' : 'red',
            color: 'white',
            textAlign: 'center',
            padding: '1rem 2rem'
        }
    });
}

img.addEventListener('change', loadImage);
form.addEventListener('submit', sendImageToMainProcessForResizing);