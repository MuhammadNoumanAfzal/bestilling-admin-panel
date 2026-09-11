import { nt, useNotificationLanguage, notificationError, notificationDialog, notificationDate, notificationLocale, notificationChannels } from "../notificationTranslation.js";
import { CalendarDays, Check, Mail, Radio, SendHorizonal } from "lucide-react";
import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import CreateNotificationActionBar from "../components/create-notification/CreateNotificationActionBar.jsx";
import CreateNotificationChannelCard from "../components/create-notification/CreateNotificationChannelCard.jsx";
import CreateNotificationField from "../components/create-notification/CreateNotificationField.jsx";
import CreateNotificationSectionCard from "../components/create-notification/CreateNotificationSectionCard.jsx";
import { createAdminNotificationRequest } from "../api/notificationsApi.js";

const audienceOptions = [
  { value: "all-users", label: "All User" },
  { value: "customers", label: "Customers" },
  { value: "vendors", label: "Vendors" },
];

const deliveryChannelOptions = [
  {
    id: "push",
    title: "Web Inbox & Browser Alert",
    description: "Saved to the recipient's notification inbox. A browser alert is sent when permission is enabled.",
    icon: <Radio size={15} />,
    badge: "Web",
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

function ScheduleModeRadio({ label, value, checked, onChange }) {
  useNotificationLanguage();
  return (
    <label className="inline-flex cursor-pointer items-center gap-2.5 text-[15px] font-medium text-[#574c45] "  >
      <input checked={checked} className="accent-[#cf6e38]" name="scheduleMode" onChange={() => onChange(value)} type="radio" />
      <span>{nt(label)}</span>
    </label>
  );
}

export default function CreateNotificationPage() {
  useNotificationLanguage();
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
  const [isSubmitting, setIsSubmitting] = useState(false);

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

  async function handleSend() {
    if (!validateForm({ requireSchedule: true })) {
      return;
    }

    const audience = {
      "all-users": "ALL_USERS",
      customers: "CUSTOMERS",
      vendors: "VENDORS",
    }[form.audience];

    setIsSubmitting(true);
    try {
      const result = await createAdminNotificationRequest({
        title: form.title.trim(),
        message: form.message.trim(),
        emailSubject: form.channels.includes("email") ? form.emailSubject.trim() : null,
        audience,
        channels: form.channels.map((channel) => (channel === "push" ? "PUSH" : "EMAIL")),
        // The inbox is the durable delivery record, including for email-only sends.
        saveToInbox: true,
        sendBrowserPush: form.channels.includes("push"),
        sendEmail: form.channels.includes("email"),
        schedule:
          form.scheduleMode === "later"
            ? {
                date: form.scheduleDate,
                time: form.scheduleTime,
                timezone: "Europe/Oslo",
              }
            : null,
      });

      const delivery = result?.delivery;
      const deliveryText = [
        delivery?.inboxCreated ? nt(delivery.inboxCreated === 1 ? "{{count}} inbox recipient" : "{{count}} inbox recipients", { count: delivery.inboxCreated }) : "",
        delivery?.browserPushQueued ? nt(delivery.browserPushQueued === 1 ? "{{count}} browser alert queued" : "{{count}} browser alerts queued", { count: delivery.browserPushQueued }) : "",
        delivery?.emailQueued ? nt(delivery.emailQueued === 1 ? "{{count}} email queued" : "{{count}} emails queued", { count: delivery.emailQueued }) : "",
      ]
        .filter(Boolean)
        .join(". ");

      await Swal.fire(notificationDialog({
        icon: "success",
        title: form.scheduleMode === "immediately" ? "Notification created" : "Notification scheduled",
        text: deliveryText || notificationError(result?.message, "The notification was accepted by the delivery service."),
        confirmButtonColor: "#cf6e38",
      }));
      navigate("/notifications");
    } catch (error) {
      await Swal.fire(notificationDialog({
        icon: "error",
        title: "Notification was not created",
        text: notificationError(error),
        confirmButtonColor: "#cf6e38",
      }));
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="space-y-6">
      <div className="max-w-[980px] space-y-5">
        <CreateNotificationSectionCard
          subtitle={nt("Provide the core message and notification content.")}
          title={nt("Basic Information")}
        >
          <div className="space-y-4">
            <CreateNotificationField
              error={errors.title}
              label={nt("Notification Title")}
              onChange={(event) => updateField("title", event.target.value)}
              placeholder={nt("Enter notification title")}
              value={form.title}
            />
            <CreateNotificationField
              error={errors.emailSubject}
              helperText={nt("Used only when email delivery is selected.")}
              label={nt("Email Subject (Optional)")}
              onChange={(event) => updateField("emailSubject", event.target.value)}
              placeholder={nt("Enter email subject")}
              value={form.emailSubject}
            />
            <CreateNotificationField
              as="textarea"
              error={errors.message}
              helperText={nt("Keep it short, clear, and action-focused for better response rates.")}
              label={nt("Message Body")}
              onChange={(event) => updateField("message", event.target.value)}
              placeholder={nt("Write your message here...")}
              value={form.message}
            />
          </div>
        </CreateNotificationSectionCard>

        <CreateNotificationSectionCard
          subtitle={nt("Choose who should receive this notification.")}
          title={nt("Target Audience")}
        >
          <CreateNotificationField
            as="select"
            label={nt("Select Audience Type")}
            onChange={(event) => updateField("audience", event.target.value)}
            options={audienceOptions}
            value={form.audience}
          />
        </CreateNotificationSectionCard>

        <CreateNotificationSectionCard
          subtitle={nt("Choose how this message should be delivered.")}
          title={nt("Delivery Channels")}
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
          <div className="mt-4 rounded-[12px] border border-[#eadfd6] bg-[#fffaf6] px-4 py-3 text-[12px] leading-5 text-[#74665d]">
            <span className="font-bold text-[#3d2c22]">{nt("Web notification note:")}</span>{nt("Every notification is saved in the recipient's web inbox. Browser alerts require the recipient to allow notifications; if their browser or device is unavailable, they will see the notification when they next open the web app. Email must be sent by the backend delivery service. SMS is not available here.")}</div>
          {errors.channels ? <p className="mt-3 text-[13px] font-medium text-[#d15b42]">{nt(errors.channels)}</p> : null}
          {!errors.channels ? (
            <p className="mt-3 text-[13px] leading-5 text-[#8d8077]">
              {nt("Selected: {{channels}}", { channels: notificationChannels(form.channels) })}
            </p>
          ) : null}
        </CreateNotificationSectionCard>

        <CreateNotificationSectionCard
          subtitle={nt("Control when this notification should be sent.")}
          title={nt("Timing & Schedule")}
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
                  <span className="text-[13px] font-bold uppercase tracking-[0.08em]">{nt("Schedule Date")}</span>
                </div>
                <CreateNotificationField
                  error={errors.scheduleDate}
                  as="input"
                  disabled={form.scheduleMode === "immediately"}
                  label={nt("Choose Date")}
                  min={minScheduleDate}
                  onChange={(event) => updateField("scheduleDate", event.target.value)}
                  type="date"
                  value={form.scheduleDate}
                />
              </div>

              <div className="rounded-[14px] border border-[#ece2db] bg-[#fcfbfa] p-4">
                <div className="mb-3 flex items-center gap-2 text-[#7f736b]">
                  <SendHorizonal size={16} />
                  <span className="text-[13px] font-bold uppercase tracking-[0.08em]">{nt("Send Time")}</span>
                </div>
                <CreateNotificationField
                  as="input"
                  disabled={form.scheduleMode === "immediately"}
                  helperText={
                    form.scheduleMode === "immediately"
                      ? nt("Time is disabled when sending immediately.")
                      : nt("Choose the time in 24-hour format when the notification should go live.")
                  }
                  label={nt("Choose Time")}
                  lang={notificationLocale()}
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
                  <p className="text-[15px] font-bold text-[#2a1f19]">{nt("Delivery summary")}</p>
                  <p className="mt-1 text-[14px] leading-6 text-[#7a6e66]">
                    {nt("Audience: {{audience}}. Channels: {{channels}}.", { audience: nt(audienceOptions.find((option) => option.value === form.audience)?.label), channels: notificationChannels(form.channels) })}
                  </p>
                  <p className="text-[14px] leading-6 text-[#7a6e66]">
                    {form.scheduleMode === "immediately"
                      ? nt("This notification will be sent immediately after confirmation.")
                      : form.scheduleDate
                        ? nt("This notification will be scheduled for {{date}} at {{time}}.", { date: notificationDate(form.scheduleDate, true), time: form.scheduleTime })
                        : nt("Choose a date and time to schedule this notification.")}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </CreateNotificationSectionCard>
      </div>

      <CreateNotificationActionBar
        onCancel={() => navigate("/notifications")}
        onSend={handleSend}
        disableSend={isSubmitting || !form.title.trim() || !form.message.trim() || form.channels.length === 0}
      />
    </div>
  );
}
