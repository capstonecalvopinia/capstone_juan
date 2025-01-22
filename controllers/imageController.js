const express = require('express');
const router = express.Router();
const ImageModel = require('../models/imageModel');

// Configurar Cloudinary (si aún no está hecho)
const IModel = new ImageModel();

// Obtener todas las imágenes
const getAllImages = async (req, res) => {
    try {
        const images = await IModel.getAllImages();
        res.status(200).json({ status: true, data: images });
    } catch (error) {
        res.status(500).json({ status: false, error: error.message });
    }
};

// Obtener una imagen por su publicID
const getByName = async (req, res) => {
    const publicID = req.params.publicID;
    try {
        const image = await IModel.getByName(publicID);
        if (image) {
            res.status(200).json({ status: true, data: image });
        } else {
            res.status(404).json({ status: false, msg: 'Image not found' });
        }
    } catch (error) {
        res.status(500).json({ status: false, error: error.message });
    }
};

// Crear una nueva imagen
const createImage = async (file, folderName, productID) => {
    
    if (!file) {
        return { status: false, msg: 'No file uploaded' };
    }

    try {
        const imageUrl = await IModel.createImage(folderName, file, productID);
        console.log("imageUrl: ", imageUrl);
        return { status: true, msg: 'File uploaded sucessfully!', url: imageUrl };
        // res.status(201).json({ status: true, msg: 'Image created successfully', url: imageUrl });
    } catch (error) {
        console.error("error: ", error);
        return { status: false, msg: 'File not uploaded sucessfully!', error};
    }
};

// Actualizar una imagen
const updateImage = async (req, res) => {
    const publicID = req.params.publicID;
    const file = req.files.file;

    if (!file) {
        return res.status(400).json({ status: false, msg: 'No file uploaded' });
    }

    try {
        const imageUrl = await IModel.updateImage(publicID, file);
        res.status(200).json({ status: true, msg: 'Image updated successfully', url: imageUrl });
    } catch (error) {
        res.status(500).json({ status: false, error: error.message });
    }
};

// Eliminar una imagen
const deleteImage = async (req, res) => {
    const publicID = req.params.publicID;
    try {
        const deleted = await IModel.deleteImage(publicID);
        if (deleted) {
            res.status(200).json({ status: true, msg: 'Image deleted successfully' });
        } else {
            res.status(404).json({ status: false, msg: 'Image not found' });
        }
    } catch (error) {
        res.status(500).json({ status: false, error: error.message });
    }
};

module.exports = {
    getAllImages,
    getByName,
    createImage,
    updateImage,
    deleteImage,
};
