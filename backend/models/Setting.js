const mongoose = require("mongoose");

const settingSchema = new mongoose.Schema(
  {
    key: {
      type: String,
      required: true,
      unique: true,
      default: "site_settings",
    },
    general: {
      websiteName: { type: String, default: "NutraFyi" },
      logo: { type: String, default: "" },
      favicon: { type: String, default: "" },
    },
    contact: {
      email: { type: String, default: "" },
      phone: { type: String, default: "" },
      address: { type: String, default: "" },
    },
    seo: {
      defaultMetaTitle: { type: String, default: "" },
      defaultMetaDescription: { type: String, default: "" },
    },
    socialMedia: {
      facebook: { type: String, default: "" },
      instagram: { type: String, default: "" },
      twitter: { type: String, default: "" },
      youtube: { type: String, default: "" },
    },
    storeAddress: {
      addressLine1: { type: String, default: "" },
      addressLine2: { type: String, default: "" },
      city: { type: String, default: "" },
      countryState: { type: String, default: "India — Maharashtra" },
      postcodeZip: { type: String, default: "" },
    },
    generalOptions: {
      sellingLocations: { type: String, default: "Sell to all countries" },
      shippingLocations: { type: String, default: "Ship to all countries you sell to" },
      defaultCustomerLocation: { type: String, default: "Shop country/region" },
      addressAutocomplete: { type: Boolean, default: false },
    },
    taxesAndCoupons: {
      enableTaxes: { type: Boolean, default: false },
      enableCoupons: { type: Boolean, default: true },
      calculateCouponsSequentially: { type: Boolean, default: false },
    },
    currencyOptions: {
      currency: { type: String, default: "United States dollar ($) — USD" },
      currencyPosition: { type: String, default: "Left" },
      thousandSeparator: { type: String, default: "," },
      decimalSeparator: { type: String, default: "." },
      numberOfDecimals: { type: Number, default: 2 },
    },
    shippingZones: {
      type: Array,
      default: [
        {
          id: "everywhere",
          name: "Everywhere",
          regions: "Everywhere",
          methods: "No shipping methods offered to this zone.",
          isDefault: true,
        },
        {
          id: "rest_of_world",
          name: "Rest of the world",
          regions: "An optional zone you can use to set the shipping method(s) available to any regions that have not been listed above.",
          methods: "No shipping methods offered to this zone.",
          isDefault: true,
        },
      ],
    },
    paymentProviders: {
      stripe: {
        installed: { type: Boolean, default: false },
        enabled: { type: Boolean, default: false },
      },
      paypal: {
        installed: { type: Boolean, default: false },
        enabled: { type: Boolean, default: false },
      },
      offline: {
        enabled: { type: Boolean, default: true },
        cod: { type: Boolean, default: true },
        bankTransfer: { type: Boolean, default: false },
      },
      others: {
        razorpay: { type: Boolean, default: false },
        payu: { type: Boolean, default: false },
        payoneer: { type: Boolean, default: false },
        visa: { type: Boolean, default: false },
      },
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Setting", settingSchema);
