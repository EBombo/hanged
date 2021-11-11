import resizeImage from "resize-image";

export const useResizeImage = () => {
  const resize = (file, resizeWidth, resizeHeight) =>
    new Promise((resolve) => {
      const fileSuffix = file.name.split(".").pop();
      const type =
        fileSuffix.toLowerCase() === "jpeg"
          ? resizeImage.JPEG
          : fileSuffix.toLowerCase() === "png"
          ? resizeImage.PNG
          : fileSuffix.toLowerCase() === "gif"
          ? resizeImage.GIF
          : fileSuffix.toLowerCase() === "webp"
          ? resizeImage.WEBP
          : resizeImage.BMP;

      const reader = new FileReader();
      reader.onload = (upload) => {
        let dataUrl = upload.target.result;
        let image = new Image();
        image.src = dataUrl;
        image.onload = () => {
          let ImgBase64_ = resizeImage.resize(image, resizeWidth, resizeHeight, type);

          if (type === "gif") ImgBase64_ = dataUrl;

          resolve(ImgBase64_);
        };
      };
      reader.readAsDataURL(file);
    });

  return {
    resize: (file, resizeWidth, resizeHeight) => resize(file, resizeWidth, resizeHeight),
  };
};
