// controllers/CartController.js
// const Cart = require("../models/cartModel");
// const CartProduct = require("../models/cartProductModel");

const { spawn } = require("child_process");
const ProductModel = require("../models/productModel.js");
const RequestModel = require("../models/requestModel.js");
const ProductRecipeModel = require("../models/productRecipeModel.js");
const RecipeModel = require("../models/recipeModel.js");
const ImageModel = require("../models/imageModel.js");
const path = require("path");
const axios = require("axios");
require("dotenv").config();

const RecommendationController = {
  async getRecommendations(req, res) {
    const { userId } = req.body; // Datos enviados en el cuerpo de la solicitud
    const topN = req.body.topN || 5; // Número de recomendaciones, por defecto 5

    //---------------------------------------
    const products = await ProductModel.getAllProducts();
    //console.log("products: ", products);
    const userRequests = await RequestModel.getById(userId);
    //console.log("userRequests: ", userRequests);

    let catalogData = [];

    products.forEach((product) => {
      catalogData.push({
        product_id: product.ProductID,
        product_price: product.Price,
        product_stock: product.Stock,
        category: product.CategoryName,
      });
    });

    //console.log("catalogData: ", catalogData);

    let historyData = [];

    if (userRequests?.Products && Array.isArray(userRequests.Products)) {
      userRequests.Products.forEach((product) => {
        historyData.push({ user_id: userId, product_id: product.ProductID });
      });
    } else {
      console.warn(
        "No se encontraron productos en userRequests.Products para el usuario:",
        userId
      );
    }

    //console.log("historyData: ", historyData);

    //----------------------------------------
    // Crear el objeto de datos para enviar a la API de Python
    const requestData = {
      user_id: userId,
      catalog_data: catalogData,
      history_data: historyData,
      top_n: topN,
    };

    try {
      // Enviar los datos a la API de Python
      const response = await axios.post(
        process.env.PYTHON_SERVER + "/recommend",
        requestData
      );

      let productsId = [];
      //console.log("response: ", response);
      response.data.recommendations.forEach((recommendation) => {
        //console.log("recommendation: ", recommendation);
        productsId.push(recommendation.product_id);
      });
      let productsInfo = await ProductModel.getProductsByIds(productsId);

      response.data.productsInfo = productsInfo;

      // Si la respuesta es exitosa, retornamos los datos
      return res.status(200).json({
        status: true,
        msg: "Recomendaciones generadas exitosamente",
        data: response.data,
      });
    } catch (error) {
      // console.error(
      //   "Error al obtener recomendaciones desde la API de Python:",
      //   error
      // );
      return res.status(500).json({
        status: false,
        msg: "Error al generar recomendaciones",
        error: error.message,
      });
    }
  },

  async getCartRecommendations(req, res) {
    const { cart_data } = req.body; // Datos del carrito enviados en la solicitud

    //---------------------------------------
    const products = await ProductModel.getAllProducts();

    let catalogData = [];

    products.forEach((product) => {
      catalogData.push({
        product_id: product.ProductID,
        product_price: product.Price,
        product_stock: product.Stock,
        category: product.CategoryName,
      });
    });

    console.log("catalogDataa: ", catalogData);

    console.log("cart_dataa: ", cart_data);

    //----------------------------------------
    // Crear el objeto de datos para enviar a la API de Python
    const requestData = {
      cart_data: cart_data,
      catalog_data: catalogData,
    };

    try {
      // Enviar los datos a la API de Python
      const response = await axios.post(
        process.env.PYTHON_SERVER + "/cart-recommendations",
        requestData
      );

      let productsId = [];
      console.log("response: ", response);
      response.data.recommendations.forEach((recommendation) => {
        console.log("recommendation: ", recommendation);
        productsId.push(recommendation.product_id);
      });
      let productsInfo = await ProductModel.getProductsByIds(productsId);

      response.data.productsInfo = productsInfo;

      // Si la respuesta es exitosa, retornamos los datos
      return res.status(200).json({
        status: true,
        msg: "Recomendaciones generadas exitosamente para el carrito",
        data: response.data,
      });
    } catch (error) {
      console.error(
        "Error al obtener recomendaciones desde la API de Python (carrito):",
        error
      );
      return res.status(500).json({
        status: false,
        msg: "Error al generar recomendaciones para el carrito",
        error: error.message,
      });
    }
  },

  async getRecipeRecommendations(req, res) {
    const { product_id } = req.body; // El ID del producto de interés, enviado en la solicitud

    // Obtener los productos, recetas y productos_recetas desde la base de datos o como ejemplo
    const products = await ProductModel.getAllProducts();
    const recipes = await RecipeModel.getAllRecipes(); // Aquí obtienes las recetas correctamente
    const productRecipes = await ProductRecipeModel.getAll();

    // Preparar los datos de productos
    let catalogData = [];
    products.forEach((product) => {
      catalogData.push({
        product_id: product.ProductID,
        product_price: product.Price,
        product_stock: product.Stock,
        category: product.CategoryName,
      });
    });

    //console.log("catalogData: ", catalogData);

    // Preparar los datos de las recetas
    let recipesData = [];
    recipes.forEach((recipe) => {
      recipesData.push({
        recipe_id: recipe.RecipeID,
        recipe_name: recipe.Name,
        recipe_description: recipe.Description,
      });
    });

    //console.log("recipesData: ", recipesData);

    // Preparar los datos de la relación entre productos y recetas
    let productRecipeData = [];
    productRecipes.forEach((productRecipe) => {
      productRecipeData.push({
        product_id: productRecipe.ProductID,
        recipe_id: productRecipe.RecipeID,
        quantity: productRecipe.Quantity,
        unit_id: productRecipe.UnitID,
      });
    });

    //console.log("productRecipeData: ", productRecipeData);

    //----------------------------------------
    // Crear el objeto de datos para enviar a la API de Python
    const requestData = {
      product_id: product_id, // El producto de interés
      catalog_data: catalogData, // Datos de los productos
      recipes_data: recipesData, // Datos de las recetas
      product_recipe_data: productRecipeData, // Datos de la relación entre productos y recetas
    };

    try {
      // Enviar los datos a la API de Python para obtener las recomendaciones
      const response = await axios.post(
        process.env.PYTHON_SERVER + "/recipe-recommendations", // URL de tu servidor Python
        requestData
      );

      // Procesar la respuesta y obtener las recetas recomendadas
      let recipeIds = [];
      response.data.recommendations.forEach((recommendation) => {
        recipeIds.push(recommendation.recipe_id);
      });

      let recipeInfo = await RecipeModel.getRecipesByIds(recipeIds);
      //console.log("recipeInfo: ", recipeInfo);
      // Obtener el arreglo de RecipeID de todas las recetas en recipeInfo
      const recipeIdsImgs = recipeInfo.recipes.map((recipe) => recipe.RecipeID);

      //console.log("recipeIdsImgs: ", recipeIdsImgs);

      const recipesImages = await ImageModel.getImagesByRecipeIds(
        recipeIdsImgs
      );
      //console.log("recipesImages: ", recipesImages);
      // Llamar a la función con los datos
      const updatedRecipeInfo = addImagesToRecipes(recipeInfo, recipesImages);
      //console.log("updatedRecipeInfo: ", updatedRecipeInfo);
      response.data.recipeInfo = updatedRecipeInfo;

      // Si la respuesta es exitosa, retornar los datos
      return res.status(200).json({
        status: true,
        msg: "Recomendaciones generadas exitosamente para el producto",
        data: response.data,
      });
    } catch (error) {
      console.error(
        "Error al obtener recomendaciones desde la API de Python (producto):",
        error
      );
      return res.status(500).json({
        status: false,
        msg: "Error al generar recomendaciones para el producto",
        error: error.message,
      });
    }
  },
};
// Función para agregar la imagen a cada receta
function addImagesToRecipes(recipeInfo, recipesImages) {
  // Crear un objeto de imágenes indexadas por RecipeID
  const imagesMap = recipesImages.images.reduce((acc, image) => {
    acc[image.RecipeID] = image.ImageUrl;
    return acc;
  }, {});

  // Agregar la imagen a cada receta en recipeInfo
  const updatedRecipes = recipeInfo.recipes.map((recipe) => {
    // Obtener la imagen correspondiente a la receta
    const imageUrl = imagesMap[recipe.RecipeID] || null; // Si no hay imagen, asignar null
    return { ...recipe, ImageUrl: imageUrl };
  });

  return { ...recipeInfo, recipes: updatedRecipes };
}
module.exports = RecommendationController;
