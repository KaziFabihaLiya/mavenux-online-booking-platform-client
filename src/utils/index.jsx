// src/utils/index.js - FIXED VERSION

// Save or update user in MongoDB
export const saveOrUpdateUser = async ({ name, email, image, uid }) => {
  try {
    console.log("💾 Saving user to MongoDB:", { name, email, image, uid });

    const userData = {
      email: email,
      displayName: name || "User",
      photoURL: image || null,
      uid: uid,
    };

    // Use the Vite proxy /api path so requests go to the backend server
    const response = await fetch("/api/user", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(userData),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Failed to save user");
    }

    console.log("✅ User saved successfully:", data);
    return data;
  } catch (error) {
    console.error("❌ Error saving user:", error);
    throw error;
  }
};

// Image upload to ImgBB
export const imageUpload = async (imageFile) => {
  if (!imageFile) return null;

  try {
    const formData = new FormData();
    formData.append("image", imageFile);

    const response = await fetch(
      `https://api.imgbb.com/1/upload?key=${
        import.meta.env.VITE_IMGBB_API_KEY
      }`,
      {
        method: "POST",
        body: formData,
      }
    );

    const data = await response.json();

    if (!data.success) {
      throw new Error("Image upload failed");
    }

    return data.data.display_url;
  } catch (error) {
    console.error("Image upload error:", error);
    throw error;
  }
};
