import React, { useEffect, useMemo, useState } from "react";
import { toast } from "react-toastify";
import { useAuth } from "../Context/AuthContext";
import {
    getMyCreatedCoupons,
  createCoupon,
  updateCoupon,
     deleteCoupon,
 
} from "../services/api";
import { X, Trash2, AlertTriangle } from "lucide-react";
   
const initialForm = {
    title: "",
   description: "",
  discountPercentage: 0,
  discountAmount: 0,
  minimumPurchase: 0,
  code: "",
  category: "Other",
  image: "",
  startDate: "",
      endDate: "",
  price: 0,
  store: "",
  terms: "",

  isActive: true,
};

const categories = [
  { value: "Electronics", icon: "📱" },
  { value: "Fashion", icon: "👗" },
  { value: "Food", icon: "🍕" },
  { value: "Travel", icon: "✈️" },
  { value: "Health", icon: "💊" },
  { value: "Education", icon: "📚" },
  { value: "Entertainment", icon: "🎬" },
  { value: "Other", icon: "✨" },
];

const MyCreated = () => {
         const { user } = useAuth();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
     const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(initialForm);
  const [errors, setErrors] = useState({});
  const [showForm, setShowForm] = useState(false);
           const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [couponToDelete, setCouponToDelete] = useState(null);

  const isEditing = useMemo(() => Boolean(editingId), [editingId]);

  const load = async () => {
    try {
      setLoading(true);
      const res = await getMyCreatedCoupons();
      if (res?.success) setItems(res.data || []);
      else toast.error(res?.message || "Failed to load your coupons");
    } catch (err) {
      toast.error(err?.response?.data?.message || "Failed to load your coupons");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user) load();
  }, [user]);

  const startCreate = () => {
     setEditingId(null);
    setForm({ ...initialForm, startDate: new Date().toISOString().slice(0, 10) });
      setShowForm(true);
    setErrors({});
  };

  const startEdit = (c) => {
    setEditingId(c._id);
    setForm({
      title: c.title || "",// if user not put value then it will be empty string
          description: c.description || "",
      discountPercentage: c.discountPercentage ?? 0,
      discountAmount: c.discountAmount ?? 0,
           minimumPurchase: c.minimumPurchase ?? 0,
      code: c.code || "",
      category: c.category || "Other",
      image: c.image || "",
      startDate: c.startDate ? new Date(c.startDate).toISOString().slice(0, 10) : "",
         endDate: c.endDate ? new Date(c.endDate).toISOString().slice(0, 10) : "",
      price: c.price ?? 0,
      store: c.store || "",
          terms: c.terms || "",
      usageLimit: c.usageLimit ?? -1,
      isActive: Boolean(c.isActive),
    });
    setShowForm(true);
    setErrors({});
  };

  const cancelEdit = () => {
    setEditingId(null);
    setForm(initialForm);
    setShowForm(false);
    setErrors({});
  };

  const onChange = (e) => {
    const { name, value, type, checked, files } = e.target;
    
    if (name === "image" && files && files[0]) {
      // Handle file selection
      const file = files[0];
      
      // Validate file type
      if (!file.type.startsWith('image/')) {
        setErrors((prev) => ({
          ...prev,
          image: "Please select a valid image file"
        }));
        return;
      }
      
      // Validate file size (max 2MB)
      if (file.size > 2 * 1024 * 1024) {
        setErrors((prev) => ({
          ...prev,
          image: "Image size must be less than 2MB"
        }));
        return;
      }
      
      // Compress and convert file to base64
      const compressImage = (file, maxWidth = 800, quality = 0.8) => {
        return new Promise((resolve) => {
          const canvas = document.createElement('canvas');
          const ctx = canvas.getContext('2d');
          const img = new Image();
          
          img.onload = () => {
            // Calculate new dimensions
            let { width, height } = img;
            if (width > maxWidth) {
              height = (height * maxWidth) / width;
              width = maxWidth;
            }
            
            canvas.width = width;
            canvas.height = height;
            
            // Draw and compress
            ctx.drawImage(img, 0, 0, width, height);
            canvas.toBlob(resolve, 'image/jpeg', quality);
          };
          
          img.src = URL.createObjectURL(file);
        });
      };
      
      compressImage(file).then((compressedBlob) => {
        const reader = new FileReader();
        reader.onload = (event) => {
          setForm((f) => ({
            ...f,
            image: event.target.result
          }));
          setErrors((prev) => ({
            ...prev,
            image: ""
          }));
        };
        reader.onerror = () => {
          setErrors((prev) => ({
            ...prev,
            image: "Failed to read image file"
          }));
        };
        reader.readAsDataURL(compressedBlob);
      }).catch(() => {
        setErrors((prev) => ({
          ...prev,
          image: "Failed to compress image"
        }));
      });
      return;
    }
    
    setForm((f) => ({
      ...f,
      [name]: type === "number" ? Number(value) : type === "checkbox" ? checked : value,
    }));

    // Basic inline validation
    setErrors((prev) => {
      const next = { ...prev };
      const v = type === "number" ? Number(value) : value;
      if (["title", "store", "description", "code", "image"].includes(name)) {
        next[name] = v ? "" : "Required";
      }
      if (name === "discountPercentage") {
        next.discountPercentage = v >= 0 && v <= 100 ? "" : "0-100";
      }
      if (name === "discountAmount") {
        next.discountAmount = v >= 0 ? "" : ">= 0";
      }
      if (name === "minimumPurchase") {
        next.minimumPurchase = v >= 0 ? "" : ">= 0";
      }
      if (name === "price") {
        next.price = v >= 0 ? "" : ">= 0";
      }
      if (name === "usageLimit") {
        next.usageLimit = v >= -1 ? "" : ">= -1";
      }
      if (name === "startDate" || name === "endDate") {
        const sd = name === "startDate" ? v : form.startDate;
        const ed = name === "endDate" ? v : form.endDate;
        if (sd && ed) {
          next.dateRange = new Date(sd) <= new Date(ed) ? "" : "Start must be before end";
        }
      }
      return next;
    });
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      // Final guard validation
      const guardErrors = {};
      ["title","store","description","code","startDate","endDate"].forEach((k)=>{ if (!form[k]) guardErrors[k] = "Required"; });
      if (!form.image) guardErrors.image = "Required";
      if (form.discountPercentage < 0 || form.discountPercentage > 100) guardErrors.discountPercentage = "0-100";
      if (form.discountAmount < 0) guardErrors.discountAmount = ">= 0";
      if (form.minimumPurchase < 0) guardErrors.minimumPurchase = ">= 0";
      if (form.price < 0) guardErrors.price = ">= 0";
      if (form.usageLimit < -1) guardErrors.usageLimit = ">= -1";
      if (form.startDate && form.endDate && new Date(form.startDate) > new Date(form.endDate)) guardErrors.dateRange = "Start must be before end";
      setErrors(guardErrors);
      if (Object.values(guardErrors).some(Boolean)) {
        toast.error("Please fix validation errors");
        setSaving(false);
        return;
      }
      const payload = {
        ...form,
        startDate: form.startDate ? new Date(form.startDate) : undefined,
        endDate: form.endDate ? new Date(form.endDate) : undefined,
      };
      if (isEditing) {
        const res = await updateCoupon(editingId, payload);
        if (res?.success) {
          toast.success("Updated");
          await load();
          cancelEdit();
        } else toast.error(res?.message || "Update failed");
      } else {
        const res = await createCoupon(payload);
        if (res?.success) {
          toast.success("Created");
          await load();
          cancelEdit();
        } else toast.error(res?.message || "Create failed");
      }
    } catch (err) {
      const msg = err?.response?.data?.message || "Save failed";
      toast.error(msg);
    } finally {
      setSaving(false);
    }
  };

  const onDelete = (coupon) => {
    setCouponToDelete(coupon);
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    if (!couponToDelete) return;
    
    try {
      const res = await deleteCoupon(couponToDelete._id);
      if (res?.success) {
        toast.success("Coupon deleted successfully");
        setItems((prev) => prev.filter((c) => c._id !== couponToDelete._id));
      } else {
        toast.error(res?.message || "Delete failed");
      }
    } catch (err) {
      toast.error(err?.response?.data?.message || "Delete failed");
    } finally {
      setShowDeleteModal(false);
      setCouponToDelete(null);
    }
  };

  const cancelDelete = () => {
    setShowDeleteModal(false);
    setCouponToDelete(null);
  };
  useEffect(() => {
    if (user) {
      console.log("Loading my created coupons...");
      load();
    }
  }, [user]);
  
  const clearImage = () => {
    setForm((f) => ({ ...f, image: "" }));
    setErrors((prev) => ({ ...prev, image: "" }));
    // Clear the file input
    const fileInput = document.querySelector('input[name="image"]');
    if (fileInput) fileInput.value = '';
  };

  return (
 
    <div className="min-h-screen bg-gray-50 pt-20 pb-10">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <h1 className="text-3xl font-extrabold text-gray-900">My Created Coupons</h1>
          <button onClick={startCreate} className="self-start md:self-auto bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2 rounded-lg shadow">
            + New Coupon 
          </button>
        </div>
{/* List  */}
<div className="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {loading ? (
            <div className="col-span-full text-center text-gray-500">Loading...</div>
          ) : items.length === 0 ? (
            <div className="col-span-full text-center text-gray-600 bg-white rounded-xl shadow p-10">No coupons yet. Create one above.</div>
          ) : (
            items.map((c) => (
              <div key={c._id} className="bg-white rounded-xl shadow p-4 flex flex-col">
                <img src={c.image} alt={c.title} className="w-full h-40 object-cover rounded-lg" />
                <div className="mt-3">
        <h3 className="text-lg font-semibold text-gray-800">{c.title}</h3>
                  <p className="text-sm text-gray-500 line-clamp-2">{c.description}</p>
                </div>
                <div className="mt-auto flex items-center justify-between pt-3">
          <button onClick={() => startEdit(c)} className="px-3 py-2 rounded-lg border hover:bg-gray-50">Edit</button>
                  <button onClick={() => onDelete(c)} className="px-3 py-2 rounded-lg bg-red-600 text-white hover:bg-red-700">Delete</button>
                </div>
              </div>
            ))
          )}
        </div>
        
        {/* Form */}
        {showForm && (
        <div className="mt-6 bg-white rounded-xl shadow p-5">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">
            {isEditing ? "Edit Coupon" : "Create New Coupon"}
          </h2>
          <form onSubmit={onSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Title</label>
   <input name="title" value={form.title} onChange={onChange} className={`mt-1 w-full border rounded-lg px-3 py-2 ${errors.title ? 'border-red-400' : ''}`} required />
              {errors.title ? <p className="text-xs text-red-500 mt-1">{errors.title}</p> : null}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Store</label>
              <input name="store" value={form.store} onChange={onChange} className={`mt-1 w-full border rounded-lg px-3 py-2 ${errors.store ? 'border-red-400' : ''}`} required />
              {errors.store ? <p className="text-xs text-red-500 mt-1">{errors.store}</p> : null}
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700">Description</label>
              <textarea name="description" value={form.description} onChange={onChange} className={`mt-1 w-full border rounded-lg px-3 py-2 ${errors.description ? 'border-red-400' : ''}`} rows={3} required />
              {errors.description ? <p className="text-xs text-red-500 mt-1">{errors.description}</p> : null}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Code</label>
              <input name="code" value={form.code} onChange={onChange} className={`mt-1 w-full border rounded-lg px-3 py-2 uppercase ${errors.code ? 'border-red-400' : ''}`} required />
              {errors.code ? <p className="text-xs text-red-500 mt-1">{errors.code}</p> : null}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Category</label>
              <div className="mt-1 grid grid-cols-4 gap-2">
                {categories.map((c) => (
                  <button
                    type="button"
                    key={c.value}
                    onClick={() => setForm((f)=>({ ...f, category: c.value }))}
                    className={`border rounded-lg px-2 py-2 text-sm flex items-center justify-center gap-1 ${form.category === c.value ? 'border-indigo-500 bg-indigo-50' : 'hover:bg-gray-50'}`}
                    title={c.value}
                  >
                    <span>{c.icon}</span>
                    <span className="hidden sm:inline">{c.value}</span>
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Discount %</label>
              <input type="number" name="discountPercentage" value={form.discountPercentage} onChange={onChange} className={`mt-1 w-full border rounded-lg px-3 py-2 ${errors.discountPercentage ? 'border-red-400' : ''}`} min={0} max={100} required />
              {errors.discountPercentage ? <p className="text-xs text-red-500 mt-1">{errors.discountPercentage}</p> : null}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Discount Amount</label>
              <input type="number" name="discountAmount" value={form.discountAmount} onChange={onChange} className={`mt-1 w-full border rounded-lg px-3 py-2 ${errors.discountAmount ? 'border-red-400' : ''}`} min={0} required />
              {errors.discountAmount ? <p className="text-xs text-red-500 mt-1">{errors.discountAmount}</p> : null}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Minimum Purchase</label>
              <input type="number" name="minimumPurchase" value={form.minimumPurchase} onChange={onChange} className={`mt-1 w-full border rounded-lg px-3 py-2 ${errors.minimumPurchase ? 'border-red-400' : ''}`} min={0} required />
              {errors.minimumPurchase ? <p className="text-xs text-red-500 mt-1">{errors.minimumPurchase}</p> : null}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Price</label>
              <input type="number" name="price" value={form.price} onChange={onChange} className={`mt-1 w-full border rounded-lg px-3 py-2 ${errors.price ? 'border-red-400' : ''}`} min={0} required />
              {errors.price ? <p className="text-xs text-red-500 mt-1">{errors.price}</p> : null}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Start Date</label>
              <input type="date" name="startDate" value={form.startDate} onChange={onChange} className={`mt-1 w-full border rounded-lg px-3 py-2 ${errors.dateRange ? 'border-red-400' : ''}`} required />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">End Date</label>
              <input type="date" name="endDate" value={form.endDate} onChange={onChange} className={`mt-1 w-full border rounded-lg px-3 py-2 ${errors.dateRange ? 'border-red-400' : ''}`} required />
              {errors.dateRange ? <p className="text-xs text-red-500 mt-1">{errors.dateRange}</p> : null}
            </div>

 <div className="md:col-span-2 grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Usage Limit (-1 = unlimited)</label>
                      <input type="number" name="usageLimit" value={form.usageLimit} onChange={onChange} className={`mt-1 w-full border rounded-lg px-3 py-2 ${errors.usageLimit ? 'border-red-400' : ''}`} />
                {errors.usageLimit ? <p className="text-xs text-red-500 mt-1">{errors.usageLimit}</p> : null}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Image</label>
                <div className="flex gap-2 mt-1">
                  <input 
                    type="file" 
                    name="image" 
                    onChange={onChange} 
                    accept="image/*"
                    className={`flex-1 border rounded-lg px-3 py-2 ${errors.image ? 'border-red-400' : ''}`} 
                    required 
                  />
                  {form.image && (
                    <button 
                      type="button" 
                      onClick={clearImage}
                      className="px-3 py-2 text-red-600 border border-red-300 rounded-lg hover:bg-red-50"
                    >
                      Clear
                    </button>
                  )}
                </div>
                {errors.image ? <p className="text-xs text-red-500 mt-1">{errors.image}</p> : null}
                {form.image ? (
                  <div className="mt-2">
                    <img src={form.image} alt="preview" className="w-full h-32 object-cover rounded-lg border" onError={(e)=>{ e.currentTarget.style.display='none'; }} />
                    <p className="text-xs text-gray-500 mt-1">Image preview</p>
                  </div>
                ) : (
                  <p className="text-xs text-gray-500 mt-1">Select an image file from your computer (JPG, PNG, GIF, etc.) - Max 2MB, will be compressed</p>
                )}
              </div>
              <div className="flex items-end gap-2">
                <label className="inline-flex items-center gap-2 text-sm text-gray-700">
                  <input type="checkbox" name="isActive" checked={form.isActive} onChange={onChange} /> Active
                </label>
              </div>
            </div>

            <div className="md:col-span-2 flex gap-3 justify-end mt-2">
              {isEditing && (
                <button type="button" onClick={cancelEdit} className="px-4 py-2 rounded-lg border">Cancel</button>
              )}
  <button disabled={saving} className={`px-5 py-2 rounded-lg text-white ${saving ? "bg-gray-400" : "bg-indigo-600 hover:bg-indigo-700"}`}>
                {isEditing ? (saving ? "Saving..." : "Save Changes") : (saving ? "Creating..." : "+ Create")}
              </button>
            </div>
          </form>
        </div>
        )}

      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black/60 flex justify-center items-center z-50">
          <div className="bg-white rounded-2xl shadow-xl p-6 w-[90%] max-w-md relative">
            <button 
              className="absolute top-3 right-3 p-2 rounded-full hover:bg-gray-100" 
              onClick={cancelDelete}
            >
              <X className="w-5 h-5 text-gray-600" />
            </button>
            
            <div className="text-center mb-6">
              <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100 mb-4">
                <AlertTriangle className="h-6 w-6 text-red-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Delete Coupon</h3>
              <p className="text-sm text-gray-600 mb-4">
                Are you sure you want to delete <strong>"{couponToDelete?.title}"</strong>? 
                This action cannot be undone.
              </p>
            </div>
            
            <div className="flex gap-3 justify-end">
              <button
                onClick={cancelDelete}
                className="px-4 py-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50 transition duration-200"
              >
                Cancel
              </button>
              <button
                onClick={confirmDelete}
                className="px-4 py-2 rounded-lg bg-red-600 text-white hover:bg-red-700 transition duration-200 flex items-center gap-2"
              >
                <Trash2 className="w-4 h-4" />
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MyCreated;


