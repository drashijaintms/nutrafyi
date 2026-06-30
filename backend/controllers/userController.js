const Customer = require("../models/Customer");
const Order = require("../models/Order");
const Product = require("../models/Product");
const jwt = require("jsonwebtoken");

const generateToken = (id) => {
  return jwt.sign(
    { id },
    process.env.JWT_SECRET || "default_jwt_secret_key_123",
    { expiresIn: "30d" }
  );
};

// @desc    Register storefront user
// @route   POST /api/user/register
// @access  Public
const registerUser = async (req, res) => {
  const { name, email, password, phone } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({ message: "Name, email, and password are required" });
  }

  try {
    const existing = await Customer.findOne({ email: email.toLowerCase() });

    if (existing) {
      // If customer has a password, they are already registered
      if (existing.password) {
        return res.status(400).json({ message: "An account with this email already exists" });
      }
      
      // If customer exists but has no password (legacy checkout guest profile), update it!
      existing.password = password;
      existing.name = name;
      if (phone) existing.phone = phone;
      existing.activityHistory.push({
        action: "Account registered (upgraded from guest profile)",
        timestamp: new Date()
      });
      const updated = await existing.save();

      return res.status(201).json({
        _id: updated._id,
        name: updated.name,
        email: updated.email,
        phone: updated.phone,
        token: generateToken(updated._id)
      });
    }

    // Otherwise, create a clean profile
    const customer = new Customer({
      name,
      email: email.toLowerCase(),
      phone: phone || "",
      password,
      activityHistory: [
        {
          action: "Account registered",
          timestamp: new Date()
        }
      ]
    });

    const saved = await customer.save();

    res.status(201).json({
      _id: saved._id,
      name: saved.name,
      email: saved.email,
      phone: saved.phone,
      token: generateToken(saved._id)
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Login storefront user
// @route   POST /api/user/login
// @access  Public
const loginUser = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: "Email and password are required" });
  }

  try {
    const customer = await Customer.findOne({ email: email.toLowerCase() });

    if (customer && customer.password && (await customer.comparePassword(password))) {
      customer.activityHistory.push({
        action: "Logged in",
        timestamp: new Date()
      });
      await customer.save();

      res.json({
        _id: customer._id,
        name: customer.name,
        email: customer.email,
        phone: customer.phone,
        token: generateToken(customer._id)
      });
    } else {
      res.status(401).json({ message: "Invalid email or password" });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get user profile, order history, and wishlist
// @route   GET /api/user/profile
// @access  Private
const getUserProfile = async (req, res) => {
  try {
    const customer = await Customer.findById(req.user._id).populate("wishlist");
    if (!customer) {
      return res.status(404).json({ message: "Customer account not found" });
    }

    // Find orders by matching customer email address
    const orders = await Order.find({ "customer.email": customer.email }).sort({ createdAt: -1 });

    res.json({
      customer,
      orders
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Toggle item in user wishlist
// @route   POST /api/user/wishlist
// @access  Private
const toggleWishlist = async (req, res) => {
  const { productId } = req.body;

  if (!productId) {
    return res.status(400).json({ message: "Product ID is required" });
  }

  try {
    const customer = await Customer.findById(req.user._id);
    if (!customer) {
      return res.status(404).json({ message: "Customer account not found" });
    }

    const index = customer.wishlist.indexOf(productId);
    if (index >= 0) {
      // Remove
      customer.wishlist.splice(index, 1);
      await customer.save();
      return res.json({ message: "Removed from wishlist", wishlist: customer.wishlist });
    } else {
      // Add
      customer.wishlist.push(productId);
      await customer.save();
      return res.json({ message: "Added to wishlist", wishlist: customer.wishlist });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Add shipping/billing address to customer profile
// @route   POST /api/user/address
// @access  Private
const addAddress = async (req, res) => {
  const { addressType, address, city, state, zip, country } = req.body;

  if (!address || !city || !state || !zip || !country) {
    return res.status(400).json({ message: "All address fields are required" });
  }

  try {
    const customer = await Customer.findById(req.user._id);
    if (!customer) {
      return res.status(404).json({ message: "Customer account not found" });
    }

    customer.addresses.push({
      addressType: addressType || "Shipping",
      address,
      city,
      state,
      zip,
      country
    });

    await customer.save();
    res.status(201).json({ message: "Address added successfully", addresses: customer.addresses });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Storefront customer forgot password (verify email + phone)
// @route   POST /api/user/forgot-password
// @access  Public
const forgotPasswordUser = async (req, res) => {
  const { email, phone, newPassword } = req.body;

  if (!email || !phone || !newPassword) {
    return res.status(400).json({ message: "Email, phone number, and new password are required" });
  }

  try {
    const customer = await Customer.findOne({ 
      email: email.toLowerCase(), 
      phone: phone.trim() 
    });

    if (!customer) {
      return res.status(404).json({ message: "No account found matching this email and phone number combination." });
    }

    customer.password = newPassword;
    customer.activityHistory.push({
      action: "Password Reset via email + phone verification",
      timestamp: new Date()
    });

    await customer.save();
    res.json({ message: "Password updated successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  registerUser,
  loginUser,
  getUserProfile,
  toggleWishlist,
  addAddress,
  forgotPasswordUser,
};
