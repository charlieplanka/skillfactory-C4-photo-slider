// TODO
// 2 — fix right button mysterious disappearance after click
// 3 — remove outlines from buttons on mouse click

class Photo {
    constructor(htmlClass) {
        this.htmlElement = document.querySelector(htmlClass);
        this.src = "";
    }

    updateHtmlElementSource() {
        this.htmlElement.setAttribute("src", this.src);
    }

    updatePhotoSource(newSource) {
        this.src = newSource;
    }
}

const leftPhoto = new Photo(".left-photo");
const mainPhoto = new Photo(".main-photo");
const rightPhoto = new Photo(".right-photo");

const photos = {
    left: leftPhoto,
    main: mainPhoto,
    right: rightPhoto,
    updatePhotosOnPage: function (newLeftSrc, newMainSrc, newRightSrc) {
        this.left.updatePhotoSource(newLeftSrc);
        this.main.updatePhotoSource(newMainSrc);
        this.right.updatePhotoSource(newRightSrc);
        this.updateHtml();
    },
    updateHtml: function () {
        for (let photo in this) {
            if (typeof this[photo] === "function") {
                continue;  // is there a more beautiful way to exclude methods from parameters list?
            }
            photoObject = this[photo];
            photoObject.updateHtmlElementSource();
        }

    },
    getCurrentPhotoSources: function () {
        return [this.left.src, this.main.src, this.right.src];
    }
}


// fetch urls from pexels and display images
const pexelsApiKey = "563492ad6f9170000100000128577f9e7acf423684d09f81f00948ff";

fetch("https://api.pexels.com/v1/search?query=goose", {
        headers: {
            "Authorization": `${pexelsApiKey}`
        }
    }).then((response) => {
        return response.json();
    }).then((data) => {
        let photoPexelsUrls = [];
        const pexelsPhotos = data.photos;
        for (let photo of pexelsPhotos) {
            const src = photo.src;
            const url = src.large;
            photoPexelsUrls.push(url);
        }
        photos.updatePhotosOnPage(photoPexelsUrls[10], photoPexelsUrls[11], photoPexelsUrls[12]);
        const photoGallery = document.querySelector(".photo-gallery");
        photoGallery.classList.remove("invisible");
    })

// slideshow buttons handlers
let rightButton = document.querySelector(".right-button");

rightButton.addEventListener("click", function () {
    movePhotosRight(photos);
    animatePhotoAppearance(".main-photo");
})

function movePhotosRight(photos) {
    [left, main, right] = photos.getCurrentPhotoSources();
    photos.updatePhotosOnPage(main, right, left);
}

let leftButton = document.querySelector(".left-button");

leftButton.addEventListener("click", function () {
    movePhotosLeft(photos);
    animatePhotoAppearance(".main-photo");
})

function movePhotosLeft(photos) {
    [left, main, right] = photos.getCurrentPhotoSources();
    photos.updatePhotosOnPage(right, left, main);
}

function animatePhotoAppearance(selector) {
    photo = document.querySelector(selector);
    photo.style.opacity = 0;
    let opacity = 0;
    id = setInterval(() => {
        if (opacity < 1) {
            opacity += 0.01;
            document.querySelector(selector).style.opacity = opacity;
        } else {
            clearInterval(id);  // fix the timer
        }
    }, 5)
}

