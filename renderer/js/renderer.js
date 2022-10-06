const form = document.querySelector('#img-form');
const img = document.querySelector('#img');
const outputPath = document.querySelector('#output-path');
const filename = document.querySelector('#filename');
const widthInput = document.querySelector('#width');
const heightInput = document.querySelector('#height');

function loadImage(event) {
    const file = event.target.files[0];

    if (!isFileAnImage(file)) {
        console.log('Please select an image');
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
}

// Check if file is an image
function isFileAnImage(file) {
    const acceptedImageTypes = ['image/gif', 'image/png', 'image/jpeg', 'image/jpg'];

    return file && acceptedImageTypes.includes(file['type']);
}

img.addEventListener('change', loadImage);