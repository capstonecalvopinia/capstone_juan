// models/productModel.js
const { databaseInstance, sql } = require("../config/dbConfig.js");

class ProductModel {
  // Método para obtener todos los productos
  static async getAllProducts() {
    const pool = await databaseInstance.getConnection();
    const query = `
      SELECT 
        Product.*,
        Unit.Name AS UnitName,
        Unit.ShortName AS UnitShortName,
        Category.Name AS CategoryName,
        Category.Description AS CategoryDescription,
        Image.ImageID AS ImageID,
        Image.ImageUrl AS Image
      FROM 
        Product
      JOIN 
        Unit ON Product.UnitID = Unit.UnitID
      JOIN
        Image ON Product.ProductID = Image.ProductID
      LEFT JOIN 
        CategoryProduct ON Product.ProductID = CategoryProduct.ProductID
      LEFT JOIN 
        Category ON CategoryProduct.CategoryID = Category.CategoryID
    `;

    const result = await pool.request().query(query);

    // Reorganizar los resultados para que cada producto incluya sus categorías como un arreglo
    const products = result.recordset.reduce((acc, row) => {
      // Verificar si el producto ya ha sido añadido
      let product = acc.find((p) => p.ProductID === row.ProductID);

      // Si no existe, se crea un nuevo producto
      if (!product) {
        product = {
          ...row,
          categories: [],
        };
        acc.push(product);
      }

      // Añadir categoría si está disponible
      if (row.CategoryName) {
        product.categories.push({
          name: row.CategoryName,
          description: row.CategoryDescription,
        });
      }

      return acc;
    }, []);

    return products;
  }

  // Método para crear un nuevo producto
  static async createProduct(productData) {
    const { name, description, price, stock, isAvailable } = productData;

    try {
      console.log("Creating product: ", productData);

      const pool = await databaseInstance.getConnection();

      // Realiza la inserción del nuevo producto
      await pool
        .request()
        .input("Name", sql.VarChar(100), name)
        .input("Description", sql.Text, description)
        .input("Price", sql.Decimal, price)
        .input("Stock", sql.Int, stock)
        .input("IsAvailable", sql.Bit, isAvailable).query(`
          INSERT INTO Product (Name, Description, Price, Stock, IsAvailable)
          VALUES (@Name, @Description, @Price, @Stock, @IsAvailable)
        `);

      const result = await pool.request().input("Name", sql.VarChar(100), name)
        .query(`
          SELECT ProductID FROM Product WHERE Name = @Name
        `);

      const productID = result.recordset[0]?.ProductID;

      console.log("result creating product: ", result);
      return {
        success: true,
        message: "Producto creado exitosamente",
        productID: productID,
      };
    } catch (error) {
      console.error("Error al crear el producto:", error);
      return {
        success: false,
        message: "Error al crear el producto",
        error: error.message,
      };
    }
  }

  // Método para obtener un producto por su ID
  static async getProductById(productID) {
    try {
      const pool = await databaseInstance.getConnection();

      // Buscar el producto por su ID
      const result = await pool.request().input("ProductID", sql.Int, productID)
        .query(`
          SELECT 
            Product.*,
            Unit.Name AS UnitName,
            Unit.ShortName AS UnitShortName,
            Category.Name AS CategoryName,
            Category.Description AS CategoryDescription,
            Image.ImageID AS ImageID,
            Image.ImageUrl AS Image
          FROM 
            Product
          JOIN 
            Unit ON Product.UnitID = Unit.UnitID
          JOIN
            Image ON Product.ProductID = Image.ProductID
          LEFT JOIN 
            CategoryProduct ON Product.ProductID = CategoryProduct.ProductID
          LEFT JOIN 
            Category ON CategoryProduct.CategoryID = Category.CategoryID
          WHERE Product.ProductID = @ProductID
        `);

      const product = result.recordset[0];

      if (!product) {
        return { success: false, message: "Producto no encontrado" };
      }

      return { success: true, product: product };
    } catch (error) {
      console.error("Error al obtener el producto:", error);
      return {
        success: false,
        message: "Error al obtener el producto",
        error: error.message,
      };
    }
  }

  // Método para obtener productos por sus IDs
  static async getProductsByIds(productIDs) {
    try {
      const pool = await databaseInstance.getConnection();

      // Convertir el arreglo de productIDs a una cadena separada por comas
      const productIdsString = productIDs.join(",");

      // Buscar los productos por sus IDs
      const result = await pool
        .request()
        .input("ProductIDs", sql.VarChar, productIdsString) // Asegúrate de pasar los IDs correctamente
        .query(`
        SELECT 
          Product.*,
          Unit.Name AS UnitName,
          Unit.ShortName AS UnitShortName,
          Category.Name AS CategoryName,
          Category.Description AS CategoryDescription,
          Image.ImageID AS ImageID,
          Image.ImageUrl AS Image
        FROM 
          Product
        JOIN 
          Unit ON Product.UnitID = Unit.UnitID
        JOIN
          Image ON Product.ProductID = Image.ProductID
        LEFT JOIN 
          CategoryProduct ON Product.ProductID = CategoryProduct.ProductID
        LEFT JOIN 
          Category ON CategoryProduct.CategoryID = Category.CategoryID
        WHERE Product.ProductID IN (${productIdsString})
      `);

      // Verificar si hay productos encontrados
      const products = result.recordset;

      if (products.length === 0) {
        return { success: false, message: "Productos no encontrados" };
      }

      return { success: true, products: products };
    } catch (error) {
      console.error("Error al obtener los productos:", error);
      return {
        success: false,
        message: "Error al obtener los productos",
        error: error.message,
      };
    }
  }

  // Método para actualizar un producto existente
  static async updateProduct(productID, productData) {
    const { Name, Description, Price, Stock, IsAvailable, CategoryID } =
      productData;

    try {
      console.log("Updating product: ", productData);

      const pool = await databaseInstance.getConnection();

      // Actualiza el producto
      await pool
        .request()
        .input("ProductID", sql.Int, productID)
        .input("Name", sql.VarChar(100), Name)
        .input("Description", sql.Text, Description)
        .input("Price", sql.Decimal, Price)
        .input("Stock", sql.Int, Stock)
        .input("IsAvailable", sql.Bit, IsAvailable).query(`
          UPDATE Product
          SET Name = @Name, Description = @Description, Price = @Price, Stock = @Stock, IsAvailable = @IsAvailable
          WHERE ProductID = @ProductID
        `);

      return { success: true, message: "Producto actualizado exitosamente" };
    } catch (error) {
      console.error("Error al actualizar el producto:", error);
      return {
        success: false,
        message: "Error al actualizar el producto",
        error: error.message,
      };
    }
  }

  // Método para eliminar un producto
  static async deleteProduct(productID) {
    try {
      const pool = await databaseInstance.getConnection();

      // Eliminar el producto
      await pool.request().input("ProductID", sql.Int, productID).query(`
          DELETE FROM Product WHERE ProductID = @ProductID
        `);

      return { success: true, message: "Producto eliminado exitosamente" };
    } catch (error) {
      console.error("Error al eliminar el producto:", error);
      return {
        success: false,
        message: "Error al eliminar el producto",
        error: error.message,
      };
    }
  }
}

module.exports = ProductModel;
