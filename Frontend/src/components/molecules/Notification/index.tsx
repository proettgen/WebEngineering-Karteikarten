import React, { useEffect, useState } from "react";
import * as SC from "./styles";
import { NotificationProps } from "./types";

const Notification = ({ message, type, duration = 3000, onDismiss }: NotificationProps) => {
  const [isFadingOut, setIsFadingOut] = useState(false);

  useEffect(() => {
    if (onDismiss && duration > 0) {
      // Start fade-out animation 400ms before dismissing
      const fadeOutTimer = setTimeout(() => {
        setIsFadingOut(true);
      }, duration - 400);

      // Dismiss notification after fade-out completes
      const dismissTimer = setTimeout(() => {
        onDismiss();
      }, duration);

      // Cleanup timers if component unmounts
      return () => {
        clearTimeout(fadeOutTimer);
        clearTimeout(dismissTimer);
      };
    }
  }, [onDismiss, duration]);

  return (
    <SC.Notification type={type} isFadingOut={isFadingOut}>
      {message}
    </SC.Notification>
  );
};

export default Notification;
