import React, { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import API from "../services/api";
import Loader from "../components/Loader";
import toast from "react-hot-toast";
import {
  Save,
  Shield,
  Settings as SettingsIcon,
  Plus,
  Trash2,
  Edit,
  MapPin,
  CreditCard,
  Truck,
  Globe,
  Percent,
  Coins,
  ChevronDown,
  Info
} from "lucide-react";import { countries } from "../data/countries";

function SearchableSelect({ label, value, onChange, placeholder, options }) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const dropdownRef = React.useRef(null);

  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const filtered = React.useMemo(() => {
    const term = searchTerm.trim().toLowerCase();
    return options.map(group => {
      let filteredOpts = group.options;
      if (term) {
        filteredOpts = filteredOpts.filter(opt =>
          opt.toLowerCase().includes(term)
        );
      }
      
      const totalCount = filteredOpts.length;
      const slicedOpts = filteredOpts.slice(0, 40);
      
      return {
        ...group,
        options: slicedOpts,
        hasMore: totalCount > 40,
        remainingCount: totalCount - 40
      };
    }).filter(group => group.options.length > 0);
  }, [options, searchTerm]);

  return (
    <div className="relative w-full" ref={dropdownRef}>
      {label && (
        <label className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider mb-1.5 block">
          {label}
        </label>
      )}
      <div
        onClick={() => setIsOpen(!isOpen)}
        className="w-full text-xs font-semibold px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl flex items-center justify-between cursor-pointer hover:bg-slate-100/50 focus-within:ring-2 focus-within:ring-indigo-500/20 transition-all"
      >
        <span className={value ? "text-slate-800 font-semibold" : "text-slate-400"}>
          {value || placeholder || "Select..."}
        </span>
        <ChevronDown className="w-4 h-4 text-slate-400" />
      </div>

      {isOpen && (
        <div className="absolute left-0 right-0 mt-1 bg-white border border-slate-100 rounded-xl shadow-xl z-50 max-h-60 overflow-y-auto animate-in fade-in slide-in-from-top-1 duration-150">
          <div className="p-2 border-b border-slate-50 sticky top-0 bg-white">
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Type to search..."
              className="w-full text-xs px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-lg focus:outline-hidden focus:bg-white focus:border-indigo-500"
              autoFocus
            />
          </div>
          <div className="py-1">
            {filtered.length === 0 ? (
              <div className="px-4 py-2 text-xs text-slate-400">No regions found</div>
            ) : (
              filtered.map(group => (
                <div key={group.group}>
                  <div className="px-3 py-1 text-[9px] font-extrabold text-slate-400 uppercase tracking-wider bg-slate-50/50">
                    {group.group}
                  </div>
                  <div className="divide-y divide-slate-50">
                    {group.options.map(opt => (
                      <div
                        key={opt}
                        onClick={() => {
                          onChange(opt);
                          setIsOpen(false);
                          setSearchTerm("");
                        }}
                        className={`px-4 py-2 text-xs font-semibold cursor-pointer hover:bg-indigo-50/50 hover:text-indigo-600 transition-all ${
                          value === opt ? "bg-indigo-50/30 text-indigo-600" : "text-slate-600"
                        }`}
                      >
                        {opt}
                      </div>
                    ))}
                    {group.hasMore && (
                      <div className="px-4 py-2.5 text-[9px] font-medium italic text-slate-400 bg-slate-50/30 border-t border-slate-100">
                        Type to search more... (+{group.remainingCount} options in {group.group})
                      </div>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}

function TreeCheckbox({ checked, indeterminate, onChange, className }) {
  const ref = React.useRef(null);
  
  React.useEffect(() => {
    if (ref.current) {
      ref.current.indeterminate = indeterminate;
    }
  }, [indeterminate]);
  
  return (
    <input
      ref={ref}
      type="checkbox"
      checked={checked}
      onChange={onChange}
      className={`w-4 h-4 text-indigo-600 border-slate-300 rounded-sm focus:ring-indigo-500/20 cursor-pointer ${className}`}
    />
  );
}

function HierarchicalRegionSelect({ label, value, onChange, placeholder, options }) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [expandedNodes, setExpandedNodes] = useState({ Everywhere: true });
  const dropdownRef = React.useRef(null);

  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const treeData = React.useMemo(() => {
    const everywhereNode = {
      id: "Everywhere",
      name: "Everywhere",
      level: 0,
      children: []
    };

    options.forEach(group => {
      const continentNode = {
        id: group.group,
        name: group.group,
        level: 1,
        children: []
      };
      
      const countryMap = new Map();
      
      group.options.forEach(opt => {
        if (opt.includes(" — ")) {
          const [countryName, stateName] = opt.split(" — ");
          if (!countryMap.has(countryName)) {
            countryMap.set(countryName, {
              id: countryName,
              name: countryName,
              level: 2,
              children: []
            });
          }
          countryMap.get(countryName).children.push({
            id: opt,
            name: stateName,
            level: 3,
            children: []
          });
        } else {
          if (!countryMap.has(opt)) {
            countryMap.set(opt, {
              id: opt,
              name: opt,
              level: 2,
              children: []
            });
          }
        }
      });
      
      continentNode.children = Array.from(countryMap.values());
      everywhereNode.children.push(continentNode);
    });
    
    return [everywhereNode];
  }, [options]);

  const selectedSet = React.useMemo(() => {
    const set = new Set();
    if (!value) return set;
    
    const savedItems = value.split(", ").map(s => s.trim());
    
    const checkRecursively = (node) => {
      set.add(node.id);
      if (node.children) {
        node.children.forEach(child => checkRecursively(child));
      }
    };
    
    const process = (node) => {
      if (savedItems.includes(node.id)) {
        checkRecursively(node);
        return;
      }
      if (node.children) {
        node.children.forEach(child => process(child));
      }
    };
    
    treeData.forEach(root => process(root));
    
    const updateParents = (node) => {
      if (node.children && node.children.length > 0) {
        node.children.forEach(child => updateParents(child));
        const allChildrenChecked = node.children.every(child => set.has(child.id));
        if (allChildrenChecked) {
          set.add(node.id);
        }
      }
    };
    treeData.forEach(root => updateParents(root));
    
    return set;
  }, [treeData, value]);

  const selectedListForDisplay = React.useMemo(() => {
    if (!value) return [];
    return value.split(", ");
  }, [value]);

  const getDescendantIds = React.useCallback((node) => {
    const ids = [];
    const traverse = (n) => {
      if (n.children) {
        n.children.forEach(child => {
          ids.push(child.id);
          traverse(child);
        });
      }
    };
    traverse(node);
    return ids;
  }, []);

  const getAncestors = React.useCallback((nodes, targetId) => {
    const path = [];
    const traverse = (nodeList, currentPath) => {
      for (const node of nodeList) {
        if (node.id === targetId) {
          path.push(...currentPath);
          return true;
        }
        if (node.children && node.children.length > 0) {
          if (traverse(node.children, [...currentPath, node])) {
            return true;
          }
        }
      }
      return false;
    };
    traverse(nodes, []);
    return path;
  }, []);

  const handleCheck = (node, isChecked) => {
    let newSelected = new Set(selectedSet);
    const descendants = getDescendantIds(node);
    
    if (isChecked) {
      newSelected.add(node.id);
      descendants.forEach(id => newSelected.add(id));
      
      const ancestors = getAncestors(treeData, node.id);
      ancestors.reverse().forEach(ancestor => {
        const allChildrenChecked = ancestor.children.every(child => newSelected.has(child.id));
        if (allChildrenChecked) {
          newSelected.add(ancestor.id);
        }
      });
    } else {
      newSelected.delete(node.id);
      descendants.forEach(id => newSelected.delete(id));
      
      const ancestors = getAncestors(treeData, node.id);
      ancestors.forEach(ancestor => newSelected.delete(ancestor.id));
    }

    const results = [];
    const collect = (n) => {
      if (newSelected.has(n.id)) {
        results.push(n.id);
        return;
      }
      if (n.children) {
        n.children.forEach(child => collect(child));
      }
    };

    if (newSelected.has("Everywhere")) {
      onChange("Everywhere");
    } else {
      treeData[0].children.forEach(child => collect(child));
      onChange(results.join(", "));
    }
  };

  const isNodeIndeterminate = React.useCallback((node) => {
    if (selectedSet.has(node.id)) return false;
    const descendants = getDescendantIds(node);
    return descendants.some(id => selectedSet.has(id));
  }, [selectedSet, getDescendantIds]);

  const filteredTree = React.useMemo(() => {
    const term = searchTerm.trim().toLowerCase();
    if (!term) return treeData;

    const filterNode = (node) => {
      const isMatch = node.name.toLowerCase().includes(term) || node.id.toLowerCase().includes(term);
      let filteredChildren = [];
      if (node.children) {
        filteredChildren = node.children
          .map(child => filterNode(child))
          .filter(child => child !== null);
      }
      if (isMatch || filteredChildren.length > 0) {
        return {
          ...node,
          children: filteredChildren
        };
      }
      return null;
    };

    return treeData
      .map(node => filterNode(node))
      .filter(node => node !== null);
  }, [treeData, searchTerm]);

  const visibleNodes = React.useMemo(() => {
    const list = [];
    const traverse = (nodeList) => {
      nodeList.forEach(node => {
        list.push(node);
        const isExpanded = searchTerm.trim() || !!expandedNodes[node.id];
        if (node.children && node.children.length > 0 && isExpanded) {
          traverse(node.children);
        }
      });
    };
    traverse(filteredTree);
    return list;
  }, [filteredTree, expandedNodes, searchTerm]);

  const toggleExpand = (nodeId) => {
    setExpandedNodes(prev => ({
      ...prev,
      [nodeId]: !prev[nodeId]
    }));
  };

  return (
    <div className="relative w-full" ref={dropdownRef}>
      {label && (
        <label className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider mb-1.5 block">
          {label}
        </label>
      )}
      <div
        onClick={() => setIsOpen(!isOpen)}
        className="w-full text-xs font-semibold px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl flex items-center justify-between cursor-pointer hover:bg-slate-100/50 focus-within:ring-2 focus-within:ring-indigo-500/20 transition-all min-h-[40px]"
      >
        <div className="flex flex-wrap gap-1 pr-4 max-h-[100px] overflow-y-auto">
          {selectedListForDisplay.length === 0 ? (
            <span className="text-slate-400">{placeholder || "Select..."}</span>
          ) : (
            selectedListForDisplay.slice(0, 3).map(item => (
              <span key={item} className="px-2 py-0.5 bg-indigo-50 text-indigo-600 border border-indigo-100 rounded-md text-[10px] font-bold">
                {item}
              </span>
            ))
          )}
          {selectedListForDisplay.length > 3 && (
            <span className="px-2 py-0.5 bg-slate-100 text-slate-600 border border-slate-200 rounded-md text-[10px] font-bold">
              +{selectedListForDisplay.length - 3} more
            </span>
          )}
        </div>
        <ChevronDown className="w-4 h-4 text-slate-400 shrink-0" />
      </div>

      {isOpen && (
        <div className="absolute left-0 right-0 mt-1 bg-white border border-slate-100 rounded-xl shadow-xl z-50 max-h-72 overflow-y-auto animate-in fade-in slide-in-from-top-1 duration-150">
          <div className="p-2 border-b border-slate-50 sticky top-0 bg-white z-10">
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Type to search regions..."
              className="w-full text-xs px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-lg focus:outline-hidden focus:bg-white focus:border-indigo-500"
              autoFocus
            />
          </div>
          <div className="py-2 divide-y divide-slate-50">
            {visibleNodes.length === 0 ? (
              <div className="px-4 py-3 text-xs text-slate-400 text-center">No regions found</div>
            ) : (
              visibleNodes.map(node => {
                const hasChildren = node.children && node.children.length > 0;
                const isExpanded = searchTerm.trim() || !!expandedNodes[node.id];
                const isChecked = selectedSet.has(node.id);
                const isIndeterminate = isNodeIndeterminate(node);

                let indentClass = "pl-3";
                if (node.level === 1) indentClass = "pl-8";
                else if (node.level === 2) indentClass = "pl-14";
                else if (node.level === 3) indentClass = "pl-20";

                return (
                  <div
                    key={node.id}
                    className={`flex items-center py-2.5 pr-4 hover:bg-slate-50/50 transition-all ${indentClass}`}
                  >
                    {hasChildren ? (
                      <button
                        type="button"
                        onClick={() => toggleExpand(node.id)}
                        className="w-5 h-5 flex items-center justify-center text-slate-400 hover:text-slate-600 rounded-md hover:bg-slate-100 transition-all mr-1.5 shrink-0"
                      >
                        {isExpanded ? (
                          <svg className="w-3 h-3" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
                          </svg>
                        ) : (
                          <svg className="w-3 h-3 -rotate-90" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
                          </svg>
                        )}
                      </button>
                    ) : (
                      <div className="w-5 mr-1.5 shrink-0" />
                    )}

                    <TreeCheckbox
                      checked={isChecked}
                      indeterminate={isIndeterminate}
                      onChange={(e) => handleCheck(node, e.target.checked)}
                      className="mr-2.5"
                    />

                    <span
                      onClick={() => handleCheck(node, !isChecked)}
                      className={`text-xs font-semibold select-none cursor-pointer ${
                        isChecked ? "text-indigo-600 font-bold" : "text-slate-600"
                      }`}
                    >
                      {node.name}
                    </span>
                  </div>
                );
              })
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default function Settings() {
  const queryClient = useQueryClient();
  const [activeTab, setActiveTab] = useState("general");

  // Existing Site Settings States
  const [websiteName, setWebsiteName] = useState("");
  const [logo, setLogo] = useState("");
  const [favicon, setFavicon] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [defaultMetaTitle, setDefaultMetaTitle] = useState("");
  const [defaultMetaDescription, setDefaultMetaDescription] = useState("");
  const [facebook, setFacebook] = useState("");
  const [instagram, setInstagram] = useState("");
  const [twitter, setTwitter] = useState("");
  const [youtube, setYoutube] = useState("");

  // WooCommerce General Tab States
  const [addressLine1, setAddressLine1] = useState("");
  const [addressLine2, setAddressLine2] = useState("");
  const [city, setCity] = useState("");
  const [countryState, setCountryState] = useState("India — Maharashtra");
  const [postcodeZip, setPostcodeZip] = useState("");

  const [sellingLocations, setSellingLocations] = useState("Sell to all countries");
  const [shippingLocations, setShippingLocations] = useState("Ship to all countries you sell to");
  const [defaultCustomerLocation, setDefaultCustomerLocation] = useState("Shop country/region");
  const [addressAutocomplete, setAddressAutocomplete] = useState(false);

  const [enableTaxes, setEnableTaxes] = useState(false);
  const [enableCoupons, setEnableCoupons] = useState(true);
  const [calculateCouponsSequentially, setCalculateCouponsSequentially] = useState(false);

  const [currency, setCurrency] = useState("United States dollar ($) — USD");
  const [currencyPosition, setCurrencyPosition] = useState("Left");
  const [thousandSeparator, setThousandSeparator] = useState(",");
  const [decimalSeparator, setDecimalSeparator] = useState(".");
  const [numberOfDecimals, setNumberOfDecimals] = useState(2);

  // Shipping Tab States
  const [shippingSubTab, setShippingSubTab] = useState("zones");
  const [shippingZones, setShippingZones] = useState([]);
  
  // Shipping Settings & Classes States
  const [calcOnCart, setCalcOnCart] = useState(true);
  const [hideCostsUntilAddr, setHideCostsUntilAddr] = useState(false);
  const [shippingDest, setShippingDest] = useState("default_customer");
  const [shippingClasses, setShippingClasses] = useState([
    { id: "heavy-goods", name: "Heavy Goods", slug: "heavy-goods", count: 0, description: "For bulky weight products" },
    { id: "standard", name: "Standard Class", slug: "standard", count: 0, description: "Default shipping category" }
  ]);
  const [showAddClassInput, setShowAddClassInput] = useState(false);
  const [newClassName, setNewClassName] = useState("");
  const [newClassSlug, setNewClassSlug] = useState("");
  const [newClassDesc, setNewClassDesc] = useState("");

  // Local Pickup States
  const [enableLocalPickup, setEnableLocalPickup] = useState(false);
  const [pickupLocationName, setPickupLocationName] = useState("");
  const [pickupAddress, setPickupAddress] = useState("");

  // Shipping Zone Modal States
  const [showZoneModal, setShowZoneModal] = useState(false);
  const [currentZone, setCurrentZone] = useState(null); // null if adding, object if editing
  const [modalZoneName, setModalZoneName] = useState("");
  const [modalZoneRegions, setModalZoneRegions] = useState("");
  const [modalZoneMethods, setModalZoneMethods] = useState("");

  // Payment Providers States
  const [stripeInstalled, setStripeInstalled] = useState(false);
  const [stripeEnabled, setStripeEnabled] = useState(false);
  const [paypalInstalled, setPaypalInstalled] = useState(false);
  const [paypalEnabled, setPaypalEnabled] = useState(false);
  const [offlineEnabled, setOfflineEnabled] = useState(true);
  const [codEnabled, setCodEnabled] = useState(true);
  const [bankTransferEnabled, setBankTransferEnabled] = useState(false);
  
  // Expandable sections
  const [showMorePayments, setShowMorePayments] = useState(false);
  const [razorpayEnabled, setRazorpayEnabled] = useState(false);
  const [payuEnabled, setPayuEnabled] = useState(false);
  const [payoneerEnabled, setPayoneerEnabled] = useState(false);
  const [visaEnabled, setVisaEnabled] = useState(false);

  // Fetch Settings
  const { data: settingsData, isLoading } = useQuery({
    queryKey: ["settings"],
    queryFn: async () => {
      const res = await API.get("/settings");
      return res.data;
    },
  });

  useEffect(() => {
    if (settingsData) {
      if (settingsData.general) {
        setWebsiteName(settingsData.general.websiteName || "");
        setLogo(settingsData.general.logo || "");
        setFavicon(settingsData.general.favicon || "");
      }
      if (settingsData.contact) {
        setEmail(settingsData.contact.email || "");
        setPhone(settingsData.contact.phone || "");
        setAddress(settingsData.contact.address || "");
      }
      if (settingsData.seo) {
        setDefaultMetaTitle(settingsData.seo.defaultMetaTitle || "");
        setDefaultMetaDescription(settingsData.seo.defaultMetaDescription || "");
      }
      if (settingsData.socialMedia) {
        setFacebook(settingsData.socialMedia.facebook || "");
        setInstagram(settingsData.socialMedia.instagram || "");
        setTwitter(settingsData.socialMedia.twitter || "");
        setYoutube(settingsData.socialMedia.youtube || "");
      }
      // Populate WC general settings
      if (settingsData.storeAddress) {
        setAddressLine1(settingsData.storeAddress.addressLine1 || "");
        setAddressLine2(settingsData.storeAddress.addressLine2 || "");
        setCity(settingsData.storeAddress.city || "");
        setCountryState(settingsData.storeAddress.countryState || "India — Maharashtra");
        setPostcodeZip(settingsData.storeAddress.postcodeZip || "");
      }
      if (settingsData.generalOptions) {
        setSellingLocations(settingsData.generalOptions.sellingLocations || "Sell to all countries");
        setShippingLocations(settingsData.generalOptions.shippingLocations || "Ship to all countries you sell to");
        setDefaultCustomerLocation(settingsData.generalOptions.defaultCustomerLocation || "Shop country/region");
        setAddressAutocomplete(!!settingsData.generalOptions.addressAutocomplete);
      }
      if (settingsData.taxesAndCoupons) {
        setEnableTaxes(!!settingsData.taxesAndCoupons.enableTaxes);
        setEnableCoupons(!!settingsData.taxesAndCoupons.enableCoupons);
        setCalculateCouponsSequentially(!!settingsData.taxesAndCoupons.calculateCouponsSequentially);
      }
      if (settingsData.currencyOptions) {
        setCurrency(settingsData.currencyOptions.currency || "United States dollar ($) — USD");
        setCurrencyPosition(settingsData.currencyOptions.currencyPosition || "Left");
        setThousandSeparator(settingsData.currencyOptions.thousandSeparator || ",");
        setDecimalSeparator(settingsData.currencyOptions.decimalSeparator || ".");
        setNumberOfDecimals(settingsData.currencyOptions.numberOfDecimals ?? 2);
      }
      if (settingsData.shippingZones) {
        setShippingZones(settingsData.shippingZones);
      }
      if (settingsData.paymentProviders) {
        setStripeInstalled(!!settingsData.paymentProviders.stripe?.installed);
        setStripeEnabled(!!settingsData.paymentProviders.stripe?.enabled);
        setPaypalInstalled(!!settingsData.paymentProviders.paypal?.installed);
        setPaypalEnabled(!!settingsData.paymentProviders.paypal?.enabled);
        setOfflineEnabled(!!settingsData.paymentProviders.offline?.enabled);
        setCodEnabled(!!settingsData.paymentProviders.offline?.cod);
        setBankTransferEnabled(!!settingsData.paymentProviders.offline?.bankTransfer);
        if (settingsData.paymentProviders.others) {
          setRazorpayEnabled(!!settingsData.paymentProviders.others.razorpay);
          setPayuEnabled(!!settingsData.paymentProviders.others.payu);
          setPayoneerEnabled(!!settingsData.paymentProviders.others.payoneer);
          setVisaEnabled(!!settingsData.paymentProviders.others.visa);
        }
      }
    }
  }, [settingsData]);

  const saveMutation = useMutation({
    mutationFn: async (payload) => {
      return await API.put("/settings", payload);
    },
    onSuccess: () => {
      toast.success("Settings saved successfully");
      queryClient.invalidateQueries(["settings"]);
    },
    onError: (err) => {
      toast.error(err.response?.data?.message || "Failed to save settings");
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    saveMutation.mutate({
      general: { websiteName, logo, favicon },
      contact: { email, phone, address },
      seo: { defaultMetaTitle, defaultMetaDescription },
      socialMedia: { facebook, instagram, twitter, youtube },
      storeAddress: { addressLine1, addressLine2, city, countryState, postcodeZip },
      generalOptions: { sellingLocations, shippingLocations, defaultCustomerLocation, addressAutocomplete },
      taxesAndCoupons: { enableTaxes, enableCoupons, calculateCouponsSequentially },
      currencyOptions: { currency, currencyPosition, thousandSeparator, decimalSeparator, numberOfDecimals },
      shippingZones,
      paymentProviders: {
        stripe: { installed: stripeInstalled, enabled: stripeEnabled },
        paypal: { installed: paypalInstalled, enabled: paypalEnabled },
        offline: { enabled: offlineEnabled, cod: codEnabled, bankTransfer: bankTransferEnabled },
        others: { razorpay: razorpayEnabled, payu: payuEnabled, payoneer: payoneerEnabled, visa: visaEnabled },
      },
    });
  };

  // Shipping Zones Modal Helpers
  const handleOpenZoneModal = (zone = null) => {
    if (zone) {
      setCurrentZone(zone);
      setModalZoneName(zone.name);
      setModalZoneRegions(zone.regions);
      setModalZoneMethods(zone.methods === "No shipping methods offered to this zone." ? "" : zone.methods);
    } else {
      setCurrentZone(null);
      setModalZoneName("");
      setModalZoneRegions("");
      setModalZoneMethods("");
    }
    setShowZoneModal(true);
  };

  const handleSaveZone = () => {
    if (!modalZoneName || !modalZoneRegions) {
      return toast.error("Please enter a zone name and region.");
    }
    const methodsDisplay = modalZoneMethods.trim() || "No shipping methods offered to this zone.";
    
    if (currentZone) {
      // Editing
      setShippingZones(prev =>
        prev.map(z => z.id === currentZone.id ? { ...z, name: modalZoneName, regions: modalZoneRegions, methods: methodsDisplay } : z)
      );
      toast.success("Zone updated locally. Click Save Configuration to persist.");
    } else {
      // Adding
      const newZone = {
        id: "zone_" + Date.now(),
        name: modalZoneName,
        regions: modalZoneRegions,
        methods: methodsDisplay,
        isDefault: false
      };
      setShippingZones(prev => [newZone, ...prev]);
      toast.success("Zone added locally. Click Save Configuration to persist.");
    }
    setShowZoneModal(false);
  };

  const handleDeleteZone = (id) => {
    setShippingZones(prev => prev.filter(z => z.id !== id));
    toast.success("Zone deleted locally. Click Save Configuration to persist.");
  };

  const handleAddShippingClass = () => {
    if (!newClassName || !newClassSlug) {
      return toast.error("Class Name and Slug are required.");
    }
    const newClass = {
      id: "class_" + Date.now(),
      name: newClassName,
      slug: newClassSlug,
      count: 0,
      description: newClassDesc
    };
    setShippingClasses(prev => [...prev, newClass]);
    setNewClassName("");
    setNewClassSlug("");
    setNewClassDesc("");
    setShowAddClassInput(false);
    toast.success("Shipping class added!");
  };

  const handleDeleteShippingClass = (id) => {
    setShippingClasses(prev => prev.filter(c => c.id !== id));
    toast.success("Shipping class removed!");
  };

  if (isLoading) return <Loader size="lg" />;

  const tabs = [
    { id: "general", label: "General Settings" },
    { id: "contact", label: "Contact Details" },
    { id: "seo", label: "Default SEO" },
    { id: "social", label: "Social Media Links" },
    { id: "wooGeneral", label: "General (WooCommerce)" },
    { id: "shipping", label: "Shipping" },
    { id: "payment", label: "Payments" },
  ];

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-5xl mx-auto relative">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-slate-100 pb-4">
        <div>
          <h1 className="text-xl font-bold text-slate-800">Settings Dashboard</h1>
          <p className="text-xs text-slate-400 mt-0.5 font-medium">Configure company info, SEO details, WooCommerce-style taxes, shipping, and payment options.</p>
        </div>
        <button
          type="submit"
          disabled={saveMutation.isLoading}
          className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-sm px-5 py-2.5 rounded-xl shadow-lg shadow-indigo-600/10 hover:shadow-indigo-600/20 transition-all flex items-center gap-2"
        >
          <Save className="w-4.5 h-4.5" /> Save Configuration
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {/* Navigation Tabs */}
        <div className="bg-white border border-slate-100 rounded-2xl p-4 flex flex-col gap-1.5 h-fit shadow-xs">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id)}
              className={`text-left text-sm font-semibold px-4 py-2.5 rounded-xl transition-all ${
                activeTab === tab.id
                  ? "bg-indigo-50 text-indigo-600"
                  : "text-slate-500 hover:bg-slate-50 hover:text-slate-800"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Content Card */}
        <div className="bg-white border border-slate-100 rounded-2xl p-6 shadow-xs md:col-span-3">
          {/* General Tab */}
          {activeTab === "general" && (
            <div className="space-y-5 animate-in fade-in duration-150">
              <h3 className="text-sm font-bold text-slate-700 flex items-center gap-1.5 border-b border-slate-50 pb-2">
                <SettingsIcon className="w-4.5 h-4.5 text-slate-400" /> General Website Settings
              </h3>
              <div>
                <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2 block">
                  Website Title Name
                </label>
                <input
                  type="text"
                  value={websiteName}
                  onChange={(e) => setWebsiteName(e.target.value)}
                  placeholder="e.g. NutraFyi Supplements Store"
                  className="w-full text-sm px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-indigo-500/20 focus:bg-white transition-all"
                />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div>
                  <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2 block">
                    Logo Image URL
                  </label>
                  <input
                    type="text"
                    value={logo}
                    onChange={(e) => setLogo(e.target.value)}
                    placeholder="https://example.com/logo.png"
                    className="w-full text-sm px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-indigo-500/20 focus:bg-white transition-all"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2 block">
                    Favicon Icon URL
                  </label>
                  <input
                    type="text"
                    value={favicon}
                    onChange={(e) => setFavicon(e.target.value)}
                    placeholder="https://example.com/favicon.ico"
                    className="w-full text-sm px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-indigo-500/20 focus:bg-white transition-all"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Contact Tab */}
          {activeTab === "contact" && (
            <div className="space-y-5 animate-in fade-in duration-150">
              <h3 className="text-sm font-bold text-slate-700 flex items-center gap-1.5 border-b border-slate-50 pb-2">
                <SettingsIcon className="w-4.5 h-4.5 text-slate-400" /> Company Contact Information
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div>
                  <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2 block">
                    Support Email Address
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="support@nutrafyi.com"
                    className="w-full text-sm px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-indigo-500/20 focus:bg-white transition-all"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2 block">
                    Support Phone Number
                  </label>
                  <input
                    type="text"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+1 800 555 0199"
                    className="w-full text-sm px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-indigo-500/20 focus:bg-white transition-all"
                  />
                </div>
              </div>
              <div>
                <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2 block">
                  Office HQ Address
                </label>
                <textarea
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  rows={3}
                  placeholder="100 Innovation Way, Suite 400, NY 10001"
                  className="w-full text-sm px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-indigo-500/20 focus:bg-white transition-all"
                />
              </div>
            </div>
          )}

          {/* SEO Tab */}
          {activeTab === "seo" && (
            <div className="space-y-5 animate-in fade-in duration-150">
              <h3 className="text-sm font-bold text-slate-700 flex items-center gap-1.5 border-b border-slate-50 pb-2">
                <Shield className="w-4.5 h-4.5 text-slate-400" /> Default SEO Configurations
              </h3>
              <div>
                <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2 block">
                  Default Meta Title
                </label>
                <input
                  type="text"
                  value={defaultMetaTitle}
                  onChange={(e) => setDefaultMetaTitle(e.target.value)}
                  placeholder="NutraFyi | Pure Dietary Supplements & Vitamins"
                  className="w-full text-sm px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-indigo-500/20 focus:bg-white transition-all"
                />
              </div>
              <div>
                <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2 block">
                  Default Meta Description
                </label>
                <textarea
                  value={defaultMetaDescription}
                  onChange={(e) => setDefaultMetaDescription(e.target.value)}
                  rows={4}
                  placeholder="Shop highest-quality dietary supplements, proteins, and vitamins..."
                  className="w-full text-sm px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-indigo-500/20 focus:bg-white transition-all"
                />
              </div>
            </div>
          )}

          {/* Social Tab */}
          {activeTab === "social" && (
            <div className="space-y-5 animate-in fade-in duration-150">
              <h3 className="text-sm font-bold text-slate-700 flex items-center gap-1.5 border-b border-slate-50 pb-2">
                <SettingsIcon className="w-4.5 h-4.5 text-slate-400" /> Social Networks Links
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div>
                  <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2 block">
                    Facebook Page
                  </label>
                  <input
                    type="text"
                    value={facebook}
                    onChange={(e) => setFacebook(e.target.value)}
                    placeholder="https://facebook.com/nutrafyi"
                    className="w-full text-sm px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-indigo-500/20 focus:bg-white transition-all"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2 block">
                    Instagram Handle
                  </label>
                  <input
                    type="text"
                    value={instagram}
                    onChange={(e) => setInstagram(e.target.value)}
                    placeholder="https://instagram.com/nutrafyi"
                    className="w-full text-sm px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-indigo-500/20 focus:bg-white transition-all"
                  />
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div>
                  <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2 block">
                    Twitter Profile
                  </label>
                  <input
                    type="text"
                    value={twitter}
                    onChange={(e) => setTwitter(e.target.value)}
                    placeholder="https://twitter.com/nutrafyi"
                    className="w-full text-sm px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-indigo-500/20 focus:bg-white transition-all"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2 block">
                    YouTube Channel
                  </label>
                  <input
                    type="text"
                    value={youtube}
                    onChange={(e) => setYoutube(e.target.value)}
                    placeholder="https://youtube.com/c/nutrafyi"
                    className="w-full text-sm px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-indigo-500/20 focus:bg-white transition-all"
                  />
                </div>
              </div>
            </div>
          )}

          {/* WooCommerce General Settings Tab */}
          {activeTab === "wooGeneral" && (
            <div className="space-y-8 animate-in fade-in duration-150">
              {/* Store Address */}
              <div className="space-y-4">
                <h3 className="text-sm font-bold text-slate-700 flex items-center gap-1.5 border-b border-slate-50 pb-2">
                  <MapPin className="w-4.5 h-4.5 text-indigo-500" /> Store Address
                </h3>
                <p className="text-[11px] text-slate-400">This is where your business is located. Tax rates and shipping rates will use this address.</p>
                
                <div className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider mb-1.5 block">
                        Address line 1
                      </label>
                      <input
                        type="text"
                        value={addressLine1}
                        onChange={(e) => setAddressLine1(e.target.value)}
                        placeholder="e.g. 123 Main Road"
                        className="w-full text-sm px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-indigo-500/20 focus:bg-white transition-all"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider mb-1.5 block">
                        Address line 2
                      </label>
                      <input
                        type="text"
                        value={addressLine2}
                        onChange={(e) => setAddressLine2(e.target.value)}
                        placeholder="e.g. Apartment, Suite, Unit"
                        className="w-full text-sm px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-indigo-500/20 focus:bg-white transition-all"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div>
                      <label className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider mb-1.5 block">
                        City
                      </label>
                      <input
                        type="text"
                        value={city}
                        onChange={(e) => setCity(e.target.value)}
                        placeholder="e.g. Mumbai"
                        className="w-full text-sm px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-indigo-500/20 focus:bg-white transition-all"
                      />
                    </div>
                    <SearchableSelect
                      label="Country / State"
                      value={countryState}
                      onChange={setCountryState}
                      options={countries}
                      placeholder="Select Country/State..."
                    />
                    <div>
                      <label className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider mb-1.5 block">
                        Postcode / ZIP
                      </label>
                      <input
                        type="text"
                        value={postcodeZip}
                        onChange={(e) => setPostcodeZip(e.target.value)}
                        placeholder="e.g. 400001"
                        className="w-full text-sm px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-indigo-500/20 focus:bg-white transition-all"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* General Options */}
              <div className="space-y-4 pt-4 border-t border-slate-100">
                <h3 className="text-sm font-bold text-slate-700 flex items-center gap-1.5 border-b border-slate-50 pb-2">
                  <Globe className="w-4.5 h-4.5 text-emerald-500" /> General Options
                </h3>
                
                <div className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider mb-1.5 block">
                        Selling location(s)
                      </label>
                      <select
                        value={sellingLocations}
                        onChange={(e) => setSellingLocations(e.target.value)}
                        className="w-full text-sm px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-hidden"
                      >
                        <option value="Sell to all countries">Sell to all countries</option>
                        <option value="Sell to specific countries only">Sell to specific countries only</option>
                      </select>
                    </div>
                    <div>
                      <label className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider mb-1.5 block">
                        Shipping location(s)
                      </label>
                      <select
                        value={shippingLocations}
                        onChange={(e) => setShippingLocations(e.target.value)}
                        className="w-full text-sm px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-hidden"
                      >
                        <option value="Ship to all countries you sell to">Ship to all countries you sell to</option>
                        <option value="Ship to specific countries only">Ship to specific countries only</option>
                        <option value="Disable shipping & shipping calculations">Disable shipping & shipping calculations</option>
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider mb-1.5 block">
                        Default customer location
                      </label>
                      <select
                        value={defaultCustomerLocation}
                        onChange={(e) => setDefaultCustomerLocation(e.target.value)}
                        className="w-full text-sm px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-hidden"
                      >
                        <option value="Shop country/region">Shop country/region</option>
                        <option value="Geolocate">Geolocate</option>
                        <option value="No location by default">No location by default</option>
                      </select>
                    </div>
                  </div>

                  <div className="pt-2">
                    <label className="flex items-start gap-2.5 text-xs text-slate-600 font-medium cursor-pointer select-none">
                      <input
                        type="checkbox"
                        checked={addressAutocomplete}
                        onChange={(e) => setAddressAutocomplete(e.target.checked)}
                        className="rounded border-slate-300 text-indigo-500 focus:ring-indigo-500/20 bg-slate-50 w-4 h-4 mt-0.5"
                      />
                      <div>
                        <span className="block font-semibold text-slate-700">Address autocomplete</span>
                        <span className="text-[10px] text-slate-400 block font-normal mt-0.5">
                          Enable predictive address search. Suggest full addresses to customers as they type. Requires a plugin with predictive address search support (e.g. WooPayments).
                        </span>
                      </div>
                    </label>
                  </div>
                </div>
              </div>

              {/* Taxes and Coupons */}
              <div className="space-y-4 pt-4 border-t border-slate-100">
                <h3 className="text-sm font-bold text-slate-700 flex items-center gap-1.5 border-b border-slate-50 pb-2">
                  <Percent className="w-4.5 h-4.5 text-rose-500" /> Taxes and coupons
                </h3>
                <p className="text-[11px] text-slate-400">Enable taxes and coupons and configure how they are calculated.</p>

                <div className="space-y-4 pl-1">
                  <label className="flex items-start gap-2.5 text-xs text-slate-600 font-medium cursor-pointer select-none">
                    <input
                      type="checkbox"
                      checked={enableTaxes}
                      onChange={(e) => setEnableTaxes(e.target.checked)}
                      className="rounded border-slate-300 text-indigo-500 focus:ring-indigo-500/20 bg-slate-50 w-4 h-4 mt-0.5"
                    />
                    <div>
                      <span className="block font-semibold text-slate-700">Enable taxes</span>
                      <span className="text-[10px] text-slate-400 block font-normal mt-0.5">
                        Enable tax rates and calculations. Rates will be configurable and taxes will be calculated during checkout.
                      </span>
                    </div>
                  </label>

                  <label className="flex items-start gap-2.5 text-xs text-slate-600 font-medium cursor-pointer select-none">
                    <input
                      type="checkbox"
                      checked={enableCoupons}
                      onChange={(e) => setEnableCoupons(e.target.checked)}
                      className="rounded border-slate-300 text-indigo-500 focus:ring-indigo-500/20 bg-slate-50 w-4 h-4 mt-0.5"
                    />
                    <div>
                      <span className="block font-semibold text-slate-700">Enable coupons</span>
                      <span className="text-[10px] text-slate-400 block font-normal mt-0.5">
                        Enable the use of coupon codes. Coupons can be applied from the cart and checkout pages.
                      </span>
                    </div>
                  </label>

                  {enableCoupons && (
                    <label className="flex items-start gap-2.5 text-xs text-slate-600 font-medium cursor-pointer select-none pl-6 animate-in slide-in-from-top-1 duration-150">
                      <input
                        type="checkbox"
                        checked={calculateCouponsSequentially}
                        onChange={(e) => setCalculateCouponsSequentially(e.target.checked)}
                        className="rounded border-slate-300 text-indigo-500 focus:ring-indigo-500/20 bg-slate-50 w-4 h-4 mt-0.5"
                      />
                      <div>
                        <span className="block font-semibold text-slate-700">Calculate coupon discounts sequentially</span>
                        <span className="text-[10px] text-slate-400 block font-normal mt-0.5">
                          When applying multiple coupons, apply the first coupon to the full price and the second coupon to the discounted price and so on.
                        </span>
                      </div>
                    </label>
                  )}
                </div>
              </div>

              {/* Currency Options */}
              <div className="space-y-4 pt-4 border-t border-slate-100">
                <h3 className="text-sm font-bold text-slate-700 flex items-center gap-1.5 border-b border-slate-50 pb-2">
                  <Coins className="w-4.5 h-4.5 text-amber-500" /> Currency options
                </h3>
                <p className="text-[11px] text-slate-400">The following options affect how prices are displayed on the frontend.</p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider mb-1.5 block">
                      Currency
                    </label>
                    <select
                      value={currency}
                      onChange={(e) => setCurrency(e.target.value)}
                      className="w-full text-sm px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-hidden"
                    >
                      <option value="United States dollar ($) — USD">United States dollar ($) — USD</option>
                      <option value="Indian rupee (₹) — INR">Indian rupee (₹) — INR</option>
                      <option value="Euro (€) — EUR">Euro (€) — EUR</option>
                      <option value="Pound sterling (£) — GBP">Pound sterling (£) — GBP</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider mb-1.5 block">
                      Currency position
                    </label>
                    <select
                      value={currencyPosition}
                      onChange={(e) => setCurrencyPosition(e.target.value)}
                      className="w-full text-sm px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-hidden"
                    >
                      <option value="Left">Left</option>
                      <option value="Right">Right</option>
                      <option value="Left with space">Left with space</option>
                      <option value="Right with space">Right with space</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider mb-1.5 block">
                      Thousand separator
                    </label>
                    <input
                      type="text"
                      value={thousandSeparator}
                      onChange={(e) => setThousandSeparator(e.target.value)}
                      className="w-full text-sm px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-center focus:outline-hidden"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider mb-1.5 block">
                      Decimal separator
                    </label>
                    <input
                      type="text"
                      value={decimalSeparator}
                      onChange={(e) => setDecimalSeparator(e.target.value)}
                      className="w-full text-sm px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-center focus:outline-hidden"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider mb-1.5 block">
                      Number of decimals
                    </label>
                    <input
                      type="number"
                      value={numberOfDecimals}
                      onChange={(e) => setNumberOfDecimals(parseInt(e.target.value) || 0)}
                      className="w-full text-sm px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-center focus:outline-hidden"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Shipping Settings Tab */}
          {activeTab === "shipping" && (
            <div className="space-y-6 animate-in fade-in duration-150">
              {/* Shipping Sub-Navigation tabs */}
              <div className="flex border-b border-slate-100 pb-2 gap-4 text-xs font-semibold text-slate-400">
                <button
                  type="button"
                  onClick={() => setShippingSubTab("zones")}
                  className={`pb-2 border-b-2 transition-all ${
                    shippingSubTab === "zones" ? "border-indigo-500 text-slate-700" : "border-transparent hover:text-slate-600"
                  }`}
                >
                  Shipping zones
                </button>
                <button
                  type="button"
                  onClick={() => setShippingSubTab("settings")}
                  className={`pb-2 border-b-2 transition-all ${
                    shippingSubTab === "settings" ? "border-indigo-500 text-slate-700" : "border-transparent hover:text-slate-600"
                  }`}
                >
                  Shipping settings
                </button>
                <button
                  type="button"
                  onClick={() => setShippingSubTab("classes")}
                  className={`pb-2 border-b-2 transition-all ${
                    shippingSubTab === "classes" ? "border-indigo-500 text-slate-700" : "border-transparent hover:text-slate-600"
                  }`}
                >
                  Classes
                </button>
                <button
                  type="button"
                  onClick={() => setShippingSubTab("pickup")}
                  className={`pb-2 border-b-2 transition-all ${
                    shippingSubTab === "pickup" ? "border-indigo-500 text-slate-700" : "border-transparent hover:text-slate-600"
                  }`}
                >
                  Local pickup
                </button>
              </div>

              {/* Shipping Zones Content */}
              {shippingSubTab === "zones" && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="text-sm font-bold text-slate-700">Shipping zones</h4>
                      <p className="text-[11px] text-slate-400 mt-0.5">Regions you ship to and the shipping methods offered there.</p>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleOpenZoneModal()}
                      className="bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs px-3.5 py-2 rounded-lg transition-all flex items-center gap-1.5"
                    >
                      <Plus className="w-4 h-4" /> Add zone
                    </button>
                  </div>

                  <div className="border border-slate-100 rounded-xl overflow-hidden shadow-xs">
                    <table className="w-full text-left border-collapse">
                      <thead>
                        <tr className="bg-slate-50/50 border-b border-slate-100 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                          <th className="px-4 py-3">Zone name</th>
                          <th className="px-4 py-3">Region(s)</th>
                          <th className="px-4 py-3">Shipping method(s)</th>
                          <th className="px-4 py-3 text-right">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100 text-xs">
                        {shippingZones.map((zone) => (
                          <tr key={zone.id} className="hover:bg-slate-50/30 transition-all">
                            <td className="px-4 py-3 font-semibold text-slate-700">{zone.name}</td>
                            <td className="px-4 py-3 text-slate-500 max-w-[200px] truncate">{zone.regions}</td>
                            <td className="px-4 py-3 text-slate-500">{zone.methods}</td>
                            <td className="px-4 py-3 text-right">
                              <div className="flex items-center justify-end gap-1">
                                <button
                                  type="button"
                                  onClick={() => handleOpenZoneModal(zone)}
                                  className="p-1 text-slate-400 hover:text-indigo-600 rounded-md hover:bg-slate-100 transition-all"
                                  title="Edit"
                                >
                                  <Edit className="w-4.5 h-4.5" />
                                </button>
                                {!zone.isDefault && (
                                  <button
                                    type="button"
                                    onClick={() => handleDeleteZone(zone.id)}
                                    className="p-1 text-slate-400 hover:text-rose-600 rounded-md hover:bg-slate-100 transition-all"
                                    title="Delete"
                                  >
                                    <Trash2 className="w-4.5 h-4.5" />
                                  </button>
                                )}
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* Shipping Settings Content */}
              {shippingSubTab === "settings" && (
                <div className="space-y-5 pl-1">
                  <h4 className="text-sm font-bold text-slate-700">Shipping options</h4>
                  
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Calculations</span>
                      <label className="flex items-start gap-2.5 text-xs text-slate-600 font-medium cursor-pointer select-none">
                        <input
                          type="checkbox"
                          checked={calcOnCart}
                          onChange={(e) => setCalcOnCart(e.target.checked)}
                          className="rounded border-slate-300 text-indigo-500 w-4 h-4 mt-0.5"
                        />
                        <span>Enable the shipping calculator on the cart page</span>
                      </label>
                      <label className="flex items-start gap-2.5 text-xs text-slate-600 font-medium cursor-pointer select-none">
                        <input
                          type="checkbox"
                          checked={hideCostsUntilAddr}
                          onChange={(e) => setHideCostsUntilAddr(e.target.checked)}
                          className="rounded border-slate-300 text-indigo-500 w-4 h-4 mt-0.5"
                        />
                        <span>Hide shipping costs until an address is entered</span>
                      </label>
                    </div>

                    <div className="space-y-2 pt-2 border-t border-slate-50">
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Shipping destination</span>
                      
                      <div className="space-y-2">
                        <label className="flex items-center gap-2 text-xs text-slate-600 font-medium cursor-pointer select-none">
                          <input
                            type="radio"
                            name="shippingDest"
                            value="default_customer"
                            checked={shippingDest === "default_customer"}
                            onChange={() => setShippingDest("default_customer")}
                            className="text-indigo-500 focus:ring-indigo-500 w-4 h-4"
                          />
                          Default to customer shipping address
                        </label>
                        <label className="flex items-center gap-2 text-xs text-slate-600 font-medium cursor-pointer select-none">
                          <input
                            type="radio"
                            name="shippingDest"
                            value="default_billing"
                            checked={shippingDest === "default_billing"}
                            onChange={() => setShippingDest("default_billing")}
                            className="text-indigo-500 focus:ring-indigo-500 w-4 h-4"
                          />
                          Default to customer billing address
                        </label>
                        <label className="flex items-center gap-2 text-xs text-slate-600 font-medium cursor-pointer select-none">
                          <input
                            type="radio"
                            name="shippingDest"
                            value="force_billing"
                            checked={shippingDest === "force_billing"}
                            onChange={() => setShippingDest("force_billing")}
                            className="text-indigo-500 focus:ring-indigo-500 w-4 h-4"
                          />
                          Force shipping to the customer billing address
                        </label>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Classes Content */}
              {shippingSubTab === "classes" && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="text-sm font-bold text-slate-700">Product shipping classes</h4>
                      <p className="text-[11px] text-slate-400 mt-0.5">Shipping classes are used to group products of similar types and provide flat rate values.</p>
                    </div>
                    {!showAddClassInput && (
                      <button
                        type="button"
                        onClick={() => setShowAddClassInput(true)}
                        className="bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs px-3.5 py-2 rounded-lg transition-all flex items-center gap-1.5"
                      >
                        <Plus className="w-4 h-4" /> Add shipping class
                      </button>
                    )}
                  </div>

                  {showAddClassInput && (
                    <div className="bg-slate-50/50 border border-slate-100 rounded-xl p-4 space-y-4 animate-in slide-in-from-top-2 duration-200">
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                        <div>
                          <label className="text-[9px] font-bold text-slate-400 uppercase tracking-wider mb-1 block">Shipping class name</label>
                          <input
                            type="text"
                            value={newClassName}
                            onChange={(e) => setNewClassName(e.target.value)}
                            placeholder="e.g. Fragile Items"
                            className="w-full text-xs bg-white border border-slate-200 px-3 py-2 rounded-lg focus:outline-hidden"
                          />
                        </div>
                        <div>
                          <label className="text-[9px] font-bold text-slate-400 uppercase tracking-wider mb-1 block">Slug</label>
                          <input
                            type="text"
                            value={newClassSlug}
                            onChange={(e) => setNewClassSlug(e.target.value)}
                            placeholder="e.g. fragile-items"
                            className="w-full text-xs bg-white border border-slate-200 px-3 py-2 rounded-lg focus:outline-hidden"
                          />
                        </div>
                        <div>
                          <label className="text-[9px] font-bold text-slate-400 uppercase tracking-wider mb-1 block">Description</label>
                          <input
                            type="text"
                            value={newClassDesc}
                            onChange={(e) => setNewClassDesc(e.target.value)}
                            placeholder="For fragile products..."
                            className="w-full text-xs bg-white border border-slate-200 px-3 py-2 rounded-lg focus:outline-hidden"
                          />
                        </div>
                      </div>
                      <div className="flex gap-2 justify-end">
                        <button
                          type="button"
                          onClick={() => setShowAddClassInput(false)}
                          className="px-3 py-1.5 text-xs text-slate-500 hover:bg-slate-100 rounded-lg"
                        >
                          Cancel
                        </button>
                        <button
                          type="button"
                          onClick={handleAddShippingClass}
                          className="px-3.5 py-1.5 text-xs bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-lg shadow-sm"
                        >
                          Save Class
                        </button>
                      </div>
                    </div>
                  )}

                  <div className="border border-slate-100 rounded-xl overflow-hidden shadow-xs">
                    <table className="w-full text-left border-collapse">
                      <thead>
                        <tr className="bg-slate-50/50 border-b border-slate-100 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                          <th className="px-4 py-3">Shipping class</th>
                          <th className="px-4 py-3">Slug</th>
                          <th className="px-4 py-3">Description</th>
                          <th className="px-4 py-3 text-right">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100 text-xs">
                        {shippingClasses.map((cls) => (
                          <tr key={cls.id} className="hover:bg-slate-50/30 transition-all text-slate-600">
                            <td className="px-4 py-3 font-semibold text-slate-700">{cls.name}</td>
                            <td className="px-4 py-3 font-mono">{cls.slug}</td>
                            <td className="px-4 py-3">{cls.description || "N/A"}</td>
                            <td className="px-4 py-3 text-right">
                              <button
                                type="button"
                                onClick={() => handleDeleteShippingClass(cls.id)}
                                className="p-1.5 text-slate-400 hover:text-rose-600 rounded-md hover:bg-slate-100 transition-all"
                                title="Remove"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* Local Pickup Content */}
              {shippingSubTab === "pickup" && (
                <div className="space-y-4 pl-1">
                  <h4 className="text-sm font-bold text-slate-700">Local pickup</h4>
                  
                  <div className="space-y-4">
                    <label className="flex items-start gap-2.5 text-xs text-slate-600 font-medium cursor-pointer select-none">
                      <input
                        type="checkbox"
                        checked={enableLocalPickup}
                        onChange={(e) => setEnableLocalPickup(e.target.checked)}
                        className="rounded border-slate-300 text-indigo-500 w-4 h-4 mt-0.5"
                      />
                      <div>
                        <span className="block font-semibold text-slate-700">Enable local pickup</span>
                        <span className="text-[10px] text-slate-400 block font-normal mt-0.5">Allows customers to pick up orders themselves. Local pickup is free.</span>
                      </div>
                    </label>

                    {enableLocalPickup && (
                      <div className="bg-slate-50/50 border border-slate-100 rounded-2xl p-4 grid grid-cols-1 sm:grid-cols-2 gap-4 animate-in slide-in-from-top-2 duration-150">
                        <div>
                          <label className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider mb-1 block">
                            Pickup location name
                          </label>
                          <input
                            type="text"
                            value={pickupLocationName}
                            onChange={(e) => setPickupLocationName(e.target.value)}
                            placeholder="e.g. Headquarters Office"
                            className="w-full text-xs bg-white border border-slate-200 px-3 py-2 rounded-lg focus:outline-hidden"
                          />
                        </div>
                        <div>
                          <label className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider mb-1 block">
                            Address / Instructions
                          </label>
                          <input
                            type="text"
                            value={pickupAddress}
                            onChange={(e) => setPickupAddress(e.target.value)}
                            placeholder="100 Main Road, Suite 400"
                            className="w-full text-xs bg-white border border-slate-200 px-3 py-2 rounded-lg focus:outline-hidden"
                          />
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Payments Tab */}
          {activeTab === "payment" && (
            <div className="space-y-6 animate-in fade-in duration-150">
              <div className="flex items-center justify-between border-b border-slate-50 pb-2">
                <h3 className="text-sm font-bold text-slate-700 flex items-center gap-1.5">
                  <CreditCard className="w-4.5 h-4.5 text-indigo-500" /> Payment providers
                </h3>
                <span className="text-[10px] font-bold px-2 py-0.5 bg-slate-100 text-slate-500 rounded-full">
                  Business location: India
                </span>
              </div>

              {/* Stripe Card */}
              <div className="bg-slate-50/30 border border-slate-100 rounded-2xl p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div className="space-y-1.5 flex-1">
                  <div className="flex items-center gap-2">
                    <span className="font-extrabold text-lg text-indigo-600 tracking-tight">stripe</span>
                    <span className="text-[9px] font-extrabold px-1.5 py-0.5 bg-indigo-50 text-indigo-600 rounded-full border border-indigo-100 uppercase tracking-wider">Official</span>
                  </div>
                  <p className="text-xs text-slate-500 leading-relaxed max-w-xl">
                    Accept debit and credit cards in 135+ currencies, payment methods such as Alipay, and one-touch checkout with Apple Pay.
                  </p>
                </div>
                <div>
                  {!stripeInstalled ? (
                    <button
                      type="button"
                      onClick={() => {
                        setStripeInstalled(true);
                        toast.success("Stripe extension installed successfully!");
                      }}
                      className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs px-4 py-2.5 rounded-xl shadow-md transition-all"
                    >
                      Install
                    </button>
                  ) : (
                    <label className="flex items-center gap-2 cursor-pointer select-none">
                      <span className="text-xs font-semibold text-slate-500">{stripeEnabled ? "Active" : "Disabled"}</span>
                      <input
                        type="checkbox"
                        checked={stripeEnabled}
                        onChange={(e) => setStripeEnabled(e.target.checked)}
                        className="rounded border-slate-300 text-indigo-500 w-4.5 h-4.5 cursor-pointer"
                      />
                    </label>
                  )}
                </div>
              </div>

              {/* PayPal Card */}
              <div className="bg-slate-50/30 border border-slate-100 rounded-2xl p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div className="space-y-1.5 flex-1">
                  <div className="flex items-center gap-2">
                    <span className="font-extrabold text-lg text-blue-900 italic tracking-tight">PayPal</span>
                    <span className="text-[9px] font-extrabold px-1.5 py-0.5 bg-indigo-50 text-indigo-600 rounded-full border border-indigo-100 uppercase tracking-wider">Official</span>
                  </div>
                  <p className="text-xs text-slate-500 leading-relaxed max-w-xl">
                    PayPal Payments lets you offer PayPal, Venmo (US only), Pay Later options and more.
                  </p>
                </div>
                <div>
                  {!paypalInstalled ? (
                    <button
                      type="button"
                      onClick={() => {
                        setPaypalInstalled(true);
                        toast.success("PayPal extension installed successfully!");
                      }}
                      className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs px-4 py-2.5 rounded-xl shadow-md transition-all"
                    >
                      Install
                    </button>
                  ) : (
                    <label className="flex items-center gap-2 cursor-pointer select-none">
                      <span className="text-xs font-semibold text-slate-500">{paypalEnabled ? "Active" : "Disabled"}</span>
                      <input
                        type="checkbox"
                        checked={paypalEnabled}
                        onChange={(e) => setPaypalEnabled(e.target.checked)}
                        className="rounded border-slate-300 text-indigo-500 w-4.5 h-4.5 cursor-pointer"
                      />
                    </label>
                  )}
                </div>
              </div>

              {/* Take Offline Payments Card */}
              <div className="bg-slate-50/30 border border-slate-100 rounded-2xl p-5 space-y-4">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-100 pb-3">
                  <div className="space-y-1">
                    <h4 className="font-bold text-slate-800 text-sm">Take offline payments</h4>
                    <p className="text-xs text-slate-500 max-w-xl">
                      Accept payments offline using multiple different methods. These can also be used to test purchases.
                    </p>
                  </div>
                  <label className="flex items-center gap-2 cursor-pointer select-none">
                    <span className="text-xs font-semibold text-slate-500">{offlineEnabled ? "Active" : "Disabled"}</span>
                    <input
                      type="checkbox"
                      checked={offlineEnabled}
                      onChange={(e) => setOfflineEnabled(e.target.checked)}
                      className="rounded border-slate-300 text-indigo-500 w-4.5 h-4.5 cursor-pointer"
                    />
                  </label>
                </div>

                {offlineEnabled && (
                  <div className="pl-2 space-y-3 animate-in fade-in duration-150">
                    <label className="flex items-center justify-between text-xs text-slate-600 font-semibold cursor-pointer py-1">
                      <div className="space-y-0.5">
                        <span className="block text-slate-700">Cash on Delivery (COD)</span>
                        <span className="text-[10px] text-slate-400 block font-normal">Pay with cash upon delivery.</span>
                      </div>
                      <input
                        type="checkbox"
                        checked={codEnabled}
                        onChange={(e) => setCodEnabled(e.target.checked)}
                        className="rounded border-slate-300 text-indigo-500 w-4.5 h-4.5"
                      />
                    </label>

                    <label className="flex items-center justify-between text-xs text-slate-600 font-semibold cursor-pointer py-1">
                      <div className="space-y-0.5">
                        <span className="block text-slate-700">Direct Bank Transfer</span>
                        <span className="text-[10px] text-slate-400 block font-normal">Receive payments directly into your bank account.</span>
                      </div>
                      <input
                        type="checkbox"
                        checked={bankTransferEnabled}
                        onChange={(e) => setBankTransferEnabled(e.target.checked)}
                        className="rounded border-slate-300 text-indigo-500 w-4.5 h-4.5"
                      />
                    </label>
                  </div>
                )}
              </div>

              {/* More Payment Options Accordion */}
              <div className="border border-slate-100 rounded-2xl overflow-hidden shadow-xs">
                <button
                  type="button"
                  onClick={() => setShowMorePayments(!showMorePayments)}
                  className="w-full flex items-center justify-between px-5 py-4 bg-slate-50/50 hover:bg-slate-100/50 transition-all font-semibold text-xs text-slate-700"
                >
                  <span className="flex items-center gap-2">
                    <Info className="w-4 h-4 text-slate-400" /> More payment options
                  </span>
                  <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform ${showMorePayments ? "rotate-180" : ""}`} />
                </button>

                {showMorePayments && (
                  <div className="p-5 border-t border-slate-100 bg-white grid grid-cols-1 sm:grid-cols-2 gap-4 animate-in fade-in duration-200">
                    <label className="flex items-center justify-between p-3 border border-slate-100 rounded-xl hover:bg-slate-50/40 cursor-pointer">
                      <div className="space-y-0.5">
                        <span className="block font-bold text-xs text-slate-700">Razorpay</span>
                        <span className="text-[9px] text-slate-400 block">Popular gateway for cards, UPI, wallets in India.</span>
                      </div>
                      <input
                        type="checkbox"
                        checked={razorpayEnabled}
                        onChange={(e) => setRazorpayEnabled(e.target.checked)}
                        className="rounded border-slate-300 text-indigo-500 w-4.5 h-4.5"
                      />
                    </label>

                    <label className="flex items-center justify-between p-3 border border-slate-100 rounded-xl hover:bg-slate-50/40 cursor-pointer">
                      <div className="space-y-0.5">
                        <span className="block font-bold text-xs text-slate-700">PayU India</span>
                        <span className="text-[9px] text-slate-400 block">Accept local payment integrations smoothly.</span>
                      </div>
                      <input
                        type="checkbox"
                        checked={payuEnabled}
                        onChange={(e) => setPayuEnabled(e.target.checked)}
                        className="rounded border-slate-300 text-indigo-500 w-4.5 h-4.5"
                      />
                    </label>

                    <label className="flex items-center justify-between p-3 border border-slate-100 rounded-xl hover:bg-slate-50/40 cursor-pointer">
                      <div className="space-y-0.5">
                        <span className="block font-bold text-xs text-slate-700">Payoneer Checkout</span>
                        <span className="text-[9px] text-slate-400 block">Accept global credit cards directly.</span>
                      </div>
                      <input
                        type="checkbox"
                        checked={payoneerEnabled}
                        onChange={(e) => setPayoneerEnabled(e.target.checked)}
                        className="rounded border-slate-300 text-indigo-500 w-4.5 h-4.5"
                      />
                    </label>

                    <label className="flex items-center justify-between p-3 border border-slate-100 rounded-xl hover:bg-slate-50/40 cursor-pointer">
                      <div className="space-y-0.5">
                        <span className="block font-bold text-xs text-slate-700">Visa Acceptance Solutions</span>
                        <span className="text-[9px] text-slate-400 block">Secure payment integrations by Cybersource.</span>
                      </div>
                      <input
                        type="checkbox"
                        checked={visaEnabled}
                        onChange={(e) => setVisaEnabled(e.target.checked)}
                        className="rounded border-slate-300 text-indigo-500 w-4.5 h-4.5"
                      />
                    </label>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Shipping Zone Modal */}
      {showZoneModal && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-in fade-in duration-200">
          <div className="bg-white border border-slate-100 rounded-3xl w-full max-w-md p-6 shadow-2xl space-y-4 animate-in zoom-in-95 duration-200">
            <div>
              <h3 className="text-base font-bold text-slate-800">
                {currentZone ? "Edit Shipping Zone" : "Add Shipping Zone"}
              </h3>
              <p className="text-[10px] text-slate-400 mt-0.5 font-medium">Define regions and active shipping methods for this zone.</p>
            </div>

            <div className="space-y-3.5">
              <div>
                <label className="text-[9px] font-bold text-slate-500 uppercase tracking-wider mb-1 block">Zone name</label>
                <input
                  type="text"
                  value={modalZoneName}
                  onChange={(e) => setModalZoneName(e.target.value)}
                  placeholder="e.g. Domestic Shipping"
                  className="w-full text-xs bg-slate-50 border border-slate-200 px-3 py-2 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-indigo-500/20 focus:bg-white"
                />
              </div>

              <HierarchicalRegionSelect
                label="Region(s)"
                value={modalZoneRegions}
                onChange={setModalZoneRegions}
                options={countries}
                placeholder="Select Region/State..."
              />

              <div>
                <label className="text-[9px] font-bold text-slate-500 uppercase tracking-wider mb-1 block">Shipping method(s)</label>
                <input
                  type="text"
                  value={modalZoneMethods}
                  onChange={(e) => setModalZoneMethods(e.target.value)}
                  placeholder="e.g. Flat rate $15, Free shipping"
                  className="w-full text-xs bg-slate-50 border border-slate-200 px-3 py-2 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-indigo-500/20 focus:bg-white"
                />
              </div>
            </div>

            <div className="flex gap-2 justify-end pt-2">
              <button
                type="button"
                onClick={() => setShowZoneModal(false)}
                className="px-4 py-2 text-xs font-semibold text-slate-500 hover:bg-slate-50 rounded-xl"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSaveZone}
                className="px-4 py-2 text-xs bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-xl shadow-lg shadow-indigo-600/15"
              >
                {currentZone ? "Update Zone" : "Add Zone"}
              </button>
            </div>
          </div>
        </div>
      )}
    </form>
  );
}
