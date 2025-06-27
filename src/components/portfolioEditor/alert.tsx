import { Button } from "@heroui/button";

interface AlertProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  message: string;
  type: "success" | "warning" | "error" | "info";
  confirmLabel?: string;
  cancelLabel?: string;
  onConfirm?: () => void;
}

export function Alert({
  isOpen,
  onClose,
  title,
  message,
  type,
  confirmLabel = "OK",
  cancelLabel = "Cancel",
  onConfirm,
}: AlertProps) {
  if (!isOpen) return null;

  const bgColors = {
    success: "bg-success-100",
    warning: "bg-warning-100",
    error: "bg-danger-100",
    info: "bg-primary-100",
  };

  const iconColors = {
    success: "text-success",
    warning: "text-warning",
    error: "text-danger",
    info: "text-primary",
  };

  const icons = {
    success: "✓",
    warning: "⚠",
    error: "✕",
    info: "ℹ",
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 bg-black/50">
      <div
        className={`w-full max-w-md p-6 rounded-lg shadow-lg ${bgColors[type]} border border-default-200`}
      >
        <div className="flex items-start mb-4">
          <div className={`text-2xl mr-3 ${iconColors[type]}`}>
            {icons[type]}
          </div>
          <div className="flex-1">
            <h3 className="text-lg font-semibold">{title}</h3>
            <p className="mt-2 text-default-700">{message}</p>
          </div>
        </div>
        <div className="flex justify-end gap-2 mt-6">
          {onConfirm && (
            <Button color="default" variant="flat" onPress={onClose}>
              {cancelLabel}
            </Button>
          )}
          <Button
            color={
              type === "error"
                ? "danger"
                : type === "warning"
                  ? "warning"
                  : type === "success"
                    ? "success"
                    : "primary"
            }
            onPress={() => {
              if (onConfirm) onConfirm();
              else onClose();
            }}
          >
            {confirmLabel}
          </Button>
        </div>
      </div>
    </div>
  );
}
