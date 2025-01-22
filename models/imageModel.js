const cloudinary = require("cloudinary").v2;
const { databaseInstance, sql } = require("../config/dbConfig.js");
const streamifier = require("streamifier");

class ImageModel {
  constructor() {
    // Configurar Cloudinary en el constructor
    cloudinary.config({
      cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
      api_key: process.env.CLOUDINARY_API_KEY,
      api_secret: process.env.CLOUDINARY_API_SECRET,
    });
  }

  async uploadToCloudinary(buffer, folderName) {
    return new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          folder: folderName,
          resource_type: "image",
          allowed_formats: ["jpeg", "png", "jpg"],
        },
        (error, result) => {
          if (error) {
            reject(error);
          } else {
            resolve(result.secure_url);
          }
        }
      );

      // Convertimos el buffer en un stream y lo enviamos
      streamifier.createReadStream(buffer).pipe(uploadStream);
    });
  }
  // Obtener todas las imágenes
  async getAllImages() {
    try {
      const images = await cloudinary.api.resources({ type: "upload" });
      return images.resources;
    } catch (error) {
      console.error("Error al obtener todas las imágenes:", error);
    }
  }

  // Obtener una imagen por su publicID
  async getByName(publicID) {
    try {
      const image = await cloudinary.api.resource(publicID);
      return image;
    } catch (error) {
      console.error("Error al obtener la imagen:", error);
    }
  }

  // Crear una nueva imagen
  async createImage(folderName, file, productID) {
    try {
      if (!file || !file.buffer) {
        throw new Error("El archivo no contiene un buffer válido");
      }

      const imageUrl = await this.uploadToCloudinary(file.buffer, folderName);
      console.log("Imagen subida exitosamente:", imageUrl);
      const pool = await databaseInstance.getConnection();
      const query = `
  INSERT INTO Image (ImageUrl, ProductID)
  VALUES (@ImageUrl, @ProductID);
`;
      const result = await pool
        .request()
        .input("ImageUrl", imageUrl) // Reemplaza con la URL de la imagen
        .input("ProductID", productID) // Reemplaza con un ProductID válido
        .query(query);

      console.log("Imagen insertada con éxito:", result);

      return imageUrl;
    } catch (error) {
      console.error("Error al crear la imagen:", error);
      throw error;
    }
  }

  // Actualizar una imagen
  async updateImage(publicID, file) {
    try {
      const uploadResult = await cloudinary.uploader.upload(file.path, {
        folder: "capstone",
        resource_type: "image",
        allowed_formats: ["jpeg", "png", "jpg"],
        overwrite: true,
        public_id: publicID,
      });

      return uploadResult.secure_url;
    } catch (error) {
      console.error("Error al actualizar la imagen:", error);
    }
  }

  // Eliminar una imagen
  async deleteImage(publicID) {
    try {
      const destroyResult = await cloudinary.uploader.destroy(publicID);
      return destroyResult;
    } catch (error) {
      console.error("Error al eliminar la imagen:", error);
    }
  }

  // Método para obtener las imágenes de un arreglo de IDs de recetas
  static async getImagesByRecipeIds(recipeIDs) {
    try {
      const pool = await databaseInstance.getConnection();

      // Convertir el arreglo de IDs en una cadena separada por comas para usarlos en la consulta SQL
      const ids = recipeIDs.join(",");

      const result = await pool
        .request()
        .input("RecipeIDs", sql.NVarChar, ids)
        .query(
          `SELECT ImageUrl, RecipeID FROM ImageRecipe WHERE RecipeID IN (${ids})`
        );

      const images = result.recordset;

      // Verificar si se encontraron imágenes
      if (images.length === 0) {
        return {
          success: false,
          message: "No se encontraron imágenes para las recetas proporcionadas",
        };
      }

      return { success: true, images: images };
    } catch (error) {
      console.error("Error al obtener las imágenes de las recetas:", error);
      throw new Error(
        "Error al obtener las imágenes de las recetas: " + error.message
      );
    }
  }
}

// Exportar el modelo
module.exports = ImageModel;
