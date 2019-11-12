module.exports = app => {
  const products = require("../controllers/product.controller");
  const authenticate = require("../middlewares/authenticator.middleware");

   // Create a new product
   app.post("/products/new", authenticate, products.newProduct);

   // Retrieve all products
   app.get("/products", authenticate, products.getProducts);
 
   // Retrieve a single Product with product code
//    app.get("/product", authenticate, users.findOne);

   // Delete a product
   app.delete("/product", authenticate, products.deleteProduct);
};
