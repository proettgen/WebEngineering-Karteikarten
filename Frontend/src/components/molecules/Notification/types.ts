export interface NotificationProps {
    message: string;
    type: 'success' | 'error' | 'info';
    duration?: number; // Duration in milliseconds (default: 3000)
    onDismiss?: () => void; // Callback when notification should be dismissed
}