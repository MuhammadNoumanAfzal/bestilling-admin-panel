import { CalendarDays, Check, Mail, Radio, SendHorizonal, Smartphone } from "lucide-react";
import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
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
    badge: "Fast",
  },
  {
    id: "email",
    title: "Email Notification",
    description: "Sent directly to every required email address.",
    icon: <Mail size={15} />,
  },
  {
    id: "sms",
    title: "SMS Notification",
    description: "Best for urgent alerts, service interruptions, and time-sensitive reminders.",
    icon: <Smartphone size={15} />,
  },
];

const scheduleModeOptions = [
  { value: "immediately", label: "Send Immediately" },
  { value: "later", label: "Schedule for Later" },
];

function ScheduleModeRadio({ label, value, checked, onChange }) {
  return (
    <label className="inline-flex cursor-pointer items-center gap-2.5 text-[15px] font-medium text-[#574c45] "  >
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
    channels: ["push"],
    scheduleMode: "later",
    scheduleDate: "",
    scheduleTime: "07:00",
  });
  const [errors, setErrors] = useState({});

  function updateField(key, value) {
    setForm((current) => ({ ...current, [key]: value }));
    setErrors((current) => ({ ...current, [key]: "" }));
  }

  function toggleChannel(channelId) {
    setForm((current) => {
      const exists = current.channels.includes(channelId);
      const nextChannels = exists
        ? current.channels.filter((item) => item !== channelId)
        : [...current.channels, channelId];

      return {
        ...current,
        channels: nextChannels,
      };
    });
    setErrors((current) => ({ ...current, channels: "" }));
  }

  const minScheduleDate = useMemo(() => new Date().toISOString().split("T")[0], []);

  function validateForm({ requireSchedule = true } = {}) {
    const nextErrors = {};

    if (!form.title.trim()) {
      nextErrors.title = "Please enter a notification title.";
    }

    if (!form.message.trim()) {
      nextErrors.message = "Please enter the notification message.";
    }

    if (form.channels.length === 0) {
      nextErrors.channels = "Please select at least one delivery channel.";
    }

    if (form.channels.includes("email") && !form.emailSubject.trim()) {
      nextErrors.emailSubject = "Email subject is required when email is selected.";
    }

    if (requireSchedule && form.scheduleMode === "later" && !form.scheduleDate) {
      nextErrors.scheduleDate = "Please choose a schedule date.";
    }

    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  }

  async function handleSaveDraft() {
    if (!validateForm({ requireSchedule: false })) {
      return;
    }

    await Swal.fire({
      icon: "success",
      title: "Draft saved",
      text: "Your notification draft is ready to finish later.",
      confirmButtonColor: "#cf6e38",
    });
    navigate("/notifications");
  }

  async function handleSend() {
    if (!validateForm({ requireSchedule: true })) {
      return;
    }

    const scheduleText =
      form.scheduleMode === "immediately"
        ? "This notification will be sent right away."
        : `Scheduled for ${form.scheduleDate} at ${form.scheduleTime}.`;

    await Swal.fire({
      icon: "success",
      title: form.scheduleMode === "immediately" ? "Notification sent" : "Notification scheduled",
      text: scheduleText,
      confirmButtonColor: "#cf6e38",
    });
    navigate("/notifications");
  }

  return (
    <div className="space-y-6">
      <section className="space-y-1">
        <h1 className="text-[40px] font-bold tracking-[-0.04em] text-[#18120f]">Create Notification</h1>
        <p className="max-w-[72ch] text-[16px] leading-7 text-[#6f645d]">
          Draft and schedule platform-wide or targeted notifications for your users.
        </p>
      </section>

      <div className="max-w-[980px] space-y-5">
        <CreateNotificationSectionCard
          subtitle="Provide the core message and notification content."
          title="Basic Information"
        >
          <div className="space-y-4">
            <CreateNotificationField
              error={errors.title}
              label="Notification Title"
              onChange={(event) => updateField("title", event.target.value)}
              placeholder="Enter notification title"
              value={form.title}
            />
            <CreateNotificationField
              error={errors.emailSubject}
              helperText="Used only when email delivery is selected."
              label="Email Subject (Optional)"
              onChange={(event) => updateField("emailSubject", event.target.value)}
              placeholder="Enter email subject"
              value={form.emailSubject}
            />
            <CreateNotificationField
              as="textarea"
              error={errors.message}
              helperText="Keep it short, clear, and action-focused for better response rates."
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
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {deliveryChannelOptions.map((option) => (
              <CreateNotificationChannelCard
                key={option.id}
                {...option}
                isActive={form.channels.includes(option.id)}
                onClick={() => toggleChannel(option.id)}
              />
            ))}
          </div>
          {errors.channels ? <p className="mt-3 text-[13px] font-medium text-[#d15b42]">{errors.channels}</p> : null}
          {!errors.channels ? (
            <p className="mt-3 text-[13px] leading-5 text-[#8d8077]">
              Selected: {form.channels.length > 0 ? form.channels.join(", ") : "None"}
            </p>
          ) : null}
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
              <div className="rounded-[14px] border border-[#ece2db] bg-[#fcfbfa] p-4">
                <div className="mb-3 flex items-center gap-2 text-[#7f736b]">
                  <CalendarDays size={16} />
                  <span className="text-[13px] font-bold uppercase tracking-[0.08em]">Schedule Date</span>
                </div>
                <CreateNotificationField
                  error={errors.scheduleDate}
                  as="input"
                  disabled={form.scheduleMode === "immediately"}
                  label="Choose Date"
                  min={minScheduleDate}
                  onChange={(event) => updateField("scheduleDate", event.target.value)}
                  type="date"
                  value={form.scheduleDate}
                />
              </div>

              <div className="rounded-[14px] border border-[#ece2db] bg-[#fcfbfa] p-4">
                <div className="mb-3 flex items-center gap-2 text-[#7f736b]">
                  <SendHorizonal size={16} />
                  <span className="text-[13px] font-bold uppercase tracking-[0.08em]">Send Time</span>
                </div>
                <CreateNotificationField
                  as="input"
                  disabled={form.scheduleMode === "immediately"}
                  helperText={
                    form.scheduleMode === "immediately"
                      ? "Time is disabled when sending immediately."
                      : "Choose the time in 24-hour format when the notification should go live."
                  }
                  label="Choose Time"
                  lang="en-GB"
                  onChange={(event) => updateField("scheduleTime", event.target.value)}
                  step="60"
                  type="time"
                  value={form.scheduleTime}
                />
              </div>
            </div>

            <div className="rounded-[14px] border border-[#f0ddd2] bg-[linear-gradient(180deg,#fff8f4_0%,#fffdfa_100%)] px-4 py-4">
              <div className="flex items-start gap-3">
                <span className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#fff0e7] text-[#cf6e38]">
                  <Check size={16} />
                </span>
                <div>
                  <p className="text-[15px] font-bold text-[#2a1f19]">Delivery summary</p>
                  <p className="mt-1 text-[14px] leading-6 text-[#7a6e66]">
                    Audience: {audienceOptions.find((option) => option.value === form.audience)?.label}. Channels:{" "}
                    {form.channels.length > 0 ? form.channels.join(", ") : "None selected"}.
                  </p>
                  <p className="text-[14px] leading-6 text-[#7a6e66]">
                    {form.scheduleMode === "immediately"
                      ? "This notification will be sent immediately after confirmation."
                      : form.scheduleDate
                        ? `This notification will be scheduled for ${form.scheduleDate} at ${form.scheduleTime}.`
                        : "Choose a date and time to schedule this notification."}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </CreateNotificationSectionCard>
      </div>

      <CreateNotificationActionBar
        onCancel={() => navigate("/notifications")}
        onSaveDraft={handleSaveDraft}
        onSend={handleSend}
        disableSend={!form.title.trim() || !form.message.trim() || form.channels.length === 0}
      />
    </div>
  );
}
