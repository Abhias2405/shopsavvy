const { Cart } = require('../model/Cart');

exports.fetchCartByUser = async (req, res) => {
  const { id } = req.user;
  try {
    const cartItems = await Cart.find({ user: id }).populate('product');

    // Calculate and add the discount price to each cart item
    const cartItemsWithPrices = cartItems.map((cartItem) => ({
      ...cartItem.toJSON(),
      discountPrice: Math.round(cartItem.product.price * (1 - cartItem.product.discountPercentage / 100)),
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
    const doc = await cart.save();
    const result = await doc.populate('product').execPopulate();
    result.discountPrice = Math.round(result.product.price * (1 - result.product.discountPercentage / 100));
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
    const result = await cart.populate('product').execPopulate();
    result.discountPrice = Math.round(result.product.price * (1 - result.product.discountPercentage / 100));
    res.status(200).json(result);
  } catch (err) {
    res.status(400).json(err);
  }
};
