import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { executeProtectedGraphqlRequest } from "../../app/api/protectedGraphqlClient.js";
import { useAuth } from "../../features/auth/hooks/useAuth.js";
import { startFirebasePush } from "../../lib/push/firebasePush.js";

const REGISTER_DEVICE_TOKEN_MUTATION = `
  mutation RegisterDeviceToken($deviceToken: String!, $deviceType: String!) {
    deviceToken(deviceToken: $deviceToken, deviceType: $deviceType) {
      success
      message
    }
  }
`;

function getPushLink(payload) {
  return String(payload?.data?.link || payload?.fcmOptions?.link || "").trim();
}

function openPushLink(link, navigate) {
  if (!link) {
    return;
  }

  try {
    const target = new URL(link, window.location.origin);

    if (target.origin === window.location.origin) {
      navigate(`${target.pathname}${target.search}${target.hash}`);
      return;
    }

    window.location.assign(target.href);
  } catch {
    navigate(link);
  }
}

function showForegroundBrowserNotification(title, body, link, navigate) {
  if (Notification.permission !== "granted") {
    return;
  }

  try {
    const notification = new Notification(title, {
      body,
      icon: "/favicon.ico",
    });

    notification.onclick = () => {
      window.focus();
      openPushLink(link, navigate);
      notification.close();
    };
  } catch (error) {
    console.warn("Unable to show foreground browser notification:", error);
  }
}

export default function PushNotificationBootstrap() {
  const { isAuthenticated, user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isAuthenticated || !user?.id) {
      return undefined;
    }

    let unsubscribe = () => {};
    let isDisposed = false;
    const storageKey = `gocatering:fcm:admin:${user.id}`;

    async function enablePush() {
      try {
        const { token, unsubscribe: stopListening } = await startFirebasePush((payload) => {
          const title = payload?.notification?.title || payload?.data?.title || "New notification";
          const text = payload?.notification?.body || payload?.data?.body || "You have a new update.";
          const link = getPushLink(payload);
          showForegroundBrowserNotification(title, text, link, navigate);

          void Swal.fire({
            toast: true,
            position: "top-end",
            icon: "info",
            title,
            text,
            showConfirmButton: Boolean(link),
            confirmButtonText: "Open order",
            timer: 4500,
            timerProgressBar: true,
          }).then((result) => {
            if (result.isConfirmed) {
              openPushLink(link, navigate);
            }
          });
        });
        unsubscribe = stopListening;

        if (!token || window.localStorage.getItem(storageKey) === token || isDisposed) {
          return;
        }

        const result = await executeProtectedGraphqlRequest(REGISTER_DEVICE_TOKEN_MUTATION, {
          deviceToken: token,
          deviceType: "WEB",
        });
        const payload = result?.deviceToken;

        if (!payload?.success) {
          throw new Error(payload?.message || "Unable to register this device for notifications.");
        }

        window.localStorage.setItem(storageKey, token);
      } catch (error) {
        console.warn("Firebase push setup was skipped:", error?.message || error);
      }
    }

    void enablePush();
    return () => {
      isDisposed = true;
      unsubscribe();
    };
  }, [isAuthenticated, navigate, user?.id]);

  return null;
}
