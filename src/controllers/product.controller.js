const Product = require('../models/product.model');

const getAllProducts = async (req, res) => {
  try {
    const products = await Product.find();

    return res.status(200).json({
      message: 'Products fetched successfully',
      data: products,
    });
  } catch (error) {
    console.error('Get products error:', error.message);
    return res.status(500).json({ error: 'Internal server error' });
  }
};

const createProduct = async (req, res) => {
  try {
    const { name, price } = req.body;

    if (!name || price === undefined) {
      return res.status(400).json({ error: 'Name and price are required' });
    }

    if (price < 0) {
      return res.status(400).json({ error: 'Price cannot be negative' });
    }

    const product = new Product({
      name,
      price,
    });

    await product.save();

    return res.status(201).json({
      message: 'Product created successfully',
      data: product,
    });
  } catch (error) {
    console.error('Create product error:', error.message);
    return res.status(500).json({ error: 'Internal server error' });
  }
};

const updateProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, price } = req.body;

    if (!name && price === undefined) {
      return res.status(400).json({ error: 'At least one field (name or price) is required' });
    }

    if (price !== undefined && price < 0) {
      return res.status(400).json({ error: 'Price cannot be negative' });
    }

    const product = await Product.findByIdAndUpdate(
      id,
      { ...(name && { name }), ...(price !== undefined && { price }) },
      { new: true, runValidators: true }
    );

    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }

    return res.status(200).json({
      message: 'Product updated successfully',
      data: product,
    });
  } catch (error) {
    console.error('Update product error:', error.message);
    return res.status(500).json({ error: 'Internal server error' });
  }
};

const deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;

    const product = await Product.findByIdAndDelete(id);

    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }

    return res.status(200).json({
      message: 'Product deleted successfully',
      data: product,
    });
  } catch (error) {
    console.error('Delete product error:', error.message);
    return res.status(500).json({ error: 'Internal server error' });
  }
};

module.exports = {
  getAllProducts,
  createProduct,
  updateProduct,
  deleteProduct,
};
