const { Cart } = require('../model/Cart');
const { Product } = require('../model/Product');

exports.fetchCartByUser = async (req, res) => {
  const { id } = req.user;
  try {
    const cartItems = await Cart.find({ user: id }).populate('product');

    // Calculate and add the discount price to each cart item
    const cartItemsWithPrices = cartItems.map((cartItem) => {
      const discountPrice = Math.round(cartItem.product.price * (1 - cartItem.product.discountPercentage / 100));
      return { ...cartItem.toJSON(), discountPrice };
    });

    res.status(200).json(cartItemsWithPrices);
  } catch (err) {
    res.status(400).json(err);
  }
};

exports.addToCart = async (req, res) => {
  const { id } = req.user;
  try {
    const product = await Product.findById(req.body.product);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    const cart = new Cart({ ...req.body, user: id });
    const discountPrice = Math.round(product.price * (1 - product.discountPercentage / 100));
    cart.discountPrice = discountPrice;

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
    const product = await Product.findById(req.body.product);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    const cart = await Cart.findByIdAndUpdate(id, req.body, { new: true });
    const discountPrice = Math.round(product.price * (1 - product.discountPercentage / 100));
    cart.discountPrice = discountPrice;

    const result = await cart.populate('product').execPopulate();

    res.status(200).json(result);
  } catch (err) {
    res.status(400).json(err);
  }
};
