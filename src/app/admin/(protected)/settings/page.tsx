import { getSettings } from "@/lib/settings";
import { SettingsForm } from "@/components/admin/SettingsForm";

export default async function AdminSettingsPage() {
  const settings = await getSettings();
  return (
    <div>
      <h1 className="text-2xl font-semibold mb-6">Settings</h1>
      <SettingsForm settings={settings} />
    </div>
  );
}
