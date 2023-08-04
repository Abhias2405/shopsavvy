const { Cart } = require('../model/Cart');
const { Product } = require('../model/Product');

exports.fetchCartByUser = async (req, res) => {
  const { id } = req.user;
  try {
    const cartItems = await Cart.find({ user: id }).populate('product');

    // Calculate and add the discount price to each product in the cart
    const cartItemsWithPrices = cartItems.map((cartItem) => {
      const { product, quantity } = cartItem;
      const discountPrice = Math.round(product.price * (1 - product.discountPercentage / 100));
      return {
        ...cartItem.toJSON(),
        product: {
          ...product.toJSON(),
          discountPrice,
        },
        subtotal: discountPrice * quantity,
      };
    });

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

    // Calculate and add the discount price to the product in the cart
    const { product, quantity } = result;
    const discountPrice = Math.round(product.price * (1 - product.discountPercentage / 100));
    const cartItemWithPrices = {
      ...result.toJSON(),
      product: {
        ...product.toJSON(),
        discountPrice,
      },
      subtotal: discountPrice * quantity,
    };

    res.status(201).json(cartItemWithPrices);
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

    // Calculate and add the discount price to the product in the cart
    const { product, quantity } = result;
    const discountPrice = Math.round(product.price * (1 - product.discountPercentage / 100));
    const cartItemWithPrices = {
      ...result.toJSON(),
      product: {
        ...product.toJSON(),
        discountPrice,
      },
      subtotal: discountPrice * quantity,
    };

    res.status(200).json(cartItemWithPrices);
  } catch (err) {
    res.status(400).json(err);
  }
};
