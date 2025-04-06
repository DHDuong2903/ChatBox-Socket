const cloudinary = require("cloudinary").v2;

cloudinary.config({
  cloud_name: "djm8ilpwy",
  api_key: "296686918556557",
  api_secret: "TkpngNScidUsTP6ny2gsYNH9MZw",
  secure: true,
});

module.exports = cloudinary;
