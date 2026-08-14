import React, { useEffect, useState } from "react";
import PageHeader from "../components/layout/PageHeader.jsx";
import Loader from "../components/common/Loader.jsx";
import ErrorState from "../components/common/ErrorState.jsx";
import { useToast } from "../components/common/Toast.jsx";
import { useFetch } from "../hooks/useFetch.js";
import { getSettings, updateSettings } from "../api/settingsApi.js";

const FIELDS = [
  { name: "brandName", label: "Brand Name" },
  { name: "tagline", label: "Tagline" },
  { name: "heroText", label: "Hero Text", textarea: true },
  { name: "instagramUrl", label: "Instagram URL" },
  { name: "youtubeUrl", label: "YouTube URL" },
  { name: "contactEmail", label: "Contact Email" },
  { name: "footerText", label: "Footer Text" },
  { name: "joinCrewText", label: "Join Crew Text" },
];

const Settings = () => {
  const { data, loading, error, refetch } = useFetch(getSettings, []);
  const { showToast } = useToast();
  const [form, setForm] = useState(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (data?.settings) setForm(data.settings);
  }, [data]);

  const handleSave = async () => {
    setSaving(true);
    try {
      await updateSettings(form);
      showToast("Settings saved");
      refetch();
    } catch (err) {
      showToast(err.response?.data?.message || "Failed to save", "error");
    } finally {
      setSaving(false);
    }
  };

  if (loading || !form) return <Loader label="Loading settings..." />;
  if (error) return <ErrorState message={error} onRetry={refetch} />;

  return (
    <div>
      <PageHeader title="Settings" description="Site-wide content the public site reads at runtime." />

      <div className="card max-w-2xl space-y-4 p-6">
        {FIELDS.map((field) => (
          <div key={field.name}>
            <label className="label">{field.label}</label>
            {field.textarea ? (
              <textarea
                rows={3}
                className="input"
                value={form[field.name] || ""}
                onChange={(e) => setForm((f) => ({ ...f, [field.name]: e.target.value }))}
              />
            ) : (
              <input
                className="input"
                value={form[field.name] || ""}
                onChange={(e) => setForm((f) => ({ ...f, [field.name]: e.target.value }))}
              />
            )}
          </div>
        ))}

        <button onClick={handleSave} disabled={saving} className="btn-primary">
          {saving ? "Saving..." : "Save Settings"}
        </button>
      </div>
    </div>
  );
};

export default Settings;
