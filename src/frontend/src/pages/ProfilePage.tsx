import { useNavigate } from "@tanstack/react-router";
import { ChevronLeft, Edit2, Plus, Save, X } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { BottomNav } from "../components/BottomNav";
import { useActor } from "../hooks/useActor";

interface LocalUserProfile {
  name: string;
  email: string;
  savedAddresses: string[];
}

const DEFAULT_PROFILE: LocalUserProfile = {
  name: "Priya Sharma",
  email: "priya.sharma@example.com",
  savedAddresses: [
    "Home: 12, Green Park Colony, Jaipur",
    "Work: 5th Floor, Tech Hub, Vaishali Nagar",
  ],
};

export default function ProfilePage() {
  const navigate = useNavigate();
  const { actor } = useActor();
  const [profile, setProfile] = useState<LocalUserProfile>(DEFAULT_PROFILE);
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState<LocalUserProfile>(DEFAULT_PROFILE);
  const [newAddress, setNewAddress] = useState("");
  const [addingAddress, setAddingAddress] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!actor) return;
    actor
      .getCallerUserProfile()
      .then((p) => {
        if (p.name) setProfile(p as LocalUserProfile);
      })
      .catch(() => {});
  }, [actor]);

  const initials = profile.name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  const handleSave = async () => {
    setSaving(true);
    try {
      if (actor) {
        await actor.saveCallerUserProfile(draft);
      }
      setProfile(draft);
      setEditing(false);
      toast.success("Profile saved!");
    } catch {
      toast.error("Failed to save profile");
    } finally {
      setSaving(false);
    }
  };

  const handleAddAddress = () => {
    if (!newAddress.trim()) return;
    const updated = {
      ...draft,
      savedAddresses: [...draft.savedAddresses, newAddress.trim()],
    };
    setDraft(updated);
    setProfile(updated);
    setNewAddress("");
    setAddingAddress(false);
  };

  const handleRemoveAddress = (idx: number) => {
    const updated = {
      ...profile,
      savedAddresses: profile.savedAddresses.filter((_, i) => i !== idx),
    };
    setProfile(updated);
    setDraft(updated);
  };

  return (
    <div className="app-shell pb-24">
      <div className="bg-gradient-to-br from-green-600 to-emerald-700 px-4 pt-10 pb-10">
        <div className="flex items-center gap-3 mb-6">
          <button
            type="button"
            onClick={() => navigate({ to: "/home" })}
            className="text-white"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>
          <h1 className="font-display font-bold text-xl text-white">
            My Profile
          </h1>
          <button
            type="button"
            onClick={() => {
              if (editing) {
                setDraft(profile);
                setEditing(false);
              } else {
                setDraft(profile);
                setEditing(true);
              }
            }}
            className="ml-auto text-white"
          >
            <Edit2 className="w-5 h-5" />
          </button>
        </div>
        <div className="flex flex-col items-center gap-2">
          <div className="w-20 h-20 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center border-4 border-white/30">
            <span className="font-display font-bold text-2xl text-white">
              {initials}
            </span>
          </div>
          <p className="font-display font-bold text-xl text-white">
            {profile.name}
          </p>
          <p className="text-white/70 text-sm">{profile.email}</p>
        </div>
      </div>

      <div className="px-4 py-5 flex flex-col gap-4">
        {editing && (
          <div className="bg-card rounded-2xl p-4 shadow-xs flex flex-col gap-3">
            <h3 className="font-display font-bold">Edit Profile</h3>
            <div>
              <label
                htmlFor="profile-name"
                className="text-xs font-semibold text-muted-foreground mb-1 block"
              >
                Name
              </label>
              <input
                id="profile-name"
                value={draft.name}
                onChange={(e) =>
                  setDraft((d) => ({ ...d, name: e.target.value }))
                }
                className="w-full bg-secondary rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
              />
            </div>
            <div>
              <label
                htmlFor="profile-email"
                className="text-xs font-semibold text-muted-foreground mb-1 block"
              >
                Email
              </label>
              <input
                id="profile-email"
                value={draft.email}
                onChange={(e) =>
                  setDraft((d) => ({ ...d, email: e.target.value }))
                }
                className="w-full bg-secondary rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
              />
            </div>
            <button
              type="button"
              data-ocid="profile.save_button"
              onClick={handleSave}
              disabled={saving}
              className="bg-primary text-primary-foreground py-3 rounded-xl font-bold flex items-center justify-center gap-2 disabled:opacity-70"
            >
              <Save className="w-4 h-4" />
              {saving ? "Saving..." : "Save Profile"}
            </button>
          </div>
        )}

        <div className="grid grid-cols-3 gap-2">
          {[
            { label: "Orders", value: "12", emoji: "📦" },
            { label: "Saved", value: "5", emoji: "❤️" },
            { label: "Reviews", value: "8", emoji: "⭐" },
          ].map((stat) => (
            <div
              key={stat.label}
              className="bg-card rounded-xl p-3 flex flex-col items-center gap-1 shadow-xs"
            >
              <span className="text-xl">{stat.emoji}</span>
              <span className="font-display font-bold text-lg">
                {stat.value}
              </span>
              <span className="text-xs text-muted-foreground">
                {stat.label}
              </span>
            </div>
          ))}
        </div>

        <div className="bg-card rounded-2xl shadow-xs overflow-hidden">
          <div className="px-4 py-3 border-b border-border flex items-center justify-between">
            <h3 className="font-display font-bold">Saved Addresses</h3>
            <button
              type="button"
              data-ocid="profile.add_address_button"
              onClick={() => setAddingAddress(true)}
              className="text-primary"
            >
              <Plus className="w-5 h-5" />
            </button>
          </div>
          <div className="px-4 py-2">
            {addingAddress && (
              <div className="flex gap-2 py-2">
                <input
                  placeholder="Enter address..."
                  value={newAddress}
                  onChange={(e) => setNewAddress(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleAddAddress()}
                  className="flex-1 bg-secondary rounded-xl px-3 py-2 text-sm focus:outline-none"
                />
                <button
                  type="button"
                  onClick={handleAddAddress}
                  className="bg-primary text-primary-foreground px-3 py-2 rounded-xl text-sm font-bold"
                >
                  Add
                </button>
              </div>
            )}
            {profile.savedAddresses.length === 0 ? (
              <p className="text-sm text-muted-foreground py-3">
                No saved addresses yet
              </p>
            ) : (
              profile.savedAddresses.map((addr, idx) => (
                <div
                  key={addr}
                  className="flex items-start gap-3 py-3 border-b border-border last:border-0"
                >
                  <span className="text-lg">{idx === 0 ? "🏠" : "💼"}</span>
                  <p className="text-sm text-foreground flex-1">{addr}</p>
                  <button
                    type="button"
                    onClick={() => handleRemoveAddress(idx)}
                  >
                    <X className="w-4 h-4 text-muted-foreground" />
                  </button>
                </div>
              ))
            )}
          </div>
        </div>

        <div className="bg-card rounded-2xl shadow-xs overflow-hidden">
          <div className="px-4 py-3 border-b border-border">
            <h3 className="font-display font-bold">Order History</h3>
          </div>
          <div className="px-4 py-3 flex flex-col gap-3">
            {[
              {
                id: "#2891",
                items: "Paneer Butter Masala, Dal Tadka",
                total: 345,
                status: "Delivered",
                date: "Today, 1:30 PM",
              },
              {
                id: "#2847",
                items: "Veg Biryani, Gulab Jamun",
                total: 235,
                status: "Delivered",
                date: "Yesterday, 8:15 PM",
              },
              {
                id: "#2803",
                items: "Pav Bhaji, Aloo Paratha",
                total: 210,
                status: "Delivered",
                date: "Mar 10, 12:45 PM",
              },
            ].map((order) => (
              <div
                key={order.id}
                className="border border-border rounded-xl p-3"
              >
                <div className="flex justify-between items-start">
                  <div>
                    <p className="font-bold text-sm">{order.id}</p>
                    <p className="text-xs text-muted-foreground mt-0.5 line-clamp-1">
                      {order.items}
                    </p>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      {order.date}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-primary">₹{order.total}</p>
                    <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full font-semibold">
                      {order.status}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <BottomNav />
    </div>
  );
}
