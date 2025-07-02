import { Button } from "@heroui/button";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
} from "@heroui/modal";

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
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalContent className={bgColors[type]}>
        <ModalHeader className="flex gap-1">
          <div aria-hidden="true" className={`text-xl ${iconColors[type]}`}>
            {icons[type]}
          </div>
          {title}
        </ModalHeader>
        <ModalBody>
          <p className="text-default-700">{message}</p>
        </ModalBody>
        <ModalFooter>
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
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
