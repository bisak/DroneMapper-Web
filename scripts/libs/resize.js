window.resize = (function () {
    'use strict';
    function Resize() {
    }

    Resize.prototype = {
        init: function () {
        },
        photo: function (file, maxSize, callback) {
            var _this = this;
            var reader = new FileReader();
            reader.onload = function (readerEvent) {
                _this.resize(readerEvent.target.result, maxSize, callback);
            };
            reader.readAsDataURL(file);
        },
        resize: function (dataURL, maxSize, callback) {
            var _this = this;
            var image = new Image();
            image.onload = function () {
                var canvas = document.createElement('canvas'),
                    width = image.width,
                    height = image.height;
                if (width > height) {
                    if (width > maxSize) {
                        height *= maxSize / width;
                        width = maxSize;
                    }
                } else {
                    if (height > maxSize) {
                        width *= maxSize / height;
                        height = maxSize;
                    }
                }
                canvas.width = width;
                canvas.height = height;
                canvas.getContext('2d').drawImage(image, 0, 0, width, height);

                _this.output(canvas, callback);

            };
            image.src = dataURL;
        },
        output: function (canvas, callback) {
            canvas.toBlob(function (blob) {
                callback(blob);
            }, 'image/jpeg', 0.99);
        }
    };
    return Resize;
}());
