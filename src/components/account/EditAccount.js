"use client";
import { useState } from "react";
import { toast } from "react-toastify";

export default function EditAccount({ user }) {
  const [form, setForm] = useState({
    name: user?.name || "",
    email: user?.email || "",
    old_password: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);
  const [updatedUser, setUpdatedUser] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const bodyData = {
      _id: user._id,
      name: form.name,
      email: form.email,
      isPremium: user?.isPremium,
      createdAt: user?.createdAt,
      resume: user?.resume,
      __v: user?.__v,
    };

    // ถ้าจะเปลี่ยนรหัสผ่าน ต้องมี old_password
    if (form.password) {
      if (!form.old_password) {
        toast.error("กรุณากรอกรหัสผ่านเดิมเพื่อเปลี่ยนรหัสใหม่");
        setLoading(false);
        return;
      }
      bodyData.password = form.password;
      bodyData.old_password = form.old_password;
    }

    console.log("📤 Data sent to API:", bodyData);

    try {
      const res = await fetch(`http://localhost:8080/api/updateUser`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(bodyData),
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data.error || "Update failed");

      toast.success("✅ อัปเดตบัญชีเรียบร้อยแล้ว!");
      setUpdatedUser(data); // แสดงผลลัพธ์ที่ได้จาก API
    } catch (err) {
      console.error("❌ Update error:", err);
      toast.error("อัปเดตบัญชีไม่สำเร็จ");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w mx-auto mt-10 bg-white p-6 shadow-md rounded-lg">
      <h2 className="text-2xl font-bold mb-4 text-gray-800">✏️ Edit Account</h2>

      <form onSubmit={handleSubmit}>
        <label className="block font-medium mb-1">Name</label>
        <input
          type="text"
          name="name"
          value={form.name}
          onChange={handleChange}
          className="mb-4 w-full border px-3 py-2 rounded"
        />

        <label className="block font-medium mb-1">Email</label>
        <input
          type="email"
          name="email"
          value={form.email}
          onChange={handleChange}
          className="mb-4 w-full border px-3 py-2 rounded"
        />

        <label className="block font-medium mb-1">Current Password</label>
        <input
          type="password"
          name="old_password"
          value={form.old_password}
          onChange={handleChange}
          className="mb-4 w-full border px-3 py-2 rounded"
        />

        <label className="block font-medium mb-1">New Password</label>
        <input
          type="password"
          name="password"
          value={form.password}
          onChange={handleChange}
          className="mb-6 w-full border px-3 py-2 rounded"
        />

        <button
          type="submit"
          disabled={loading}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          {loading ? "Updating..." : "Update"}
        </button>
      </form>

      {updatedUser && (
        <div className="mt-6 bg-gray-50 p-4 rounded shadow text-sm">
          <h4 className="font-semibold mb-2 text-gray-700">🔁 Updated Data:</h4>
          <pre className="whitespace-pre-wrap text-gray-600">
            {JSON.stringify(updatedUser, null, 2)}
          </pre>
        </div>
      )}
    </div>
  );
}
