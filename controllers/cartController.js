// controllers/CartController.js
const Cart = require("../models/cartModel");
const CartProduct = require("../models/cartProductModel");

const CartController = {
  // Obtener todos los pedidos
  async getAllCarts(req, res) {
    try {
      const Carts = await Cart.getAll();
      res.status(200).json({ status: true, data: Carts });
    } catch (error) {
      res.status(500).json({
        status: false,
        msg: "Error fetching Carts",
        error: error.message,
      });
    }
  },

  // Obtener un carrito por UserID
  async getCartByUserId(req, res) {
    
    const { userId } = req.params;
    console.log("userId getCartByUserId:", userId);
    try {
      const cart = await Cart.getByUserId(userId);
      console.log("cart getCartByUserId: ", cart);
      if (!cart) {
        return res.status(404).json({ status: false, msg: "Cart not found" });
      }
      res.status(200).json({ status: true, data: cart });
    } catch (error) {
      res.status(500).json({
        status: false,
        msg: "Error fetching Cart by UserID",
        error: error.message,
      });
    }
  },

  // Crear o actualizar un carrito
  async createCart(req, res) {
    const {
      UserID,
      PriorityID,
      PriorityReason,
      RequestTypeID,
      RequestStateID,
      PaymentTypeID,
      PaymentStateID,
      Address,
      RequestedDate,
      RequestedToDate,
      DeliveredDate,
      Products,
    } = req.body;

    const cartData = {
      UserID,
      PriorityID,
      PriorityReason,
      RequestTypeID,
      RequestStateID,
      PaymentTypeID,
      PaymentStateID,
      Address,
      RequestedDate,
      RequestedToDate,
      DeliveredDate,
    };
    console.log("cartData in create Cart: ", cartData);

    try {
      // Verificar si ya existe un carrito para el usuario
      const existingCart = await Cart.getByUserId(UserID);

      if (existingCart) {
        // Si existe, actualizar el carrito
        const updatedCart = await Cart.update(existingCart.CartID, cartData);

        // Actualizar productos asociados al carrito
        await CartProduct.deleteByCartId(existingCart.CartID); // Eliminar productos previos
        console.log("products in cartController createCart existente: ", Products);
        for (const product of Products) {
          let { productID, quantity } = product;

          if(productID == null){
            productID = product.ProductID;
          }

          if(quantity == null){
            quantity = product.Quantity;
          }

          await CartProduct.createCartProduct(
            productID,
            existingCart.CartID,
            quantity
          );
        }

        return res.status(200).json({
          status: true,
          msg: "Cart updated successfully",
          data: updatedCart,
        });
      }

      // Si no existe, crear un nuevo carrito
      const newCartID = await Cart.create(cartData);

      // Asociar productos al nuevo carrito
      console.log("products in cartController createCart nuevo: ", Products);
      for (const product of Products) {
        const { productID, quantity } = product;
        await CartProduct.createCartProduct(productID, newCartID, quantity);
      }

      res.status(201).json({
        status: true,
        msg: "Cart created successfully",
        data: newCartID,
      });
    } catch (error) {
      console.error("error creating cart: ", error);
      res.status(500).json({
        status: false,
        msg: "Error creating or updating Cart",
        error: error.message,
      });
    }
  },

  // Actualizar un carrito específico por UserID
  async updateUserCart(req, res) {
    const { userId } = req.params;
    const updatedData = req.body;

    try {
      const existingCart = await Cart.getByUserId(userId);

      if (!existingCart) {
        return res.status(404).json({
          status: false,
          msg: "Cart not found for the specified UserID",
        });
      }

      const updatedCart = await Cart.update(existingCart.CartID, updatedData);

      // Actualizar productos asociados al carrito
      if (updatedData.Products && Array.isArray(updatedData.Products)) {
        await CartProduct.deleteByCartId(existingCart.CartID);
        for (const product of updatedData.Products) {
          const { productID, quantity } = product;
          await CartProduct.createCartProduct(
            productID,
            existingCart.CartID,
            quantity
          );
        }
      }

      res.status(200).json({
        status: true,
        msg: "Cart updated successfully",
        data: updatedCart,
      });
    } catch (error) {
      res.status(500).json({
        status: false,
        msg: "Error updating Cart",
        error: error.message,
      });
    }
  },

  // Eliminar un carrito por UserID
  async deleteUserCart(req, res) {
    const { userId } = req.params;
    try {
      const existingCart = await Cart.getByUserId(userId);

      if (!existingCart) {
        return res.status(404).json({
          status: false,
          msg: "Cart not found for the specified UserID",
        });
      }

      // Elimina los productos asociados al carrito
      await CartProduct.deleteByCartId(existingCart.CartID);

      // Elimina el carrito
      const result = await Cart.delete(existingCart.CartID);

      res.status(200).json({
        status: true,
        msg: "Cart deleted successfully",
        data: result,
      });
    } catch (error) {
      res.status(500).json({
        status: false,
        msg: "Error deleting Cart",
        error: error.message,
      });
    }
  },
};

module.exports = CartController;
