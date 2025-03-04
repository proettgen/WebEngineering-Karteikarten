import React from "react";
import * as SC from "./styles";
import { NotificationProps } from "./types";

export default function Notification({ message, type }: NotificationProps) {
  return (
    <SC.Notification type={type}>
      {message}
    </SC.Notification>
  );
}