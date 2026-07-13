import { CalendarDays, Mail, Radio, SendHorizonal } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import CreateNotificationActionBar from "../components/create-notification/CreateNotificationActionBar.jsx";
import CreateNotificationChannelCard from "../components/create-notification/CreateNotificationChannelCard.jsx";
import CreateNotificationField from "../components/create-notification/CreateNotificationField.jsx";
import CreateNotificationSectionCard from "../components/create-notification/CreateNotificationSectionCard.jsx";

const audienceOptions = [
  { value: "all-users", label: "All User" },
  { value: "customers", label: "Customers" },
  { value: "vendors", label: "Vendors" },
];

const deliveryChannelOptions = [
  {
    id: "push",
    title: "In-App Push Notification",
    description: "Sent to the mobile app and delivered in real time.",
    icon: <Radio size={15} />,
  },
  {
    id: "email",
    title: "Email Notification",
    description: "Sent directly to every required email address.",
    icon: <Mail size={15} />,
  },
];

const scheduleModeOptions = [
  { value: "immediately", label: "Send Immediately" },
  { value: "later", label: "Schedule for Later" },
];

const dayOptions = [
  { value: "wednesday", label: "Wednesday" },
  { value: "thursday", label: "Thursday" },
  { value: "friday", label: "Friday" },
];

const timeOptions = [
  { value: "07:00", label: "07:00" },
  { value: "08:00", label: "08:00" },
  { value: "09:00", label: "09:00" },
];

function ScheduleModeRadio({ label, value, checked, onChange }) {
  return (
    <label className="inline-flex cursor-pointer items-center gap-2.5 text-[15px] font-medium text-[#574c45]">
      <input checked={checked} className="accent-[#cf6e38]" name="scheduleMode" onChange={() => onChange(value)} type="radio" />
      <span>{label}</span>
    </label>
  );
}

export default function CreateNotificationPage() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    title: "",
    emailSubject: "",
    message: "",
    audience: "all-users",
    channel: "push",
    scheduleMode: "later",
    scheduleDay: "wednesday",
    scheduleTime: "07:00",
  });

  function updateField(key, value) {
    setForm((current) => ({ ...current, [key]: value }));
  }

  return (
    <div className="space-y-6">
      <section className="space-y-1">
        <h1 className="text-[40px] font-bold tracking-[-0.04em] text-[#18120f]">Create Notification</h1>
        <p className="max-w-[72ch] text-[15px] leading-7 text-[#6f645d]">
          Draft and schedule platform-wide or targeted notifications for your users.
        </p>
      </section>

      <div className="max-w-[920px] space-y-5">
        <CreateNotificationSectionCard
          subtitle="Provide the core message and notification content."
          title="Basic Information"
        >
          <div className="space-y-4">
            <CreateNotificationField
              label="Notification Title"
              onChange={(event) => updateField("title", event.target.value)}
              placeholder="Enter notification title"
              value={form.title}
            />
            <CreateNotificationField
              label="Email Subject (Optional)"
              onChange={(event) => updateField("emailSubject", event.target.value)}
              placeholder="Enter email subject"
              value={form.emailSubject}
            />
            <CreateNotificationField
              as="textarea"
              label="Message Body"
              onChange={(event) => updateField("message", event.target.value)}
              placeholder="Write your message here..."
              value={form.message}
            />
          </div>
        </CreateNotificationSectionCard>

        <CreateNotificationSectionCard
          subtitle="Choose who should receive this notification."
          title="Target Audience"
        >
          <CreateNotificationField
            as="select"
            label="Select Audience Type"
            onChange={(event) => updateField("audience", event.target.value)}
            options={audienceOptions}
            value={form.audience}
          />
        </CreateNotificationSectionCard>

        <CreateNotificationSectionCard
          subtitle="Choose how this message should be delivered."
          title="Delivery Channels"
        >
          <div className="grid gap-4 sm:grid-cols-2">
            {deliveryChannelOptions.map((option) => (
              <CreateNotificationChannelCard
                key={option.id}
                {...option}
                isActive={form.channel === option.id}
                onClick={() => updateField("channel", option.id)}
              />
            ))}
          </div>
        </CreateNotificationSectionCard>

        <CreateNotificationSectionCard
          subtitle="Control when this notification should be sent."
          title="Timing & Schedule"
        >
          <div className="space-y-5">
            <div className="flex flex-wrap items-center gap-5">
              {scheduleModeOptions.map((option) => (
                <ScheduleModeRadio
                  key={option.value}
                  checked={form.scheduleMode === option.value}
                  label={option.label}
                  onChange={(value) => updateField("scheduleMode", value)}
                  value={option.value}
                />
              ))}
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <button
                className="inline-flex h-13 cursor-pointer items-center gap-3 rounded-[12px] border border-[#d9d1ca] bg-[#f6f4f2] px-4 text-[15px] font-medium text-[#2a1f19] transition hover:bg-white"
                type="button"
              >
                <CalendarDays size={16} className="text-[#8f8179]" />
                <span>{dayOptions.find((option) => option.value === form.scheduleDay)?.label}</span>
              </button>

              <button
                className="inline-flex h-13 cursor-pointer items-center gap-3 rounded-[12px] border border-[#d9d1ca] bg-[#f6f4f2] px-4 text-[15px] font-medium text-[#2a1f19] transition hover:bg-white"
                type="button"
              >
                <SendHorizonal size={16} className="text-[#8f8179]" />
                <span>{timeOptions.find((option) => option.value === form.scheduleTime)?.label}</span>
              </button>
            </div>
          </div>
        </CreateNotificationSectionCard>
      </div>

      <CreateNotificationActionBar
        onCancel={() => navigate("/notifications")}
        onSaveDraft={() => navigate("/notifications")}
        onSend={() => navigate("/notifications")}
      />
    </div>
  );
}
