const Setting = require("../models/Setting");
const { logAdminActivity } = require("../middleware/activityLogger");

// @desc    Get website settings
// @route   GET /api/settings
// @access  Private
const getSettings = async (req, res) => {
  try {
    let settings = await Setting.findOne({ key: "site_settings" });
    if (!settings) {
      // Create default settings if not exists
      settings = await Setting.create({ key: "site_settings" });
    }
    res.json(settings);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update website settings
// @route   PUT /api/settings
// @access  Private
const updateSettings = async (req, res) => {
  try {
    let settings = await Setting.findOne({ key: "site_settings" });
    if (!settings) {
      settings = new Setting({ key: "site_settings" });
    }

    // Merge changes
    if (req.body.general) settings.general = { ...settings.general, ...req.body.general };
    if (req.body.contact) settings.contact = { ...settings.contact, ...req.body.contact };
    if (req.body.seo) settings.seo = { ...settings.seo, ...req.body.seo };
    if (req.body.socialMedia) settings.socialMedia = { ...settings.socialMedia, ...req.body.socialMedia };
    if (req.body.storeAddress) settings.storeAddress = { ...settings.storeAddress, ...req.body.storeAddress };
    if (req.body.generalOptions) settings.generalOptions = { ...settings.generalOptions, ...req.body.generalOptions };
    if (req.body.taxesAndCoupons) settings.taxesAndCoupons = { ...settings.taxesAndCoupons, ...req.body.taxesAndCoupons };
    if (req.body.currencyOptions) settings.currencyOptions = { ...settings.currencyOptions, ...req.body.currencyOptions };
    if (req.body.shippingZones) settings.shippingZones = req.body.shippingZones;
    if (req.body.paymentProviders) settings.paymentProviders = { ...settings.paymentProviders, ...req.body.paymentProviders };

    await settings.save();

    await logAdminActivity(req.admin._id, "Update Settings", "Updated global site settings");

    res.json(settings);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getSettings,
  updateSettings,
};
