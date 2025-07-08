import React, { useEffect, useState, useCallback } from "react";
import * as SC from "./styles";
import { NotificationProps } from "./types";

const Notification = React.memo(({ message, type, duration = 3000, onDismiss }: NotificationProps) => {
  const [isFadingOut, setIsFadingOut] = useState(false);

  const handleFadeOut = useCallback(() => {
    setIsFadingOut(true);
  }, []);

  const handleDismiss = useCallback(() => {
    if (onDismiss) {
      onDismiss();
    }
  }, [onDismiss]);

  useEffect(() => {
    if (onDismiss && duration > 0) {
      // Start fade-out animation 400ms before dismissing
      const fadeOutTimer = setTimeout(handleFadeOut, duration - 400);

      // Dismiss notification after fade-out completes
      const dismissTimer = setTimeout(handleDismiss, duration);

      // Cleanup timers if component unmounts
      return () => {
        clearTimeout(fadeOutTimer);
        clearTimeout(dismissTimer);
      };
    }
  }, [duration, handleFadeOut, handleDismiss, onDismiss]);

  return (
    <SC.Notification type={type} isFadingOut={isFadingOut}>
      {message}
    </SC.Notification>
  );
});

Notification.displayName = 'Notification';

export default Notification;
