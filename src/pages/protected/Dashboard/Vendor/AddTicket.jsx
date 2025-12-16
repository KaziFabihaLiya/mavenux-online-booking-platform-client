import { useState } from "react";
import {
  MapPin,
  Calendar,
  DollarSign,
  Package,
  Upload,
  CheckCircle,
  Bus,
  Train,
  Ship,
  Plane,
  Clock,
  Sparkles,
  X,
} from "lucide-react";
import LoadingSpinner from "../../components/common/LoadingSpinner";

export default function AddTicket() {
  const [loading, setLoading] = useState(false);
  const [imageUploading, setImageUploading] = useState(false);
  const [imagePreview, setImagePreview] = useState(null);
  const [message, setMessage] = useState({ type: "", text: "" });

  // Replace with actual auth user
  const vendorId = "USER_ID_FROM_AUTH"; // From Firebase or auth context
  const vendorName = "John Doe";
  const vendorEmail = "vendor@example.com";

  const [formData, setFormData] = useState({
    title: "",
    from: "",
    to: "",
    transportType: "",
    price: "",
    ticketQuantity: "",
    departureDate: "",
    departureTime: "",
    perks: [],
    image: "",
    vendorId: vendorId,
    vendorName: vendorName,
    vendorEmail: vendorEmail,
  });

  const transportTypes = [
    {
      value: "Bus",
      icon: Bus,
      color: "from-blue-500 to-blue-600",
      glow: "group-hover:shadow-blue-500/50",
    },
    {
      value: "Train",
      icon: Train,
      color: "from-green-500 to-green-600",
      glow: "group-hover:shadow-green-500/50",
    },
    {
      value: "Launch",
      icon: Ship,
      color: "from-cyan-500 to-cyan-600",
      glow: "group-hover:shadow-cyan-500/50",
    },
    {
      value: "Plane",
      icon: Plane,
      color: "from-purple-500 to-purple-600",
      glow: "group-hover:shadow-purple-500/50",
    },
  ];

  const availablePerks = [
    "AC",
    "WiFi",
    "Breakfast",
    "Lunch",
    "Snacks",
    "Water Bottle",
    "Charging Port",
    "Reclining Seat",
  ];

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      setMessage({ type: "error", text: "Please upload an image file" });
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setMessage({ type: "error", text: "Image size should be less than 5MB" });
      return;
    }

    try {
      setImageUploading(true);
      const imageFormData = new FormData();
      imageFormData.append("image", file);

      const response = await fetch(
        `https://api.imgbb.com/1/upload?key=YOUR_IMGBB_API_KEY`,
        { method: "POST", body: imageFormData }
      );

      const data = await response.json();
      if (data.success) {
        setFormData((prev) => ({ ...prev, image: data.data.display_url }));
        setImagePreview(data.data.display_url);
        setMessage({ type: "success", text: "Image uploaded!" });
        setTimeout(() => setMessage({ type: "", text: "" }), 3000);
      }
    } catch (error) {
      setMessage({ type: "error", text: "Failed to upload image" });
    } finally {
      setImageUploading(false);
    }
  };

  const handlePerkToggle = (perk) => {
    setFormData((prev) => ({
      ...prev,
      perks: prev.perks.includes(perk)
        ? prev.perks.filter((p) => p !== perk)
        : [...prev.perks, perk],
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.image) {
      setMessage({ type: "error", text: "Please upload a ticket image" });
      return;
    }

    if (formData.perks.length === 0) {
      setMessage({ type: "error", text: "Select at least one perk" });
      return;
    }

    try {
      setLoading(true);

      const response = await fetch("http://localhost:5000/api/tickets", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        setMessage({
          type: "success",
          text: "Ticket added! Waiting for admin approval.",
        });

        setFormData({
          title: "",
          from: "",
          to: "",
          transportType: "",
          price: "",
          ticketQuantity: "",
          departureDate: "",
          departureTime: "",
          perks: [],
          image: "",
          vendorId,
          vendorName,
          vendorEmail,
        });
        setImagePreview(null);
      } else {
        throw new Error("Failed");
      }
    } catch (error) {
      setMessage({ type: "error", text: "Failed to add ticket" });
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <LoadingSpinner />;

  return (
    <div className="max-w-6xl mx-auto px-4">
      {/* Hero Header */}
      <div className="relative mb-8 overflow-hidden rounded-2xl bg-gradient-to-br from-amber-500 via-orange-500 to-red-500 p-8 shadow-2xl">
        <div className="absolute inset-0 bg-black opacity-10"></div>
        <div className="relative z-10 flex items-center gap-4">
          <div className="flex h-16 w-16 items-center justify-center rounded-xl bg-white bg-opacity-20 backdrop-blur-sm">
            <Sparkles className="h-8 w-8 text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-black text-white mb-1">
              Add New Ticket
            </h1>
            <p className="text-amber-100 text-sm">
              Create and list your travel tickets
            </p>
          </div>
        </div>
        <div className="absolute -right-8 -top-8 h-40 w-40 rounded-full bg-white opacity-10"></div>
        <div className="absolute -bottom-4 -left-4 h-32 w-32 rounded-full bg-white opacity-10"></div>
      </div>

      {/* Message Alert */}
      {message.text && (
        <div
          className={`mb-6 rounded-xl border-l-4 p-4 shadow-lg ${
            message.type === "success"
              ? "border-green-500 bg-green-50"
              : "border-red-500 bg-red-50"
          }`}
        >
          <div className="flex items-center gap-3">
            {message.type === "success" ? (
              <CheckCircle className="h-5 w-5 text-green-600" />
            ) : (
              <X className="h-5 w-5 text-red-600" />
            )}
            <p
              className={
                message.type === "success"
                  ? "text-green-700 font-medium"
                  : "text-red-700 font-medium"
              }
            >
              {message.text}
            </p>
          </div>
        </div>
      )}

      {/* Main Form Card */}
      <div className="rounded-2xl bg-white shadow-xl border border-stone-200">
        <div className="space-y-8 p-8">
          {/* Ticket Title */}
          <div className="group">
            <label className="mb-2 flex items-center gap-2 text-sm font-bold text-stone-700">
              <Package className="h-4 w-4 text-amber-600" />
              Ticket Title
            </label>
            <input
              type="text"
              required
              value={formData.title}
              onChange={(e) =>
                setFormData({ ...formData, title: e.target.value })
              }
              placeholder="e.g., Dhaka to Chittagong Express"
              className="w-full rounded-xl border-2 border-stone-200 px-4 py-3 transition-all focus:border-amber-500 focus:outline-none focus:ring-4 focus:ring-amber-500/10"
            />
          </div>

          {/* From & To */}
          <div className="grid gap-6 md:grid-cols-2">
            <div className="group">
              <label className="mb-2 flex items-center gap-2 text-sm font-bold text-stone-700">
                <MapPin className="h-4 w-4 text-green-600" />
                From Location
              </label>
              <input
                type="text"
                required
                value={formData.from}
                onChange={(e) =>
                  setFormData({ ...formData, from: e.target.value })
                }
                placeholder="e.g., Dhaka"
                className="w-full rounded-xl border-2 border-stone-200 px-4 py-3 transition-all focus:border-green-500 focus:outline-none focus:ring-4 focus:ring-green-500/10"
              />
            </div>

            <div className="group">
              <label className="mb-2 flex items-center gap-2 text-sm font-bold text-stone-700">
                <MapPin className="h-4 w-4 text-red-600" />
                To Location
              </label>
              <input
                type="text"
                required
                value={formData.to}
                onChange={(e) =>
                  setFormData({ ...formData, to: e.target.value })
                }
                placeholder="e.g., Chittagong"
                className="w-full rounded-xl border-2 border-stone-200 px-4 py-3 transition-all focus:border-red-500 focus:outline-none focus:ring-4 focus:ring-red-500/10"
              />
            </div>
          </div>

          {/* Transport Type */}
          <div>
            <label className="mb-4 flex items-center gap-2 text-sm font-bold text-stone-700">
              Transport Type
            </label>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {transportTypes.map(({ value, icon: Icon, color, glow }) => (
                <button
                  key={value}
                  type="button"
                  onClick={() =>
                    setFormData({ ...formData, transportType: value })
                  }
                  className={`group relative overflow-hidden rounded-xl border-2 p-4 transition-all ${
                    formData.transportType === value
                      ? "border-transparent shadow-xl scale-105"
                      : "border-stone-200 hover:border-stone-300 hover:shadow-lg"
                  }`}
                >
                  {formData.transportType === value && (
                    <div
                      className={`absolute inset-0 bg-gradient-to-br ${color} opacity-100`}
                    ></div>
                  )}
                  <div className="relative flex flex-col items-center gap-2">
                    <Icon
                      className={`h-8 w-8 transition-transform group-hover:scale-110 ${
                        formData.transportType === value
                          ? "text-white"
                          : "text-stone-600"
                      }`}
                    />
                    <span
                      className={`text-sm font-bold ${
                        formData.transportType === value
                          ? "text-white"
                          : "text-stone-700"
                      }`}
                    >
                      {value}
                    </span>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Price & Quantity */}
          <div className="grid gap-6 md:grid-cols-2">
            <div>
              <label className="mb-2 flex items-center gap-2 text-sm font-bold text-stone-700">
                <DollarSign className="h-4 w-4 text-green-600" />
                Price (per seat)
              </label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-lg font-bold text-stone-400">
                  ৳
                </span>
                <input
                  type="number"
                  required
                  min="1"
                  value={formData.price}
                  onChange={(e) =>
                    setFormData({ ...formData, price: e.target.value })
                  }
                  placeholder="1200"
                  className="w-full rounded-xl border-2 border-stone-200 px-4 py-3 pl-10 transition-all focus:border-green-500 focus:outline-none focus:ring-4 focus:ring-green-500/10"
                />
              </div>
            </div>

            <div>
              <label className="mb-2 flex items-center gap-2 text-sm font-bold text-stone-700">
                <Package className="h-4 w-4 text-blue-600" />
                Available Seats
              </label>
              <input
                type="number"
                required
                min="1"
                value={formData.ticketQuantity}
                onChange={(e) =>
                  setFormData({ ...formData, ticketQuantity: e.target.value })
                }
                placeholder="40"
                className="w-full rounded-xl border-2 border-stone-200 px-4 py-3 transition-all focus:border-blue-500 focus:outline-none focus:ring-4 focus:ring-blue-500/10"
              />
            </div>
          </div>

          {/* Date & Time */}
          <div className="grid gap-6 md:grid-cols-2">
            <div>
              <label className="mb-2 flex items-center gap-2 text-sm font-bold text-stone-700">
                <Calendar className="h-4 w-4 text-purple-600" />
                Departure Date
              </label>
              <input
                type="date"
                required
                value={formData.departureDate}
                onChange={(e) =>
                  setFormData({ ...formData, departureDate: e.target.value })
                }
                min={new Date().toISOString().split("T")[0]}
                className="w-full rounded-xl border-2 border-stone-200 px-4 py-3 transition-all focus:border-purple-500 focus:outline-none focus:ring-4 focus:ring-purple-500/10"
              />
            </div>

            <div>
              <label className="mb-2 flex items-center gap-2 text-sm font-bold text-stone-700">
                <Clock className="h-4 w-4 text-orange-600" />
                Departure Time
              </label>
              <input
                type="time"
                required
                value={formData.departureTime}
                onChange={(e) =>
                  setFormData({ ...formData, departureTime: e.target.value })
                }
                className="w-full rounded-xl border-2 border-stone-200 px-4 py-3 transition-all focus:border-orange-500 focus:outline-none focus:ring-4 focus:ring-orange-500/10"
              />
            </div>
          </div>

          {/* Perks */}
          <div>
            <label className="mb-4 flex items-center gap-2 text-sm font-bold text-stone-700">
              <Sparkles className="h-4 w-4 text-amber-600" />
              Amenities & Perks
            </label>
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
              {availablePerks.map((perk) => (
                <label
                  key={perk}
                  className={`flex cursor-pointer items-center gap-3 rounded-xl border-2 p-4 transition-all ${
                    formData.perks.includes(perk)
                      ? "border-amber-500 bg-amber-50 shadow-md"
                      : "border-stone-200 hover:border-stone-300 hover:bg-stone-50"
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={formData.perks.includes(perk)}
                    onChange={() => handlePerkToggle(perk)}
                    className="h-5 w-5 rounded border-2 border-stone-300 text-amber-500 focus:ring-2 focus:ring-amber-500"
                  />
                  <span
                    className={`text-sm font-semibold ${
                      formData.perks.includes(perk)
                        ? "text-amber-700"
                        : "text-stone-700"
                    }`}
                  >
                    {perk}
                  </span>
                </label>
              ))}
            </div>
          </div>

          {/* Image Upload */}
          <div>
            <label className="mb-4 flex items-center gap-2 text-sm font-bold text-stone-700">
              <Upload className="h-4 w-4 text-blue-600" />
              Ticket Image
            </label>

            {imagePreview ? (
              <div className="relative overflow-hidden rounded-2xl">
                <img
                  src={imagePreview}
                  alt="Preview"
                  className="h-80 w-full object-cover"
                />
                <button
                  type="button"
                  onClick={() => {
                    setImagePreview(null);
                    setFormData({ ...formData, image: "" });
                  }}
                  className="absolute right-4 top-4 rounded-full bg-red-500 p-2 text-white shadow-xl transition-transform hover:scale-110 hover:bg-red-600"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
            ) : (
              <div className="group relative overflow-hidden rounded-2xl border-2 border-dashed border-stone-300 bg-stone-50 p-12 text-center transition-all hover:border-amber-400 hover:bg-amber-50">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="absolute inset-0 cursor-pointer opacity-0"
                  id="image-upload"
                />
                <Upload className="mx-auto mb-4 h-16 w-16 text-stone-300 transition-all group-hover:scale-110 group-hover:text-amber-500" />
                <p className="mb-2 text-lg font-bold text-stone-700">
                  {imageUploading
                    ? "Uploading..."
                    : "Drop image here or click to upload"}
                </p>
                <p className="text-sm text-stone-500">
                  PNG, JPG or JPEG (max 5MB)
                </p>
              </div>
            )}
          </div>

          {/* Vendor Info */}
          <div className="rounded-xl bg-gradient-to-br from-stone-50 to-stone-100 p-6">
            <h3 className="mb-4 text-sm font-bold text-stone-700">
              Vendor Information
            </h3>
            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <label className="mb-2 block text-xs font-semibold text-stone-600">
                  Vendor Name
                </label>
                <input
                  type="text"
                  value={vendorName}
                  readOnly
                  className="w-full rounded-lg border border-stone-300 bg-white px-4 py-2 text-stone-600"
                />
              </div>
              <div>
                <label className="mb-2 block text-xs font-semibold text-stone-600">
                  Vendor Email
                </label>
                <input
                  type="email"
                  value={vendorEmail}
                  readOnly
                  className="w-full rounded-lg border border-stone-300 bg-white px-4 py-2 text-stone-600"
                />
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <button
            onClick={handleSubmit}
            disabled={loading || imageUploading}
            className="group relative w-full overflow-hidden rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 py-4 text-lg font-bold text-white shadow-xl transition-all hover:shadow-2xl hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <div className="absolute inset-0 bg-white opacity-0 transition-opacity group-hover:opacity-20"></div>
            <span className="relative flex items-center justify-center gap-3">
              <CheckCircle className="h-6 w-6" />
              {loading ? "Adding Ticket..." : "Add Ticket for Review"}
            </span>
          </button>

          <p className="text-center text-sm text-stone-500">
            ✨ Your ticket will be reviewed by our admin team before going live
          </p>
        </div>
      </div>
    </div>
  );
}

/*
BACKEND INTEGRATION:
POST http://localhost:5000/api/tickets
Body: {
  title, from, to, transportType, price, ticketQuantity,
  departureDate, departureTime, perks[], image,
  vendorId, vendorName, vendorEmail
}
*/
