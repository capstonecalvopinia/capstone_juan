const express = require("express");
const multer = require("multer");
const upload = multer({ storage: multer.memoryStorage() });
const router = express.Router();

// Crear una instancia del router
const imageController = require("../controllers/imageController");

// Ruta para subir imágenes
router.post("/upload", upload.single("image"), async (req, res) => {
  // console.log("req. uploading: ", req);
  // console.log("req.file uploading: ", req.file);
  if (!req.file) {
    console.log("No se ha seleccionado ninguna imagen");
    return res
      .status(400)
      .json({ status: false, msg: "No se ha seleccionado ninguna imagen" });
  }

  try {
    const response = await imageController.createImage(
      req.file,
      req.body.folderName,
      req.body.productID
    );
    console.log("response in route: ", response);

    if (response.status == true) {
      res.status(201).json({
        status: true,
        msg: "Imagen subida exitosamente",
        data: { url: imageUrl },
      });
    } else {
      res.status(500).json({ status: response.status, msg: response.msg, error: response.error });
    }
  } catch (error) {
    res
      .status(500)
      .json({ status: false, msg: "Imagen no subida", error: error.message });
  }
});

// Ruta para obtener una imagen por su publicID
router.get("/images/:publicID", async (req, res) => {
  const publicID = req.params.publicID;
  try {
    const image = await imageController.getByName(publicID);
    if (image) {
      res.status(200).json({
        status: true,
        data: image,
      });
    } else {
      res.status(404).json({ status: false, msg: "Imagen no encontrada" });
    }
  } catch (error) {
    res.status(500).json({ status: false, error: error.message });
  }
});

// Ruta para obtener todas las imágenes
router.get("/all", async (req, res) => {
  try {
    const images = await imageController.getAllImages();
    res.status(200).json({
      status: true,
      data: images,
    });
  } catch (error) {
    res.status(500).json({ status: false, error: error.message });
  }
});

// Ruta para eliminar una imagen
router.delete("/images/:publicID", async (req, res) => {
  const publicID = req.params.publicID;
  try {
    const deleted = await imageController.deleteImage(publicID);
    if (deleted) {
      res.status(200).json({
        status: true,
        msg: "Imagen eliminada exitosamente",
      });
    } else {
      res.status(404).json({ status: false, msg: "Imagen no encontrada" });
    }
  } catch (error) {
    res.status(500).json({ status: false, error: error.message });
  }
});

module.exports = router;
