import React from "react";
import * as SC from "./styles";
import { NotificationProps } from "./types";

const Notification = ({ message, type }: NotificationProps) => (
  <SC.Notification type={type}>{message}</SC.Notification>
);
export default Notification;
