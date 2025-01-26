// controllers/productController.js
const ProductModel = require("../models/productModel.js");

const DiscountModel = require("../models/discountModel.js");

const CategoryProductModel = require("../models/categoryProductModel.js");

class ProductController {
  // Método para obtener todos los productos
  static async getAllProducts(req, res) {
    try {
      const products = await ProductModel.getAllProducts();

      console.log("products: ", products);

      const allDiscounts = await DiscountModel.getAllDiscounts();

      console.log("allDiscounts: ", allDiscounts);

      // Recorremos cada producto y agregamos el descuento correspondiente
      products.forEach((product) => {
        // Buscamos los descuentos que correspondan al producto según su ProductID
        const discountsForProduct = allDiscounts.filter(
          (discount) => discount.ProductID === product.ProductID
        );

        // Agregamos los descuentos al producto (si hay descuentos)
        if (discountsForProduct.length > 0) {
          product.discounts = discountsForProduct;
        } else {
          product.discounts = []; // Si no hay descuentos, dejamos el arreglo vacío
        }
      });

      console.log("this.products: ", products); // Imprime el arreglo con la información de descuentos agregada a cada producto

      res.json(products);
    } catch (error) {
      res.status(500).json({ msg: "Error al obtener los productos", error });
    }
  }

  // Método para registrar un nuevo producto
  static async registerProduct(req, res) {
    try {
      const {
        name,
        description,
        price,
        stock,
        isAvailable,
        categoryID,
        recipeData,
      } = req.body;
      //console.log("req.body: ", req.body);

      if (!name || !description || !price || !categoryID) {
        return res.status(422).json({
          msg: "Nombre, descripción, precio y categoría son obligatorios",
        });
      }

      const newProduct = {
        name,
        description,
        price,
        stock,
        isAvailable,
        categoryID,
        recipeData, // Receta opcional
      };

      const result = await ProductModel.createProduct(newProduct);

      if (result.success) {
        //agregar categoría
        const resCat = await CategoryProductModel.createCategoryProduct(
          result.productID,
          categoryID
        );
        console.log("categoría agregada a producto: ", resCat);
        res.status(201).json({
          msg: "Producto registrado exitosamente",
          productID: result.productID,
        });
      } else {
        res
          .status(500)
          .json({ msg: "Error al registrar el producto", error: result.error });
      }
    } catch (error) {
      console.error("Error en registerProduct:", error);
      res
        .status(500)
        .json({ msg: "Error al registrar el producto", error: error.message });
    }
  }

  // Método para obtener un producto por su ID
  static async getProductById(req, res) {
    const { id } = req.params;
    try {
      const product = await ProductModel.getProductById(id);
      if (!product) {
        return res.status(404).json({ msg: "Producto no encontrado" });
      }

      console.log("product pree: ", product);
      let discounts = await DiscountModel.getActiveDiscountsByProductId(
        product.product.ProductID
      );
      console.log("discounts: ", discounts);
      discounts = discounts.discounts;
      console.log("discounts: ", discounts);

      // Recorremos cada producto y agregamos el descuento correspondiente

      if (discounts != undefined) {
        // Buscamos los descuentos que correspondan al producto según su ProductID
        const discountsForProduct = discounts.filter(
          (discount) => discount.ProductID === product.product.ProductID
        );

        // Agregamos los descuentos al producto (si hay descuentos)
        if (discountsForProduct.length > 0) {
          product.product.discounts = discountsForProduct;
        } else {
          product.product.discounts = []; // Si no hay descuentos, dejamos el arreglo vacío
        }
      } else {
        product.product.discounts = [];
      }

      console.log("product: ", product.product); // Imprime el arreglo con la información de descuentos agregada a cada producto

      res.json(product);
    } catch (error) {
      res.status(500).json({ msg: "Error al obtener el producto", error });
    }
  }

  // Método para actualizar un producto
  static async updateProduct(req, res) {
    const { id } = req.params;
    const { Name, Description, Price, Stock, IsAvailable, CategoryID } =
      req.body;
    try {
      const updatedProduct = {
        Name,
        Description,
        Price,
        Stock,
        IsAvailable,
        CategoryID,
      };

      const result = await ProductModel.updateProduct(id, updatedProduct);

      if (result.success) {
        res.status(200).json({ msg: "Producto actualizado exitosamente" });
      } else {
        res.status(500).json({
          msg: "Error al actualizar el producto",
          error: result.error,
        });
      }
    } catch (error) {
      res
        .status(500)
        .json({ msg: "Error al actualizar el producto", error: error.message });
    }
  }

  // Método para eliminar un producto
  static async deleteProduct(req, res) {
    const { id } = req.params;
    try {
      const result = await ProductModel.deleteProduct(id);

      if (result.success) {
        res.status(200).json({ msg: "Producto eliminado exitosamente" });
      } else {
        res
          .status(500)
          .json({ msg: "Error al eliminar el producto", error: result.error });
      }
    } catch (error) {
      res
        .status(500)
        .json({ msg: "Error al eliminar el producto", error: error.message });
    }
  }
}

module.exports = ProductController;
