//Form with upload
import { useState } from "react";
import {
  MapPin,
  Calendar,
  DollarSign,
  Package,
  Upload,
  Loader2,
  CheckCircle,
  Bus,
  Train,
  Ship,
  Plane,
} from "lucide-react";

// EXPLANATION:
// Vendor can add new tickets
// Image upload to imgbb
// All fields required including perks checkboxes
// Initial status: "pending" (admin approval needed)

export default function AddTicket() {
  const [loading, setLoading] = useState(false);
  const [imageUploading, setImageUploading] = useState(false);
  const [imagePreview, setImagePreview] = useState(null);
  const [message, setMessage] = useState({ type: "", text: "" });

  // Get vendor info from auth context (replace with your auth)
  const vendorName = "John Doe"; // Replace with actual auth user name
  const vendorEmail = "vendor@example.com"; // Replace with actual auth user email

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
  });

  const transportTypes = [
    { value: "Bus", icon: Bus, color: "text-blue-600" },
    { value: "Train", icon: Train, color: "text-green-600" },
    { value: "Launch", icon: Ship, color: "text-cyan-600" },
    { value: "Plane", icon: Plane, color: "text-purple-600" },
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

      const formData = new FormData();
      formData.append("image", file);

      // Upload to imgbb (replace with your API key)
      const response = await fetch(
        `https://api.imgbb.com/1/upload?key=YOUR_IMGBB_API_KEY`,
        {
          method: "POST",
          body: formData,
        }
      );

      const data = await response.json();

      if (data.success) {
        setFormData((prev) => ({ ...prev, image: data.data.display_url }));
        setImagePreview(data.data.display_url);
        setMessage({ type: "success", text: "Image uploaded successfully!" });
      } else {
        throw new Error("Upload failed");
      }
    } catch (error) {
      console.error("Image upload error:", error);
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
      setMessage({ type: "error", text: "Please select at least one perk" });
      return;
    }

    try {
      setLoading(true);

      const ticketData = {
        ...formData,
        price: parseFloat(formData.price),
        ticketQuantity: parseInt(formData.ticketQuantity),
        vendorName,
        vendorEmail,
        status: "pending",
        createdAt: new Date().toISOString(),
      };

      // SEND TO BACKEND
      const response = await fetch("/api/vendor/tickets", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(ticketData),
      });

      if (response.ok) {
        setMessage({
          type: "success",
          text: "Ticket added successfully! Waiting for admin approval.",
        });

        // Reset
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
        });
        setImagePreview(null);
      } else {
        throw new Error("Failed to add ticket");
      }
    } catch (error) {
      console.error("Error:", error);
      setMessage({ type: "error", text: "Failed to add ticket" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto">
      <div className="bg-white rounded-xl shadow-md overflow-hidden">
        <div className="bg-gradient-to-r from-amber-500 to-amber-600 p-6">
          <h2 className="text-2xl font-bold text-white mb-2">Add New Ticket</h2>
          <p className="text-amber-100">
            Fill in the details to add a new travel ticket
          </p>
        </div>

        <div className="p-6 space-y-6">
          {message.text && (
            <div
              className={`p-4 rounded-lg ${
                message.type === "success"
                  ? "bg-green-50 text-green-700 border border-green-200"
                  : "bg-red-50 text-red-700 border border-red-200"
              }`}
            >
              {message.text}
            </div>
          )}

          <div>
            <label className="block text-sm font-semibold text-stone-700 mb-2">
              Ticket Title *
            </label>
            <input
              type="text"
              required
              value={formData.title}
              onChange={(e) =>
                setFormData({ ...formData, title: e.target.value })
              }
              placeholder="e.g., Dhaka to Chittagong Express"
              className="w-full px-4 py-3 border border-stone-300 rounded-lg focus:ring-2 focus:ring-amber-500 outline-none"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-stone-700 mb-2">
                <MapPin className="w-4 h-4 inline mr-1" />
                From (Location) *
              </label>
              <input
                type="text"
                required
                value={formData.from}
                onChange={(e) =>
                  setFormData({ ...formData, from: e.target.value })
                }
                placeholder="e.g., Dhaka"
                className="w-full px-4 py-3 border border-stone-300 rounded-lg focus:ring-2 focus:ring-amber-500 outline-none"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-stone-700 mb-2">
                <MapPin className="w-4 h-4 inline mr-1" />
                To (Location) *
              </label>
              <input
                type="text"
                required
                value={formData.to}
                onChange={(e) =>
                  setFormData({ ...formData, to: e.target.value })
                }
                placeholder="e.g., Chittagong"
                className="w-full px-4 py-3 border border-stone-300 rounded-lg focus:ring-2 focus:ring-amber-500 outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-stone-700 mb-3">
              Transport Type *
            </label>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {transportTypes.map(({ value, icon: Icon, color }) => (
                <button
                  key={value}
                  type="button"
                  onClick={() =>
                    setFormData({ ...formData, transportType: value })
                  }
                  className={`flex items-center justify-center gap-2 p-4 border-2 rounded-lg transition-all ${
                    formData.transportType === value
                      ? "border-amber-500 bg-amber-50"
                      : "border-stone-300 hover:border-stone-400"
                  }`}
                >
                  <Icon className={`w-5 h-5 ${color}`} />
                  <span className="font-medium">{value}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-stone-700 mb-2">
                <DollarSign className="w-4 h-4 inline mr-1" />
                Price (per unit) *
              </label>
              <input
                type="number"
                required
                min="1"
                step="0.01"
                value={formData.price}
                onChange={(e) =>
                  setFormData({ ...formData, price: e.target.value })
                }
                placeholder="e.g., 1200"
                className="w-full px-4 py-3 border border-stone-300 rounded-lg focus:ring-2 focus:ring-amber-500 outline-none"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-stone-700 mb-2">
                <Package className="w-4 h-4 inline mr-1" />
                Ticket Quantity *
              </label>
              <input
                type="number"
                required
                min="1"
                value={formData.ticketQuantity}
                onChange={(e) =>
                  setFormData({ ...formData, ticketQuantity: e.target.value })
                }
                placeholder="e.g., 40"
                className="w-full px-4 py-3 border border-stone-300 rounded-lg focus:ring-2 focus:ring-amber-500 outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-stone-700 mb-2">
                <Calendar className="w-4 h-4 inline mr-1" />
                Departure Date *
              </label>
              <input
                type="date"
                required
                value={formData.departureDate}
                onChange={(e) =>
                  setFormData({ ...formData, departureDate: e.target.value })
                }
                min={new Date().toISOString().split("T")[0]}
                className="w-full px-4 py-3 border border-stone-300 rounded-lg focus:ring-2 focus:ring-amber-500 outline-none"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-stone-700 mb-2">
                Departure Time *
              </label>
              <input
                type="time"
                required
                value={formData.departureTime}
                onChange={(e) =>
                  setFormData({ ...formData, departureTime: e.target.value })
                }
                className="w-full px-4 py-3 border border-stone-300 rounded-lg focus:ring-2 focus:ring-amber-500 outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-stone-700 mb-3">
              Perks (Select at least one) *
            </label>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {availablePerks.map((perk) => (
                <label
                  key={perk}
                  className={`flex items-center gap-2 p-3 border-2 rounded-lg cursor-pointer transition-all ${
                    formData.perks.includes(perk)
                      ? "border-amber-500 bg-amber-50"
                      : "border-stone-300 hover:border-stone-400"
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={formData.perks.includes(perk)}
                    onChange={() => handlePerkToggle(perk)}
                    className="w-4 h-4 text-amber-500 rounded focus:ring-amber-500"
                  />
                  <span className="text-sm font-medium">{perk}</span>
                </label>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-stone-700 mb-2">
              <Upload className="w-4 h-4 inline mr-1" />
              Ticket Image *
            </label>

            {imagePreview ? (
              <div className="relative">
                <img
                  src={imagePreview}
                  alt="Preview"
                  className="w-full h-64 object-cover rounded-lg"
                />
                <button
                  type="button"
                  onClick={() => {
                    setImagePreview(null);
                    setFormData({ ...formData, image: "" });
                  }}
                  className="absolute top-2 right-2 bg-red-500 text-white px-3 py-1 rounded-lg text-sm font-medium hover:bg-red-600"
                >
                  Remove
                </button>
              </div>
            ) : (
              <div className="border-2 border-dashed border-stone-300 rounded-lg p-8 text-center hover:border-amber-500 transition-colors">
                <Upload className="w-12 h-12 text-stone-400 mx-auto mb-3" />
                <p className="text-stone-600 mb-2">
                  Click to upload or drag and drop
                </p>
                <p className="text-sm text-stone-500">
                  PNG, JPG or JPEG (max 5MB)
                </p>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                  id="image-upload"
                />
                <label
                  htmlFor="image-upload"
                  className="inline-block mt-4 px-6 py-2 bg-amber-500 text-white rounded-lg cursor-pointer hover:bg-amber-600 transition-colors"
                >
                  {imageUploading ? (
                    <span className="flex items-center gap-2">
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Uploading...
                    </span>
                  ) : (
                    "Choose Image"
                  )}
                </label>
              </div>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-stone-50 p-4 rounded-lg">
            <div>
              <label className="block text-sm font-semibold text-stone-600 mb-1">
                Vendor Name
              </label>
              <input
                type="text"
                value={vendorName}
                readOnly
                className="w-full px-4 py-2 bg-white border border-stone-300 rounded-lg text-stone-600"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-stone-600 mb-1">
                Vendor Email
              </label>
              <input
                type="email"
                value={vendorEmail}
                readOnly
                className="w-full px-4 py-2 bg-white border border-stone-300 rounded-lg text-stone-600"
              />
            </div>
          </div>

          <button
            onClick={handleSubmit}
            disabled={loading || imageUploading}
            className="w-full py-4 bg-gradient-to-r from-amber-500 to-amber-600 text-white font-bold rounded-lg hover:from-amber-600 hover:to-amber-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                Adding Ticket...
              </>
            ) : (
              <>
                <CheckCircle className="w-5 h-5" />
                Add Ticket
              </>
            )}
          </button>

          <p className="text-center text-sm text-stone-500">
            Your ticket will be submitted for admin approval
          </p>
        </div>
      </div>
    </div>
  );
}

/*
INTEGRATION:
1. Replace vendorName and vendorEmail with actual auth context values
2. Add your imgbb API key in handleImageUpload
3. Backend endpoint: POST /api/vendor/tickets
4. Ticket saved with status: "pending"
5. After approval by admin, ticket appears in "All Tickets" page
*/