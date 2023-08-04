const { Cart } = require('../model/Cart');
const { Product } = require('../model/Product');

exports.fetchCartByUser = async (req, res) => {
  const { id } = req.user;
  try {
    const cartItems = await Cart.find({ user: id }).populate('product');

    // Calculate and add the discount price for each cart item
    const cartItemsWithPrices = cartItems.map((item) => ({
      ...item.toJSON(),
      discountPrice: Math.round(item.product.price * (1 - item.product.discountPercentage / 100)),
    }));

    res.status(200).json(cartItemsWithPrices);
  } catch (err) {
    res.status(400).json(err);
  }
};

exports.addToCart = async (req, res) => {
  const { id } = req.user;
  const cart = new Cart({ ...req.body, user: id });
  try {
    // Retrieve the product for the cart item to calculate the discount price
    const product = await Product.findById(req.body.product);
    cart.discountPrice = Math.round(product.price * (1 - product.discountPercentage / 100));

    const doc = await cart.save();
    const result = await doc.populate('product').execPopulate();
    res.status(201).json(result);
  } catch (err) {
    res.status(400).json(err);
  }
};

exports.deleteFromCart = async (req, res) => {
  const { id } = req.params;
  try {
    const doc = await Cart.findByIdAndDelete(id);
    res.status(200).json(doc);
  } catch (err) {
    res.status(400).json(err);
  }
};

exports.updateCart = async (req, res) => {
  const { id } = req.params;
  try {
    const cart = await Cart.findByIdAndUpdate(id, req.body, {
      new: true,
    });

    // Retrieve the product for the cart item to calculate the discount price
    const product = await Product.findById(cart.product);
    cart.discountPrice = Math.round(product.price * (1 - product.discountPercentage / 100));

    const result = await cart.save();
    res.status(200).json(result);
  } catch (err) {
    res.status(400).json(err);
  }
};
