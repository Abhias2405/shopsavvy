const { Cart } = require('../model/Cart');
const { Product } = require('../model/Product'); // Import the Product model

exports.fetchCartByUser = async (req, res) => {
  const { id } = req.user;
  try {
    const cartItems = await Cart.find({ user: id }).populate('product');

    // Calculate and add the discount price for each cart item
    const cartItemsWithPrices = cartItems.map((cartItem) => ({
      ...cartItem.toJSON(),
      product: {
        ...cartItem.product.toJSON(),
        discountPrice: Math.round(
          cartItem.product.price * (1 - cartItem.product.discountPercentage / 100)
        ),
      },
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
    await cart.save();
    const populatedCart = await Cart.findById(cart._id).populate('product');

    // Calculate and add the discount price for the added cart item
    populatedCart.product.discountPrice = Math.round(
      populatedCart.product.price * (1 - populatedCart.product.discountPercentage / 100)
    );

    res.status(201).json(populatedCart);
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
    const populatedCart = await cart.populate('product').execPopulate();

    // Calculate and add the discount price for the updated cart item
    populatedCart.product.discountPrice = Math.round(
      populatedCart.product.price * (1 - populatedCart.product.discountPercentage / 100)
    );

    res.status(200).json(populatedCart);
  } catch (err) {
    res.status(400).json(err);
  }
};
