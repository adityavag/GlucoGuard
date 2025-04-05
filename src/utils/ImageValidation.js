const validateRetinalLikeImage = (file, callback) => {
    const reader = new FileReader();
    reader.onload = function (e) {
        const img = new Image();
        img.onload = function () {
            const { width, height } = img;

            const isSquare = Math.abs(width - height) < 30;
            const isLargeEnough = width > 200 && height > 200;

            const canvas = document.createElement("canvas");
            const ctx = canvas.getContext("2d");
            canvas.width = width;
            canvas.height = height;
            ctx.drawImage(img, 0, 0, width, height);

            const imageData = ctx.getImageData(0, 0, width, height).data;

            let redPixelCount = 0;
            const totalPixels = width * height;

            for (let i = 0; i < imageData.length; i += 4) {
                const r = imageData[i];
                const g = imageData[i + 1];
                const b = imageData[i + 2];

                if (r > 100 && g < 80 && b < 80) {
                    redPixelCount++;
                }
            }

            const redRatio = redPixelCount / totalPixels;

            const isRetinalLike = isSquare && isLargeEnough && redRatio > 0.08;

            callback(isRetinalLike);
        };
        img.src = e.target.result;
    };
    reader.readAsDataURL(file);
};

export default validateRetinalLikeImage;
