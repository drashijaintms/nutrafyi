import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import API from "../services/api";
import Loader from "../components/Loader";
import toast from "react-hot-toast";
import { ArrowLeft, Save, Plus, Trash, Image as ImageIcon, Edit } from "lucide-react";
import { resolveProductImage } from "../utils/resolveImage";

import RichTextEditor from "../components/RichTextEditor";

export default function ProductForm() {
  const { id } = useParams();
  const isEdit = !!id;
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const [activeTab, setActiveTab] = useState("general");

  // Form States
  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [price, setPrice] = useState("");
  const [regularPrice, setRegularPrice] = useState("");
  const [salePrice, setSalePrice] = useState("");
  const [saleStart, setSaleStart] = useState("");
  const [saleEnd, setSaleEnd] = useState("");
  const [description, setDescription] = useState("");
  const [shortDescription, setShortDescription] = useState("");
  const [image, setImage] = useState("");
  const [gallery, setGallery] = useState([]);
  const [category, setCategory] = useState("");
  const [subcategory, setSubcategory] = useState("");
  const [brand, setBrand] = useState("");
  const [sku, setSku] = useState("");
  const [barcode, setBarcode] = useState("");
  const [stockQuantity, setStockQuantity] = useState(10);
  const [lowStockThreshold, setLowStockThreshold] = useState(5);
  const [productType, setProductType] = useState("Simple");
  const [isVirtual, setIsVirtual] = useState(false);
  const [isDownloadable, setIsDownloadable] = useState(false);
  const [externalUrl, setExternalUrl] = useState("");
  const [buttonText, setButtonText] = useState("");
  const [digitalFile, setDigitalFile] = useState("");
  const [status, setStatus] = useState("Published");
  const [showSaleSchedule, setShowSaleSchedule] = useState(false);

  const [availableForms, setAvailableForms] = useState([
    "Capsules", "Tablets", "Powder", "Gummies", "Liquid", "Serum"
  ]);
  const [availableDietTypes, setAvailableDietTypes] = useState([
    "Vegetarian", "Vegan", "Gluten Free", "Non-GMO", "Sugar Free", "Cruelty Free"
  ]);

  const [itemForm, setItemForm] = useState("");
  const [dietType, setDietType] = useState("");
  const [specifications, setSpecifications] = useState([]);
  const [currencyOverrides, setCurrencyOverrides] = useState({
    INR: { price: "", regularPrice: "", salePrice: "" },
    EUR: { price: "", regularPrice: "", salePrice: "" }
  });

  const handleCurrencyOverrideChange = (currency, field, value) => {
    setCurrencyOverrides((prev) => {
      const updatedCurrency = { ...prev[currency], [field]: value };
      if (field === "regularPrice") {
        updatedCurrency.price = value;
      } else if (field === "price") {
        updatedCurrency.regularPrice = value;
      }
      return {
        ...prev,
        [currency]: updatedCurrency
      };
    });
  };

  // Inventory & Stock management
  const [manageStock, setManageStock] = useState(false);
  const [stockStatus, setStockStatus] = useState("In Stock");
  const [soldIndividually, setSoldIndividually] = useState(false);

  // Shipping
  const [weight, setWeight] = useState(0);
  const [length, setLength] = useState(0);
  const [width, setWidth] = useState(0);
  const [height, setHeight] = useState(0);
  const [shippingClass, setShippingClass] = useState("");

  // Linked Products
  const [upsells, setUpsells] = useState([]);
  const [crossSells, setCrossSells] = useState([]);
  const [groupedProducts, setGroupedProducts] = useState([]);
  const [upsellSearch, setUpsellSearch] = useState("");
  const [crossSellSearch, setCrossSellSearch] = useState("");
  const [groupedProductsSearch, setGroupedProductsSearch] = useState("");

  // Attributes
  const [attributes, setAttributes] = useState([]); // [{ name: "Size", values: ["S", "M"], visibleOnProductPage: true }]
  const [newAttrName, setNewAttrName] = useState("");
  const [newAttrValues, setNewAttrValues] = useState("");
  const [visibleOnProductPage, setVisibleOnProductPage] = useState(true);
  const [usedForVariations, setUsedForVariations] = useState(true);

  // Variations
  const [variations, setVariations] = useState([]);

  // SEO States
  const [metaTitle, setMetaTitle] = useState("");
  const [metaDescription, setMetaDescription] = useState("");
  const [metaKeywords, setMetaKeywords] = useState("");
  const [canonicalUrl, setCanonicalUrl] = useState("");

  const tabs = [
    ...(productType !== "Grouped" && productType !== "Variable" ? [{ id: "general", label: "General" }] : []),
    { id: "inventory", label: "Inventory" },
    ...(productType !== "Grouped" && productType !== "External" && productType !== "Digital" && !isVirtual ? [{ id: "shipping", label: "Shipping" }] : []),
    { id: "linked", label: "Linked Products" },
    { id: "attributes", label: "Attributes" },
    ...(productType === "Variable" ? [{ id: "variations", label: "Variations" }] : []),
    { id: "seo", label: "SEO Settings" }
  ];

  useEffect(() => {
    if (productType === "Digital") {
      setIsVirtual(true);
      setIsDownloadable(true);
    } else if (productType === "Grouped" || productType === "External") {
      setIsVirtual(false);
      setIsDownloadable(false);
    }
  }, [productType]);

  useEffect(() => {
    const availableTabIds = tabs.map((t) => t.id);
    if (!availableTabIds.includes(activeTab)) {
      if (availableTabIds.includes("general")) {
        setActiveTab("general");
      } else if (availableTabIds.includes("inventory")) {
        setActiveTab("inventory");
      }
    }
  }, [productType, isVirtual]);

  // Upload States & Handlers
  const [uploadingFeatured, setUploadingFeatured] = useState(false);
  const [uploadingGallery, setUploadingGallery] = useState(false);

  const handleFeaturedImageUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("image", file);

    setUploadingFeatured(true);
    const toastId = toast.loading("Uploading featured image...");

    try {
      const res = await API.post("/uploads", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      setImage(res.data.url);
      toast.success("Featured image uploaded!", { id: toastId });
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || "Failed to upload image", { id: toastId });
    } finally {
      setUploadingFeatured(false);
    }
  };

  const handleGalleryUpload = async (e) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const formData = new FormData();
    for (let i = 0; i < files.length; i++) {
      formData.append("images", files[i]);
    }

    setUploadingGallery(true);
    const toastId = toast.loading("Uploading gallery images...");

    try {
      const res = await API.post("/uploads/gallery", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      setGallery((prev) => [...prev, ...(res.data.urls || [])]);
      toast.success("Gallery images uploaded!", { id: toastId });
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || "Failed to upload gallery images", { id: toastId });
    } finally {
      setUploadingGallery(false);
    }
  };

  const handleRemoveGalleryImage = (indexToRemove) => {
    setGallery((prev) => prev.filter((_, idx) => idx !== indexToRemove));
  };

  // Queries
  const { data: categories = [] } = useQuery({
    queryKey: ["formCategories"],
    queryFn: async () => {
      const res = await API.get("/categories");
      return res.data;
    },
  });

  const { data: brands = [] } = useQuery({
    queryKey: ["formBrands"],
    queryFn: async () => {
      const res = await API.get("/brands");
      return res.data;
    },
  });

  const { data: productData, isLoading: isLoadingProduct } = useQuery({
    queryKey: ["productDetail", id],
    queryFn: async () => {
      const res = await API.get(`/products/id/${id}`);
      return res.data;
    },
    enabled: isEdit,
  });

  const { data: allProductsData = {} } = useQuery({
    queryKey: ["formAllProducts"],
    queryFn: async () => {
      const res = await API.get("/products/admin/all", {
        params: { limit: 1000 },
      });
      return res.data;
    },
  });
  const allProducts = allProductsData.products || [];
  const filteredProducts = allProducts.filter((p) => p._id !== id);

  useEffect(() => {
    if (productData) {
      setTitle(productData.title || "");
      setSlug(productData.slug || "");
      setPrice(productData.price || "");
      setRegularPrice(productData.regularPrice || "");
      setSalePrice(productData.salePrice || "");
      setCurrencyOverrides(productData.currencyOverrides || {
        INR: { price: "", regularPrice: "", salePrice: "" },
        EUR: { price: "", regularPrice: "", salePrice: "" }
      });
      if (productData.saleStart) {
        setSaleStart(productData.saleStart.split("T")[0]);
        setShowSaleSchedule(true);
      } else {
        setSaleStart("");
      }
      if (productData.saleEnd) {
        setSaleEnd(productData.saleEnd.split("T")[0]);
        setShowSaleSchedule(true);
      } else {
        setSaleEnd("");
      }
      setDescription(productData.description || "");
      setShortDescription(productData.shortDescription || "");
      setImage(productData.image || "");
      setGallery(productData.gallery || []);
      setCategory(productData.category || "");
      setSubcategory(productData.subcategory || "");
      setBrand(productData.brand || "");
      setSku(productData.sku || "");
      setBarcode(productData.barcode || "");
      setManageStock(productData.manageStock || false);
      setStockQuantity(productData.stockQuantity || 0);
      setLowStockThreshold(productData.lowStockThreshold || 5);
      setStockStatus(productData.stockStatus || "In Stock");
      setSoldIndividually(productData.soldIndividually || false);
      setWeight(productData.weight || 0);
      if (productData.dimensions) {
        setLength(productData.dimensions.length || 0);
        setWidth(productData.dimensions.width || 0);
        setHeight(productData.dimensions.height || 0);
      } else {
        setLength(0);
        setWidth(0);
        setHeight(0);
      }
      setShippingClass(productData.shippingClass || "");
      setUpsells((productData.upsells || []).map((u) => (typeof u === "object" && u ? u._id : u)));
      setCrossSells((productData.crossSells || []).map((c) => (typeof c === "object" && c ? c._id : c)));
      setGroupedProducts((productData.groupedProducts || []).map((g) => (typeof g === "object" && g ? g._id : g)));
      setProductType(productData.productType || "Simple");
      setIsVirtual(productData.isVirtual || false);
      setIsDownloadable(productData.isDownloadable || false);
      setExternalUrl(productData.externalUrl || "");
      setButtonText(productData.buttonText || "");
      setDigitalFile(productData.digitalFile || "");
        setStatus(productData.status || "Published");
        setAttributes(productData.attributes || []);
        setVariations(productData.variations || []);
        if (productData.seo) {
          setMetaTitle(productData.seo.metaTitle || "");
          setMetaDescription(productData.seo.metaDescription || "");
          setMetaKeywords(productData.seo.metaKeywords?.join(", ") || "");
          setCanonicalUrl(productData.seo.canonicalUrl || "");
        }
        setSpecifications(productData.specifications || []);
        const formSpec = productData.specifications?.find((s) => s.label === "ITEM FORM");
        setItemForm(formSpec ? formSpec.value : "");
        
        const dietSpec = productData.specifications?.find((s) => s.label === "DIET TYPE");
        setDietType(dietSpec ? dietSpec.value : "");
      }
    }, [productData]);

  useEffect(() => {
    if (allProducts && allProducts.length > 0) {
      const formsFromProducts = new Set();
      const dietFromProducts = new Set();
      
      allProducts.forEach((p) => {
        p.specifications?.forEach((s) => {
          if (s.label === "ITEM FORM" && s.value) {
            formsFromProducts.add(s.value);
          }
          if (s.label === "DIET TYPE" && s.value) {
            dietFromProducts.add(s.value);
          }
        });
      });
      
      setAvailableForms((prev) => {
        const combined = new Set([...prev, ...formsFromProducts]);
        return Array.from(combined).sort();
      });
      
      setAvailableDietTypes((prev) => {
        const combined = new Set([...prev, ...dietFromProducts]);
        return Array.from(combined).sort();
      });
    }
  }, [allProducts]);

  const handleFormSelect = (val) => {
    if (val === "ADD_NEW") {
      const newVal = window.prompt("Enter new Item Form value (e.g. Softgels, Liquid, Capsules):");
      if (newVal && newVal.trim()) {
        const trimmed = newVal.trim();
        if (!availableForms.includes(trimmed)) {
          setAvailableForms((prev) => [...prev, trimmed].sort());
        }
        setItemForm(trimmed);
      } else {
        setItemForm("");
      }
    } else {
      setItemForm(val);
    }
  };

  const handleEditForm = () => {
    if (!itemForm) return;
    const newVal = window.prompt(`Edit Item Form value "${itemForm}" to:`, itemForm);
    if (newVal && newVal.trim()) {
      const trimmed = newVal.trim();
      setAvailableForms((prev) => {
        const filtered = prev.filter(f => f !== itemForm);
        return [...filtered, trimmed].sort();
      });
      setItemForm(trimmed);
    }
  };

  const handleDeleteForm = () => {
    if (!itemForm) return;
    if (window.confirm(`Are you sure you want to delete form option "${itemForm}"?`)) {
      setAvailableForms((prev) => prev.filter(f => f !== itemForm));
      setItemForm("");
    }
  };

  const handleDietarySelect = (val) => {
    if (val === "ADD_NEW") {
      const newVal = window.prompt("Enter new Dietary Preference value (e.g. Keto, Halal, Kosher):");
      if (newVal && newVal.trim()) {
        const trimmed = newVal.trim();
        if (!availableDietTypes.includes(trimmed)) {
          setAvailableDietTypes((prev) => [...prev, trimmed].sort());
        }
        setDietType(trimmed);
      } else {
        setDietType("");
      }
    } else {
      setDietType(val);
    }
  };

  const handleEditDietary = () => {
    if (!dietType) return;
    const newVal = window.prompt(`Edit Dietary Preference value "${dietType}" to:`, dietType);
    if (newVal && newVal.trim()) {
      const trimmed = newVal.trim();
      setAvailableDietTypes((prev) => {
        const filtered = prev.filter(d => d !== dietType);
        return [...filtered, trimmed].sort();
      });
      setDietType(trimmed);
    }
  };

  const handleDeleteDietary = () => {
    if (!dietType) return;
    if (window.confirm(`Are you sure you want to delete dietary preference option "${dietType}"?`)) {
      setAvailableDietTypes((prev) => prev.filter(d => d !== dietType));
      setDietType("");
    }
  };

  // Mutation
  const saveMutation = useMutation({
    mutationFn: async (payload) => {
      if (isEdit) {
        return await API.put(`/products/${id}`, payload);
      } else {
        return await API.post("/products", payload);
      }
    },
    onSuccess: () => {
      toast.success(isEdit ? "Product updated successfully" : "Product created successfully");
      queryClient.invalidateQueries(["products"]);
      navigate("/products");
    },
    onError: (err) => {
      toast.error(err.response?.data?.message || "Failed to save product");
    },
  });

  const handleAddAttribute = () => {
    if (!newAttrName || !newAttrValues) return toast.error("Enter attribute name and values");
    const vals = newAttrValues.split("|").map((v) => v.trim()).filter(Boolean);
    setAttributes((prev) => [
      ...prev,
      { name: newAttrName, values: vals, visibleOnProductPage, usedForVariations }
    ]);
    setNewAttrName("");
    setNewAttrValues("");
    setVisibleOnProductPage(true);
    setUsedForVariations(true);
  };

  const handleRemoveAttribute = (index) => {
    setAttributes((prev) => prev.filter((_, i) => i !== index));
  };

  const handleToggleUpsell = (prodId) => {
    setUpsells((prev) =>
      prev.includes(prodId) ? prev.filter((id) => id !== prodId) : [...prev, prodId]
    );
  };

  const handleToggleCrossSell = (prodId) => {
    setCrossSells((prev) =>
      prev.includes(prodId) ? prev.filter((id) => id !== prodId) : [...prev, prodId]
    );
  };

  const handleToggleGroupedProduct = (prodId) => {
    setGroupedProducts((prev) =>
      prev.includes(prodId) ? prev.filter((id) => id !== prodId) : [...prev, prodId]
    );
  };

  // Auto-generate variation rows based on attributes
  const handleGenerateVariations = () => {
    const variationAttrs = attributes.filter((attr) => attr.usedForVariations);
    if (variationAttrs.length === 0) return toast.error("No attributes marked 'Used for variations'");

    // Cartesian product of attribute values
    const combinations = variationAttrs.reduce(
      (acc, attr) => {
        const next = [];
        acc.forEach((a) => {
          attr.values.forEach((v) => {
            next.push({ ...a, [attr.name]: v });
          });
        });
        return next;
      },
      [{}]
    );

    const generated = combinations.map((combo) => ({
      combination: combo,
      sku: `${sku || "PROD"}-${Object.values(combo).join("-").toUpperCase()}`,
      price: price || "0",
      salePrice: "",
      stock: 5,
      weight: 0,
      image: "",
    }));

    setVariations(generated);
    toast.success(`Generated ${generated.length} variations!`);
  };

  const handleUpdateVariation = (index, field, value) => {
    setVariations((prev) =>
      prev.map((v, i) => (i === index ? { ...v, [field]: value } : v))
    );
  };

  const handleRemoveVariation = (index) => {
    setVariations((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSave = (e) => {
    e.preventDefault();
    if (!title) return toast.error("Product name is required");

    // Strip any stray currency symbols ($, ₹, £ etc.) — store only the plain number
    const stripCurrency = (val) =>
      String(val || "").replace(/[^\d.]/g, "").trim();

    const cleanPrice        = stripCurrency(price || regularPrice);
    const cleanRegularPrice = stripCurrency(regularPrice || price);
    const cleanSalePrice    = stripCurrency(salePrice);
    
    const cleanCurrencyOverrides = {
      INR: {
        price: stripCurrency(currencyOverrides?.INR?.price || currencyOverrides?.INR?.regularPrice),
        regularPrice: stripCurrency(currencyOverrides?.INR?.regularPrice || currencyOverrides?.INR?.price),
        salePrice: stripCurrency(currencyOverrides?.INR?.salePrice)
      },
      EUR: {
        price: stripCurrency(currencyOverrides?.EUR?.price || currencyOverrides?.EUR?.regularPrice),
        regularPrice: stripCurrency(currencyOverrides?.EUR?.regularPrice || currencyOverrides?.EUR?.price),
        salePrice: stripCurrency(currencyOverrides?.EUR?.salePrice)
      }
    };

    const categoryName = categories.find((c) => c.slug === category)?.title || "";

    const otherSpecs = specifications.filter(
      (s) => s.label !== "BRAND" && s.label !== "ITEM FORM" && s.label !== "DIET TYPE"
    );
    const brandName = brands.find((b) => b.slug === brand)?.name || brand;
    const finalSpecs = [
      ...otherSpecs,
      ...(brand ? [{ label: "BRAND", value: brandName }] : []),
      ...(itemForm ? [{ label: "ITEM FORM", value: itemForm }] : []),
      ...(dietType ? [{ label: "DIET TYPE", value: dietType }] : [])
    ];

    const payload = {
      title,
      slug: slug || undefined,
      price:        cleanPrice,
      regularPrice: cleanRegularPrice,
      salePrice:    cleanSalePrice,
      currencyOverrides: cleanCurrencyOverrides,
      saleStart: saleStart || null,
      saleEnd: saleEnd || null,
      description,
      shortDescription,
      image,
      gallery,
      category,
      categoryName,
      subcategory,
      brand,
      sku,
      barcode,
      manageStock,
      stockQuantity,
      lowStockThreshold,
      stockStatus,
      soldIndividually,
      weight,
      dimensions: {
        length: parseFloat(length) || 0,
        width: parseFloat(width) || 0,
        height: parseFloat(height) || 0
      },
      shippingClass,
      upsells,
      crossSells,
      groupedProducts,
      productType,
      isVirtual,
      isDownloadable,
      externalUrl,
      buttonText,
      digitalFile,
      status,
      attributes,
      variations,
      specifications: finalSpecs,
      seo: {
        metaTitle,
        metaDescription,
        metaKeywords: metaKeywords.split(",").map((k) => k.trim()).filter(Boolean),
        canonicalUrl,
      },
    };

saveMutation.mutate(payload);
  };

  if (isEdit && isLoadingProduct) return <Loader size="lg" />;

  return (
    <form onSubmit={handleSave} className="space-y-6 max-w-6xl mx-auto pb-12">
      {/* Top Bar */}
      <div className="flex items-center justify-between border-b border-slate-100 pb-4">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => navigate("/products")}
            className="p-1.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 transition-colors"
          >
            <ArrowLeft className="w-5 h-5 text-slate-500" />
          </button>
          <div>
            <h1 className="text-xl font-bold text-slate-800">
              {isEdit ? `Edit Product: ${title}` : "New Product"}
            </h1>
            <p className="text-xs text-slate-400">WooCommerce-style catalog editor.</p>
          </div>
        </div>

        <button
          type="submit"
          disabled={saveMutation.isLoading}
          className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-sm px-5 py-2.5 rounded-xl shadow-lg shadow-indigo-600/10 hover:shadow-indigo-600/20 transition-all flex items-center gap-2"
        >
          <Save className="w-4.5 h-4.5" /> {isEdit ? "Update Product" : "Publish Product"}
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Left 3 Columns: Main Form */}
        <div className="lg:col-span-3 space-y-6">
          {/* 1. Basic Metadata Block */}
          <div className="bg-white border border-slate-100 rounded-2xl p-6 shadow-xs space-y-5 animate-in fade-in duration-100">
            <h3 className="text-sm font-bold text-slate-705 uppercase tracking-wider border-b border-slate-50 pb-2">
              Product Information
            </h3>
            <div>
              <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">
                Product Title *
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Organic Vitamin C Capsules"
                className="w-full text-sm px-4 py-3 bg-slate-50/50 border border-slate-200 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 focus:bg-white transition-all"
                required
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div>
                <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">
                  Product Slug (Optional)
                </label>
                <input
                  type="text"
                  value={slug}
                  onChange={(e) => setSlug(e.target.value)}
                  placeholder="e.g. organic-vitamin-c-capsules"
                  className="w-full text-sm px-4 py-3 bg-slate-50/50 border border-slate-200 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 focus:bg-white transition-all"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">
                  Brand
                </label>
                <select
                  value={brand}
                  onChange={(e) => setBrand(e.target.value)}
                  className="w-full text-sm px-4 py-3 bg-slate-50/50 border border-slate-200 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 focus:bg-white transition-all"
                >
                  <option value="">Select Brand</option>
                  {brands.map((b) => (
                    <option key={b._id} value={b.slug}>
                      {b.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div>
                <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">
                  Category
                </label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full text-sm px-4 py-3 bg-slate-50/50 border border-slate-200 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 focus:bg-white transition-all"
                >
                  <option value="">Select Category</option>
                  {categories.map((c) => (
                    <option key={c._id} value={c.slug}>
                      {c.title}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">
                  Subcategory
                </label>
                <input
                  type="text"
                  value={subcategory}
                  onChange={(e) => setSubcategory(e.target.value)}
                  placeholder="e.g. Dietary Supplements"
                  className="w-full text-sm px-4 py-3 bg-slate-50/50 border border-slate-200 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 focus:bg-white transition-all"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 pt-2">
              <div>
                <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">
                  Item Form
                </label>
                <div className="flex gap-2">
                  <select
                    value={itemForm}
                    onChange={(e) => handleFormSelect(e.target.value)}
                    className="flex-1 text-sm px-4 py-3 bg-slate-50/50 border border-slate-200 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 focus:bg-white transition-all"
                  >
                    <option value="">Select Form</option>
                    {availableForms.map((f) => (
                      <option key={f} value={f}>
                        {f}
                      </option>
                    ))}
                    <option value="ADD_NEW" className="font-bold text-indigo-600">+ Add New Form Option</option>
                  </select>
                  {itemForm && (
                    <div className="flex gap-1.5 shrink-0">
                      <button
                        type="button"
                        onClick={handleEditForm}
                        className="p-3 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 hover:border-slate-300 text-slate-500 transition-all flex items-center justify-center"
                        title="Edit current Form"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button
                        type="button"
                        onClick={handleDeleteForm}
                        className="p-3 rounded-xl border border-rose-100 bg-white hover:bg-rose-50 hover:border-rose-250 text-rose-500 transition-all flex items-center justify-center"
                        title="Delete current Form"
                      >
                        <Trash className="w-4 h-4" />
                      </button>
                    </div>
                  )}
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">
                  Dietary Preference
                </label>
                <div className="flex gap-2">
                  <select
                    value={dietType}
                    onChange={(e) => handleDietarySelect(e.target.value)}
                    className="flex-1 text-sm px-4 py-3 bg-slate-50/50 border border-slate-200 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 focus:bg-white transition-all"
                  >
                    <option value="">Select Diet Type</option>
                    {availableDietTypes.map((d) => (
                      <option key={d} value={d}>
                        {d}
                      </option>
                    ))}
                    <option value="ADD_NEW" className="font-bold text-indigo-600">+ Add New Diet Type</option>
                  </select>
                  {dietType && (
                    <div className="flex gap-1.5 shrink-0">
                      <button
                        type="button"
                        onClick={handleEditDietary}
                        className="p-3 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 hover:border-slate-300 text-slate-500 transition-all flex items-center justify-center"
                        title="Edit current Diet Type"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button
                        type="button"
                        onClick={handleDeleteDietary}
                        className="p-3 rounded-xl border border-rose-100 bg-white hover:bg-rose-50 hover:border-rose-250 text-rose-500 transition-all flex items-center justify-center"
                        title="Delete current Diet Type"
                      >
                        <Trash className="w-4 h-4" />
                      </button>
                    </div>
                  )}

                  {activeTab === "seo" && (
                    <div className="space-y-6 animate-in fade-in duration-150 text-left">
                      <div className="border-b border-slate-100 pb-3 flex items-center justify-between">
                        <div>
                          <h4 className="text-sm font-bold text-slate-700">Search Engine Optimization</h4>
                          <p className="text-[11px] text-slate-400 mt-0.5">Customize how this product appears in search engine results.</p>
                        </div>
                      </div>

                      {/* Google SERP Preview block */}
                      <div className="border border-slate-200/80 rounded-2xl p-5 bg-slate-55/30 space-y-4">
                        <h5 className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider">Google Search Snippet Preview</h5>
                        
                        <div className="bg-white border border-slate-100 rounded-xl p-5 shadow-3xs space-y-1.5 text-left max-w-xl">
                          <div className="text-[11px] text-slate-500 flex flex-wrap items-center gap-1 font-semibold">
                            <span>https://nutrafyi.com &gt; products &gt;</span>
                            {slug ? (
                              <span className="text-slate-400">{slug}</span>
                            ) : (
                              <span className="text-slate-300">{title ? title.toLowerCase().replace(/[^a-z0-9]+/g, "-") : "product-slug"}</span>
                            )}
                          </div>
                          <h3 className="text-[19px] text-[#1a0dab] font-normal hover:underline cursor-pointer leading-snug font-sans">
                            {metaTitle || title || "Your SEO Title Here"}
                          </h3>
                          <p className="text-xs text-[#4d5156] leading-relaxed font-sans">
                            {metaDescription || "Your meta description will appear here. Write a compelling description to increase search visibility and click-through rates..."}
                          </p>
                        </div>
                      </div>

                      <div className="space-y-5">
                        <div>
                          <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">
                            Meta Title
                          </label>
                          <input
                            type="text"
                            value={metaTitle}
                            onChange={(e) => setMetaTitle(e.target.value)}
                            placeholder="Organic Vitamin C Capsules | Buy Dietary Supplements"
                            className="w-full text-sm px-4 py-3 bg-slate-50/50 border border-slate-200 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 focus:bg-white transition-all"
                          />
                          <span className="text-[10px] text-slate-400 mt-1 block">Usually kept under 60 characters. Recommended: {metaTitle.length}/60 chars.</span>
                        </div>

                        <div>
                          <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">
                            Meta Description
                          </label>
                          <textarea
                            value={metaDescription}
                            onChange={(e) => setMetaDescription(e.target.value)}
                            rows={3}
                            placeholder="Buy pure organic Vitamin C supplements online at best prices. In-stock, fast shipping..."
                            className="w-full text-sm px-4 py-3 bg-slate-50/50 border border-slate-200 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 focus:bg-white transition-all resize-none"
                          />
                          <span className="text-[10px] text-slate-400 mt-1 block">Usually kept under 160 characters. Recommended: {metaDescription.length}/160 chars.</span>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                          <div>
                            <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">
                              Meta Keywords (comma separated)
                            </label>
                            <input
                              type="text"
                              value={metaKeywords}
                              onChange={(e) => setMetaKeywords(e.target.value)}
                              placeholder="vitamin c, supplements, organic"
                              className="w-full text-sm px-4 py-3 bg-slate-50/50 border border-slate-200 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 focus:bg-white transition-all"
                            />
                          </div>

                          <div>
                            <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">
                              Canonical URL
                            </label>
                            <input
                              type="text"
                              value={canonicalUrl}
                              onChange={(e) => setCanonicalUrl(e.target.value)}
                              placeholder="https://nutrafyi.com/products/organic-vitamin-c"
                              className="w-full text-sm px-4 py-3 bg-slate-50/50 border border-slate-200 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 focus:bg-white transition-all"
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>



          {/* 3. WooCommerce Product Data Box */}
          <div className="bg-white border border-slate-150 rounded-2xl shadow-xs overflow-hidden">
            {/* Header bar of Product Data Box */}
            <div className="bg-slate-50 border-b border-slate-150 px-6 py-4 flex flex-wrap items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Product data —</span>
                <select
                  value={productType}
                  onChange={(e) => setProductType(e.target.value)}
                  className="text-xs font-bold bg-white text-slate-705 border border-slate-300 px-3 py-1.5 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                >
                  <option value="Simple">Simple product</option>
                  <option value="Grouped">Grouped product</option>
                  <option value="External">External/Affiliate product</option>
                  <option value="Variable">Variable product</option>
                  <option value="Digital">Digital product</option>
                </select>
              </div>

              {productType !== "Grouped" && productType !== "External" && (
                <div className="flex items-center gap-4 bg-white/80 px-4 py-1.5 rounded-lg border border-slate-200">
                  <label className="flex items-center gap-1.5 text-xs font-bold text-slate-650 cursor-pointer select-none">
                    <input
                      type="checkbox"
                      checked={isVirtual}
                      onChange={(e) => setIsVirtual(e.target.checked)}
                      className="rounded text-indigo-600 focus:ring-indigo-500 border-slate-300 w-3.5 h-3.5 cursor-pointer"
                    />
                    Virtual
                  </label>
                  <label className="flex items-center gap-1.5 text-xs font-bold text-slate-650 cursor-pointer select-none">
                    <input
                      type="checkbox"
                      checked={isDownloadable}
                      onChange={(e) => setIsDownloadable(e.target.checked)}
                      className="rounded text-indigo-600 focus:ring-indigo-500 border-slate-300 w-3.5 h-3.5 cursor-pointer"
                    />
                    Downloadable
                  </label>
                </div>
              )}
            </div>

            {/* Content: Sidebar on Left, Form Panel on Right */}
            <div className="grid grid-cols-1 md:grid-cols-4 min-h-[300px]">
              {/* Sidebar Tabs */}
              <div className="bg-slate-50/50 border-r border-slate-150 p-4 flex flex-col gap-1 h-full">
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    type="button"
                    onClick={() => setActiveTab(tab.id)}
                    className={`text-left text-xs font-bold px-4 py-3 rounded-xl transition-all ${
                      activeTab === tab.id
                        ? "bg-white text-indigo-600 border border-slate-200 shadow-xs"
                        : "text-slate-500 hover:bg-slate-50 hover:text-slate-800"
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>

              {/* Tab Form Fields */}
              <div className="md:col-span-3 p-6">
                {activeTab === "general" && (
                  <div className="space-y-5 animate-in fade-in duration-150">
                    {productType === "External" && (
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                        <div>
                          <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">
                            Product URL
                          </label>
                          <input
                            type="url"
                            value={externalUrl}
                            onChange={(e) => setExternalUrl(e.target.value)}
                            placeholder="https://"
                            className="w-full text-sm px-4 py-3 bg-slate-50/50 border border-slate-200 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 focus:bg-white transition-all"
                            required={productType === "External"}
                          />
                          <span className="text-[10px] text-slate-400 mt-1 block">Enter the external URL to the product.</span>
                        </div>
                        <div>
                          <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">
                            Button text
                          </label>
                          <input
                            type="text"
                            value={buttonText}
                            onChange={(e) => setButtonText(e.target.value)}
                            placeholder="Buy product"
                            className="w-full text-sm px-4 py-3 bg-slate-50/50 border border-slate-200 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 focus:bg-white transition-all"
                          />
                          <span className="text-[10px] text-slate-400 mt-1 block">This text will be shown on the button linking to the external product.</span>
                        </div>
                      </div>
                    )}

                    {/* Pricing section - WooCommerce General style */}
                    {productType !== "Grouped" && productType !== "Variable" && (
                      <div className="space-y-4">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                          <div>
                            <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">
                              Regular price ($)
                            </label>
                            <input
                              type="number"
                              step="0.01"
                              value={price || regularPrice}
                              onChange={(e) => {
                                setPrice(e.target.value);
                                setRegularPrice(e.target.value);
                              }}
                              placeholder="e.g. 1999"
                              className="w-full text-sm px-4 py-3 bg-slate-50/50 border border-slate-200 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 focus:bg-white transition-all"
                              required={productType !== "Grouped" && productType !== "Variable"}
                            />
                          </div>
                          <div>
                            <div className="flex justify-between items-center mb-2">
                              <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider">
                                Sale price ($)
                              </label>
                              {!showSaleSchedule ? (
                                <button
                                  type="button"
                                  onClick={() => setShowSaleSchedule(true)}
                                  className="text-xs text-indigo-600 hover:text-indigo-800 font-semibold"
                                >
                                  Schedule sale
                                </button>
                              ) : (
                                <button
                                  type="button"
                                  onClick={() => {
                                    setShowSaleSchedule(false);
                                    setSaleStart("");
                                    setSaleEnd("");
                                  }}
                                  className="text-xs text-rose-500 hover:text-rose-700 font-semibold"
                                >
                                  cancel
                                </button>
                              )}
                            </div>
                            <input
                              type="number"
                              step="0.01"
                              value={salePrice}
                              onChange={(e) => setSalePrice(e.target.value)}
                              placeholder="e.g. 1499"
                              className="w-full text-sm px-4 py-3 bg-slate-50/50 border border-slate-200 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 focus:bg-white transition-all"
                            />
                          </div>
                        </div>

                        {showSaleSchedule && (
                          <div className="bg-slate-50/55 p-4 rounded-xl border border-slate-100 space-y-3.5 animate-in fade-in duration-100">
                            <h5 className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                              Sale price dates
                            </h5>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                              <div>
                                <label className="block text-[10px] font-semibold text-slate-500 uppercase mb-1.5">
                                  From… YYYY-MM-DD
                                </label>
                                <input
                                  type="date"
                                  value={saleStart}
                                  onChange={(e) => setSaleStart(e.target.value)}
                                  className="w-full text-xs px-3.5 py-2.5 bg-white border border-slate-200 rounded-lg focus:outline-hidden"
                                />
                              </div>
                              <div>
                                <label className="block text-[10px] font-semibold text-slate-500 uppercase mb-1.5">
                                  To… YYYY-MM-DD
                                </label>
                                <input
                                  type="date"
                                  value={saleEnd}
                                  onChange={(e) => setSaleEnd(e.target.value)}
                                  className="w-full text-xs px-3.5 py-2.5 bg-white border border-slate-200 rounded-lg focus:outline-hidden"
                                />
                              </div>
                            </div>
                          </div>
                        )}

                        {/* Currency Overrides Section */}
                        <div className="bg-slate-50/40 p-5 rounded-2xl border border-slate-100 space-y-5">
                          <div>
                            <h5 className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                              Euro (EUR) Overrides
                            </h5>
                            <p className="text-[10px] text-slate-400 mt-0.5">Custom override price for EUR currency (leave blank to use conversion rate)</p>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-3">
                              <div>
                                <label className="block text-[10px] font-semibold text-slate-500 uppercase mb-1">
                                  Regular Price (€)
                                </label>
                                <input
                                  type="number"
                                  step="0.01"
                                  value={currencyOverrides?.EUR?.regularPrice || ""}
                                  onChange={(e) => handleCurrencyOverrideChange("EUR", "regularPrice", e.target.value)}
                                  placeholder="e.g. 69"
                                  className="w-full text-sm px-4 py-2.5 bg-white border border-slate-200 rounded-xl focus:outline-hidden"
                                />
                              </div>
                              <div>
                                <label className="block text-[10px] font-semibold text-slate-500 uppercase mb-1">
                                  Sale Price (€)
                                </label>
                                <input
                                  type="number"
                                  step="0.01"
                                  value={currencyOverrides?.EUR?.salePrice || ""}
                                  onChange={(e) => handleCurrencyOverrideChange("EUR", "salePrice", e.target.value)}
                                  placeholder="e.g. 49"
                                  className="w-full text-sm px-4 py-2.5 bg-white border border-slate-200 rounded-xl focus:outline-hidden"
                                />
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}

                    {productType === "Variable" && (
                      <div className="text-center py-8 bg-slate-50/50 rounded-xl border border-dashed border-slate-200">
                        <p className="text-xs text-slate-500 font-medium">
                          Pricing and sale schedules are managed individually for each variation under the <strong>Variations</strong> tab.
                        </p>
                      </div>
                    )}
                  </div>
                )}

                {activeTab === "inventory" && (
                  <div className="space-y-5 animate-in fade-in duration-150">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                      <div>
                        <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">
                          SKU (Stock Keeping Unit)
                        </label>
                        <input
                          type="text"
                          value={sku}
                          onChange={(e) => setSku(e.target.value)}
                          placeholder="e.g. VIT-C-100"
                          className="w-full text-sm px-4 py-3 bg-slate-50/50 border border-slate-200 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 focus:bg-white transition-all"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">
                          GTIN, UPC, EAN, or ISBN
                        </label>
                        <input
                          type="text"
                          value={barcode}
                          onChange={(e) => setBarcode(e.target.value)}
                          placeholder="UPC / EAN / GTIN"
                          className="w-full text-sm px-4 py-3 bg-slate-50/50 border border-slate-200 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 focus:bg-white transition-all"
                        />
                      </div>
                    </div>

                    {productType !== "Grouped" && productType !== "External" && (
                      <>
                        {productType === "Variable" && (
                          <div className="flex items-center gap-2 text-xs text-blue-700 bg-blue-50 border border-blue-105 p-3.5 rounded-xl mb-4">
                            <span className="font-semibold">ℹ Settings below apply to all variations without manual stock management enabled.</span>
                          </div>
                        )}

                        <div className="flex flex-col gap-2.5 bg-slate-50/50 p-4 rounded-xl border border-slate-150">
                          <label className="flex items-center gap-2 text-xs font-bold text-slate-650 cursor-pointer select-none">
                            <input
                              type="checkbox"
                              checked={manageStock}
                              onChange={(e) => setManageStock(e.target.checked)}
                              className="rounded text-indigo-600 focus:ring-indigo-500 border-slate-300 w-4 h-4 cursor-pointer"
                            />
                            Track stock quantity for this product
                          </label>
                        </div>

                        {productType !== "Variable" && (
                          <>
                            {manageStock ? (
                              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 animate-in fade-in duration-100">
                                <div>
                                  <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">
                                    Stock Quantity
                                  </label>
                                  <input
                                    type="number"
                                    value={stockQuantity}
                                    onChange={(e) => setStockQuantity(parseInt(e.target.value) || 0)}
                                    className="w-full text-sm px-4 py-3 bg-slate-50/50 border border-slate-200 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 focus:bg-white transition-all"
                                  />
                                </div>
                                <div>
                                  <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">
                                    Low Stock Threshold
                                  </label>
                                  <input
                                    type="number"
                                    value={lowStockThreshold}
                                    onChange={(e) => setLowStockThreshold(parseInt(e.target.value) || 0)}
                                    className="w-full text-sm px-4 py-3 bg-slate-50/50 border border-slate-200 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 focus:bg-white transition-all"
                                  />
                                </div>
                              </div>
                            ) : (
                              <div className="animate-in fade-in duration-100">
                                <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">
                                  Stock status
                                </label>
                                <select
                                  value={stockStatus}
                                  onChange={(e) => setStockStatus(e.target.value)}
                                  className="w-full text-sm px-4 py-3 bg-slate-50/50 border border-slate-200 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 focus:bg-white transition-all"
                                >
                                  <option value="In Stock">In stock</option>
                                  <option value="Out of Stock">Out of stock</option>
                                  <option value="On Backorder">On backorder</option>
                                </select>
                              </div>
                            )}
                          </>
                        )}

                        <div className="flex flex-col gap-2.5 bg-slate-50/50 p-4 rounded-xl border border-slate-150">
                          <label className="flex items-center gap-2 text-xs font-bold text-slate-650 cursor-pointer select-none">
                            <input
                              type="checkbox"
                              checked={soldIndividually}
                              onChange={(e) => setSoldIndividually(e.target.checked)}
                              className="rounded text-indigo-600 focus:ring-indigo-500 border-slate-300 w-4 h-4 cursor-pointer"
                            />
                            Limit purchases to 1 item per order
                          </label>
                        </div>
                      </>
                    )}

                    {(productType === "Digital" || isDownloadable) && (
                      <div>
                        <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">
                          Downloadable Digital File Link
                        </label>
                        <input
                          type="text"
                          value={digitalFile}
                          onChange={(e) => setDigitalFile(e.target.value)}
                          placeholder="https://example.com/secured/product-guide.pdf"
                          className="w-full text-sm px-4 py-3 bg-slate-50/50 border border-slate-200 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 focus:bg-white transition-all"
                        />
                      </div>
                    )}
                  </div>
                )}

                {activeTab === "shipping" && (
                  <div className="space-y-5 animate-in fade-in duration-150">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                      <div>
                        <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">
                          Weight (kg)
                        </label>
                        <input
                          type="number"
                          step="0.01"
                          value={weight}
                          onChange={(e) => setWeight(parseFloat(e.target.value) || 0)}
                          placeholder="0"
                          className="w-full text-sm px-4 py-3 bg-slate-50/50 border border-slate-200 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 focus:bg-white transition-all"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">
                          Shipping class
                        </label>
                        <select
                          value={shippingClass}
                          onChange={(e) => setShippingClass(e.target.value)}
                          className="w-full text-sm px-4 py-3 bg-slate-50/50 border border-slate-200 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 focus:bg-white transition-all"
                        >
                          <option value="">No shipping class</option>
                          <option value="Standard">Standard shipping</option>
                          <option value="Express">Express shipping</option>
                          <option value="Free">Free shipping</option>
                        </select>
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">
                        Dimensions (cm)
                      </label>
                      <div className="grid grid-cols-3 gap-4">
                        <div>
                          <input
                            type="number"
                            step="0.1"
                            value={length}
                            onChange={(e) => setLength(parseFloat(e.target.value) || 0)}
                            placeholder="Length"
                            className="w-full text-sm px-4 py-3 bg-slate-50/50 border border-slate-200 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 focus:bg-white transition-all"
                          />
                          <span className="text-[10px] text-slate-400 mt-1 block text-center">Length</span>
                        </div>
                        <div>
                          <input
                            type="number"
                            step="0.1"
                            value={width}
                            onChange={(e) => setWidth(parseFloat(e.target.value) || 0)}
                            placeholder="Width"
                            className="w-full text-sm px-4 py-3 bg-slate-50/50 border border-slate-200 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 focus:bg-white transition-all"
                          />
                          <span className="text-[10px] text-slate-400 mt-1 block text-center">Width</span>
                        </div>
                        <div>
                          <input
                            type="number"
                            step="0.1"
                            value={height}
                            onChange={(e) => setHeight(parseFloat(e.target.value) || 0)}
                            placeholder="Height"
                            className="w-full text-sm px-4 py-3 bg-slate-50/50 border border-slate-200 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 focus:bg-white transition-all"
                          />
                          <span className="text-[10px] text-slate-400 mt-1 block text-center">Height</span>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {activeTab === "linked" && (
                  <div className="space-y-6 animate-in fade-in duration-150">
                    {/* Grouped products selector (Only for Grouped product type) */}
                    {productType === "Grouped" && (
                      <div className="border border-slate-100 rounded-2xl p-5 space-y-4 bg-slate-50/50">
                        <div>
                          <h4 className="text-sm font-bold text-slate-750">Grouped products</h4>
                          <p className="text-xs text-slate-400 mt-0.5">
                            Select the products which are part of this grouped product.
                          </p>
                        </div>
                        <input
                          type="text"
                          value={groupedProductsSearch}
                          onChange={(e) => setGroupedProductsSearch(e.target.value)}
                          placeholder="Search products to group..."
                          className="w-full text-xs px-4 py-2.5 bg-white border border-slate-200 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
                        />
                        <div className="max-h-48 overflow-y-auto border border-slate-100 rounded-xl divide-y divide-slate-100 bg-white p-2 space-y-1">
                          {filteredProducts
                            .filter((p) => p.title.toLowerCase().includes(groupedProductsSearch.toLowerCase()))
                            .map((p) => {
                              const isSelected = groupedProducts.includes(p._id);
                              return (
                                <label
                                  key={p._id}
                                  className={`flex items-center gap-3 px-3 py-2 rounded-lg cursor-pointer hover:bg-slate-50 transition-colors ${
                                    isSelected ? "bg-indigo-50/50" : ""
                                  }`}
                                >
                                  <input
                                    type="checkbox"
                                    checked={isSelected}
                                    onChange={() => handleToggleGroupedProduct(p._id)}
                                    className="rounded text-indigo-600 focus:ring-indigo-500 border-slate-300 w-4 h-4 cursor-pointer"
                                  />
                                  <div className="flex items-center gap-2">
                                    {p.image && (
                                      <img
                                        src={resolveProductImage(p.image, p.slug)}
                                        alt=""
                                        className="w-6 h-6 object-contain rounded-md border border-slate-100"
                                      />
                                    )}
                                    <span className="text-xs font-medium text-slate-750">{p.title}</span>
                                    <span className="text-[10px] text-slate-400">(SKU: {p.sku || "N/A"})</span>
                                  </div>
                                </label>
                              );
                            })}
                          {filteredProducts.filter((p) => p.title.toLowerCase().includes(groupedProductsSearch.toLowerCase())).length === 0 && (
                            <p className="text-xs text-slate-400 p-3 text-center">No products found</p>
                          )}
                        </div>
                      </div>
                    )}

                    {/* Upsells */}
                    <div className="border border-slate-100 rounded-2xl p-5 space-y-4">
                      <div>
                        <h4 className="text-sm font-bold text-slate-700">Upsells</h4>
                        <p className="text-xs text-slate-400 mt-0.5">
                          Upsells are products which you recommend instead of the currently viewed product, for example, products that are more profitable or better quality.
                        </p>
                      </div>
                      <input
                        type="text"
                        value={upsellSearch}
                        onChange={(e) => setUpsellSearch(e.target.value)}
                        placeholder="Search products for upsell..."
                        className="w-full text-xs px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 focus:bg-white transition-all"
                      />
                      <div className="max-h-48 overflow-y-auto border border-slate-100 rounded-xl divide-y divide-slate-100 p-2 space-y-1">
                        {filteredProducts
                          .filter((p) => p.title.toLowerCase().includes(upsellSearch.toLowerCase()))
                          .map((p) => {
                            const isSelected = upsells.includes(p._id);
                            return (
                              <label
                                key={p._id}
                                className={`flex items-center gap-3 px-3 py-2 rounded-lg cursor-pointer hover:bg-slate-50 transition-colors ${
                                  isSelected ? "bg-indigo-50/50" : ""
                                }`}
                              >
                                <input
                                  type="checkbox"
                                  checked={isSelected}
                                  onChange={() => handleToggleUpsell(p._id)}
                                  className="rounded text-indigo-600 focus:ring-indigo-500 border-slate-300 w-4 h-4 cursor-pointer"
                                />
                                <div className="flex items-center gap-2">
                                  {p.image && (
                                    <img
                                      src={resolveProductImage(p.image, p.slug)}
                                      alt=""
                                      className="w-6 h-6 object-contain rounded-md border border-slate-100"
                                    />
                                  )}
                                  <span className="text-xs font-medium text-slate-750">{p.title}</span>
                                  <span className="text-[10px] text-slate-400">(SKU: {p.sku || "N/A"})</span>
                                </div>
                              </label>
                            );
                          })}
                        {filteredProducts.filter((p) => p.title.toLowerCase().includes(upsellSearch.toLowerCase())).length === 0 && (
                          <p className="text-xs text-slate-400 p-3 text-center">No products found</p>
                        )}
                      </div>
                    </div>

                    {/* Cross-sells */}
                    {productType !== "Grouped" && productType !== "External" && (
                      <div className="border border-slate-100 rounded-2xl p-5 space-y-4">
                        <div>
                          <h4 className="text-sm font-bold text-slate-700">Cross-sells</h4>
                          <p className="text-xs text-slate-400 mt-0.5">
                            Cross-sells are products which you promote in the cart, based on the current product.
                          </p>
                        </div>
                        <input
                          type="text"
                          value={crossSellSearch}
                          onChange={(e) => setCrossSellSearch(e.target.value)}
                          placeholder="Search products for cross-sell..."
                          className="w-full text-xs px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 focus:bg-white transition-all"
                        />
                        <div className="max-h-48 overflow-y-auto border border-slate-100 rounded-xl divide-y divide-slate-100 p-2 space-y-1">
                          {filteredProducts
                            .filter((p) => p.title.toLowerCase().includes(crossSellSearch.toLowerCase()))
                            .map((p) => {
                              const isSelected = crossSells.includes(p._id);
                              return (
                                <label
                                  key={p._id}
                                  className={`flex items-center gap-3 px-3 py-2 rounded-lg cursor-pointer hover:bg-slate-50 transition-colors ${
                                    isSelected ? "bg-indigo-50/50" : ""
                                  }`}
                                >
                                  <input
                                    type="checkbox"
                                    checked={isSelected}
                                    onChange={() => handleToggleCrossSell(p._id)}
                                    className="rounded text-indigo-600 focus:ring-indigo-500 border-slate-300 w-4 h-4 cursor-pointer"
                                  />
                                  <div className="flex items-center gap-2">
                                    {p.image && (
                                      <img
                                        src={resolveProductImage(p.image, p.slug)}
                                        alt=""
                                        className="w-6 h-6 object-contain rounded-md border border-slate-100"
                                      />
                                    )}
                                    <span className="text-xs font-medium text-slate-750">{p.title}</span>
                                    <span className="text-[10px] text-slate-400">(SKU: {p.sku || "N/A"})</span>
                                  </div>
                                </label>
                              );
                            })}
                          {filteredProducts.filter((p) => p.title.toLowerCase().includes(crossSellSearch.toLowerCase())).length === 0 && (
                            <p className="text-xs text-slate-400 p-3 text-center">No products found</p>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {activeTab === "attributes" && (
                  <div className="space-y-6 animate-in fade-in duration-150">
                    {/* Add New Attribute form */}
                    <div className="border border-slate-100 rounded-2xl p-5 bg-slate-50/50 space-y-4">
                      <div className="flex items-center justify-between">
                        <h4 className="text-sm font-bold text-slate-750">Add New Attribute</h4>
                        <button
                          type="button"
                          onClick={handleAddAttribute}
                          className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs px-4 py-2 rounded-xl shadow-md transition-all flex items-center gap-1.5"
                        >
                          <Plus className="w-3.5 h-3.5" /> Add Attribute
                        </button>
                      </div>
                      
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">
                            Name
                          </label>
                          <input
                            type="text"
                            value={newAttrName}
                            onChange={(e) => setNewAttrName(e.target.value)}
                            placeholder="e.g. length or weight"
                            className="w-full text-xs px-4 py-3 bg-white border border-slate-200 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">
                            Value(s)
                          </label>
                          <input
                            type="text"
                            value={newAttrValues}
                            onChange={(e) => setNewAttrValues(e.target.value)}
                            placeholder="Enter some descriptive text. Use '|' to separate different values."
                            className="w-full text-xs px-4 py-3 bg-white border border-slate-200 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
                          />
                        </div>
                      </div>

                      <div className="flex flex-wrap items-center gap-6">
                        <label className="flex items-center gap-2 text-xs font-bold text-slate-650 cursor-pointer select-none">
                          <input
                            type="checkbox"
                            checked={visibleOnProductPage}
                            onChange={(e) => setVisibleOnProductPage(e.target.checked)}
                            className="rounded text-indigo-600 focus:ring-indigo-500 border-slate-300 w-4 h-4 cursor-pointer"
                          />
                          Visible on the product page
                        </label>
                        {productType === "Variable" && (
                          <label className="flex items-center gap-2 text-xs font-bold text-slate-650 cursor-pointer select-none">
                            <input
                              type="checkbox"
                              checked={usedForVariations}
                              onChange={(e) => setUsedForVariations(e.target.checked)}
                              className="rounded text-indigo-600 focus:ring-indigo-500 border-slate-300 w-4 h-4 cursor-pointer"
                            />
                            Used for variations
                          </label>
                        )}
                      </div>
                    </div>

                    {/* Attributes list */}
                    <div className="space-y-3">
                      <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                        Product Attributes ({attributes.length})
                      </h4>
                      {attributes.length > 0 ? (
                        <div className="grid grid-cols-1 gap-3">
                          {attributes.map((attr, idx) => (
                            <div
                              key={idx}
                              className="bg-white border border-slate-100 p-4 rounded-xl flex items-center justify-between shadow-xs"
                            >
                              <div className="space-y-1">
                                <div className="flex items-center gap-2">
                                  <span className="text-sm font-bold text-slate-750">{attr.name}</span>
                                  <span
                                    className={`text-[9px] px-2 py-0.5 rounded-full font-semibold ${
                                      attr.visibleOnProductPage !== false
                                        ? "bg-emerald-50 text-emerald-600 border border-emerald-100"
                                        : "bg-slate-100 text-slate-500"
                                    }`}
                                  >
                                    {attr.visibleOnProductPage !== false ? "Visible on Product Page" : "Hidden"}
                                  </span>
                                  {productType === "Variable" && attr.usedForVariations && (
                                    <span className="text-[9px] px-2 py-0.5 rounded-full font-semibold bg-indigo-50 text-indigo-600 border border-indigo-100">
                                      Used for Variations
                                    </span>
                                  )}
                                </div>
                                <div className="flex flex-wrap gap-1.5">
                                  {attr.values.map((v, vIdx) => (
                                    <span
                                      key={vIdx}
                                      className="bg-slate-50 border border-slate-150 text-[10px] px-2 py-1 rounded-md text-slate-605"
                                    >
                                      {v}
                                    </span>
                                  ))}
                                </div>
                              </div>
                              <button
                                type="button"
                                onClick={() => handleRemoveAttribute(idx)}
                                className="text-rose-500 hover:text-rose-700 hover:bg-rose-50 p-2 rounded-xl transition-all"
                                title="Remove Attribute"
                              >
                                <Trash className="w-4.5 h-4.5" />
                              </button>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="text-center py-6 border border-dashed border-slate-200 rounded-xl bg-slate-50/50">
                          <p className="text-xs text-slate-400 font-medium">No attributes defined yet.</p>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {activeTab === "variations" && (
                  <div className="space-y-6 animate-in fade-in duration-150">
                    {/* Variations block */}
                    {productType === "Variable" && (
                      <>
                        {!attributes.some((attr) => attr.usedForVariations) ? (
                          <div className="text-center py-12 border border-dashed border-slate-200 rounded-xl bg-slate-50/50 flex flex-col items-center justify-center p-6 space-y-3">
                            <div className="bg-slate-100 p-3.5 rounded-full text-slate-400">
                              <Plus className="w-8 h-8" />
                            </div>
                            <p className="text-sm font-semibold text-slate-700">Before you can add a variation you need to add some variation attributes on the Attributes tab.</p>
                            <p className="text-xs text-slate-400 max-w-md">Add attributes in the <span className="font-bold text-indigo-600 cursor-pointer hover:underline" onClick={() => setActiveTab("attributes")}>Attributes</span> tab and make sure to check the <strong>Used for variations</strong> box.</p>
                          </div>
                        ) : (
                          <div className="border border-slate-100 rounded-2xl p-5 bg-slate-50/50 space-y-4">
                            <div className="flex items-center justify-between">
                              <h4 className="text-sm font-bold text-slate-700">Product Variations</h4>
                              <button
                                type="button"
                                onClick={handleGenerateVariations}
                                className="bg-indigo-600 text-white font-semibold text-xs px-4 py-2 rounded-xl hover:bg-indigo-700 shadow-md shadow-indigo-600/10 hover:shadow-indigo-600/20 transition-all"
                              >
                                Generate Combinations
                              </button>
                            </div>

                            {variations.length > 0 && (
                              <div className="divide-y divide-slate-200 max-h-96 overflow-y-auto pr-2">
                                {variations.map((v, idx) => (
                                  <div key={idx} className="py-4 space-y-3">
                                    <div className="flex items-center justify-between text-xs font-bold text-slate-700 bg-slate-100 px-3 py-1.5 rounded-lg">
                                      <span>
                                        {Object.entries(v.combination)
                                          .map(([key, val]) => `${key}: ${val}`)
                                          .join(" | ")}
                                      </span>
                                      <button
                                        type="button"
                                        onClick={() => handleRemoveVariation(idx)}
                                        className="text-rose-500 hover:text-rose-700 p-0.5"
                                      >
                                        <Trash className="w-4.5 h-4.5" />
                                      </button>
                                    </div>
                                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                                      <div>
                                        <label className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider mb-1 block">
                                          SKU
                                        </label>
                                        <input
                                          type="text"
                                          value={v.sku}
                                          onChange={(e) => handleUpdateVariation(idx, "sku", e.target.value)}
                                          className="text-xs w-full bg-white border border-slate-200 px-2 py-1.5 rounded-lg focus:outline-hidden"
                                        />
                                      </div>
                                      <div>
                                        <label className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider mb-1 block">
                                          Price ($)
                                        </label>
                                        <input
                                          type="text"
                                          value={v.price}
                                          onChange={(e) => handleUpdateVariation(idx, "price", e.target.value)}
                                          className="text-xs w-full bg-white border border-slate-200 px-2 py-1.5 rounded-lg focus:outline-hidden"
                                        />
                                      </div>
                                      <div>
                                        <label className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider mb-1 block">
                                          Sale ($)
                                        </label>
                                        <input
                                          type="text"
                                          value={v.salePrice}
                                          onChange={(e) => handleUpdateVariation(idx, "salePrice", e.target.value)}
                                          className="text-xs w-full bg-white border border-slate-200 px-2 py-1.5 rounded-lg focus:outline-hidden"
                                        />
                                      </div>
                                      <div>
                                        <label className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider mb-1 block">
                                          Stock
                                        </label>
                                        <input
                                          type="number"
                                          value={v.stock}
                                          onChange={(e) => handleUpdateVariation(idx, "stock", parseInt(e.target.value) || 0)}
                                          className="text-xs w-full bg-white border border-slate-200 px-2 py-1.5 rounded-lg focus:outline-hidden"
                                        />
                                      </div>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            )}
                          </div>
                        )}
                      </>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* 2. Descriptions Block */}
          <div className="bg-white border border-slate-100 rounded-2xl p-6 shadow-xs space-y-5 animate-in fade-in duration-100">
            <h3 className="text-sm font-bold text-slate-705 uppercase tracking-wider border-b border-slate-50 pb-2">
              Descriptions
            </h3>
            <div>
              <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">
                Product Short Description
              </label>
              <RichTextEditor
                value={shortDescription}
                onChange={setShortDescription}
                placeholder="Summary overview of product features..."
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">
                Product Full Description
              </label>
              <RichTextEditor
                value={description}
                onChange={setDescription}
                placeholder="Full specifications, ingredient list, usage instructions..."
              />
            </div>
          </div>
        </div>

        {/* Right 1 Column: Sidebar */}
        <div className="lg:col-span-1 space-y-6">
          {/* Publish Details */}
          <div className="bg-white border border-slate-100 rounded-2xl p-6 shadow-xs space-y-5 animate-in fade-in duration-100">
            <h3 className="text-sm font-bold text-slate-750 uppercase tracking-wider border-b border-slate-50 pb-2">
              Publish Status
            </h3>
            <div>
              <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">
                Status
              </label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                className="w-full text-sm px-4 py-3 bg-slate-50/50 border border-slate-200 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 focus:bg-white transition-all"
              >
                <option value="Published">Published</option>
                <option value="Draft">Draft</option>
              </select>
            </div>
          </div>

          {/* Featured Image */}
          <div className="bg-white border border-slate-100 rounded-2xl p-6 shadow-xs space-y-5 animate-in fade-in duration-100">
            <h3 className="text-sm font-bold text-slate-750 uppercase tracking-wider border-b border-slate-50 pb-2">
              Featured Image
            </h3>
            <div className="flex flex-col gap-4">
              <input
                type="text"
                value={image}
                onChange={(e) => setImage(e.target.value)}
                placeholder="https://example.com/image.jpg"
                className="w-full text-xs px-3 py-2 bg-slate-50/50 border border-slate-200 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
              />
              <label className="w-full text-center bg-indigo-50 hover:bg-indigo-100 text-indigo-600 hover:text-indigo-700 font-semibold text-xs py-2.5 rounded-xl cursor-pointer transition-all border border-indigo-100 flex items-center justify-center gap-2">
                {uploadingFeatured ? "Uploading..." : "Upload File"}
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFeaturedImageUpload}
                  disabled={uploadingFeatured}
                  className="hidden"
                />
              </label>
              {image && (
                <div className="relative aspect-square border border-slate-100 rounded-xl overflow-hidden bg-slate-50 shadow-xs flex items-center justify-center p-2 group">
                  <img src={resolveProductImage(image, slug)} alt="Preview" className="max-h-full max-w-full object-contain" />
                  <button
                    type="button"
                    onClick={() => setImage("")}
                    className="absolute top-2 right-2 bg-rose-600/90 hover:bg-rose-600 text-white rounded-full p-1.5 opacity-95 hover:scale-105 transition-all shadow-md"
                  >
                    <Trash className="w-3.5 h-3.5" />
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Product Gallery */}
          <div className="bg-white border border-slate-100 rounded-2xl p-6 shadow-xs space-y-5 animate-in fade-in duration-100">
            <h3 className="text-sm font-bold text-slate-750 uppercase tracking-wider border-b border-slate-50 pb-2">
              Product Gallery
            </h3>
            <div className="space-y-4">
              <label className="border-2 border-dashed border-slate-200 hover:border-indigo-400 rounded-2xl p-6 flex flex-col items-center justify-center bg-slate-50/50 hover:bg-slate-50/80 cursor-pointer transition-all group text-center">
                <ImageIcon className="w-8 h-8 text-slate-400 mb-2 group-hover:text-indigo-500 transition-colors" />
                <p className="text-xs font-semibold text-slate-650">
                  {uploadingGallery ? "Uploading..." : "Click to upload gallery"}
                </p>
                <input
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={handleGalleryUpload}
                  disabled={uploadingGallery}
                  className="hidden"
                />
              </label>
              {gallery.length > 0 && (
                <div className="grid grid-cols-3 gap-2">
                  {gallery.map((imgUrl, index) => (
                    <div
                      key={index}
                      className="relative aspect-square border border-slate-100 rounded-lg overflow-hidden bg-slate-50 flex items-center justify-center p-1 group shadow-xs"
                    >
                      <img
                        src={resolveProductImage(imgUrl, `${slug}-${index}`)}
                        alt={`Gallery ${index + 1}`}
                        className="max-h-full max-w-full object-contain"
                      />
                      <button
                        type="button"
                        onClick={() => handleRemoveGalleryImage(index)}
                        className="absolute top-1 right-1 bg-rose-600/90 hover:bg-rose-600 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-all hover:scale-105 shadow-md"
                      >
                        <Trash className="w-3 h-3" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </form>
  );
}
