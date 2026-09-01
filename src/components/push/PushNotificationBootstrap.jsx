import { useEffect } from "react";
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

export default function PushNotificationBootstrap() {
  const { isAuthenticated, user } = useAuth();

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
          void Swal.fire({
            toast: true,
            position: "top-end",
            icon: "info",
            title,
            text,
            showConfirmButton: false,
            timer: 4500,
            timerProgressBar: true,
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
  }, [isAuthenticated, user?.id]);

  return null;
}
