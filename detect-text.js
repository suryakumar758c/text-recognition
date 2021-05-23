const path = require("path");
const tesseract = require("tesseract.js");
const isUrl = require("is-url");
const multer = require("multer");

exports.multerUpload = multer({
  storage: multer.diskStorage({
    destination: function (request, file, cb) {
      cb(null, "./uploads");
    },
    filename: function (request, file, cb) {
      cb(null, file.fieldname + "-" + Date.now() + "-" + file.originalname);
    },
  }),
}).single("image");

exports.detectText = async (request, response) => {
  const output = { code: 200, message: "Success", data: null };
  try {
    let image;

    if (request.method === "GET") {
      image = request.query.image;

      if (!isUrl(image)) throw new Error("Invalid image URL!");
    } else if (request.is("multipart/form-data")) {
      image = path.join(__dirname, request.file.path);
    } else {
      image = request.body.image;
    }

    if (!image) throw new Error("Image required!");

    let {
      data: { text = "" },
    } = await tesseract.recognize(image, "eng");

    text = text.replace(/(\r\n|\n|\r)/gm, "");

    output.data = { text };
  } catch (error) {
    console.log("detect text error", error);
    output.code = 400;
    output.message = "Error";
    output.data = error.message;
  } finally {
    response.status(output.code).json(output);
  }
};
