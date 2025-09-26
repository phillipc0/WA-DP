import { Card, CardBody, CardHeader } from "@heroui/card";
import { Input } from "@heroui/input";
import { Divider } from "@heroui/divider";

export interface LegalInfo {
  fullName: string;
  streetAddress: string;
  zipCode: string;
  city: string;
  country: string;
  phone: string;
  email: string;
  vatId: string;
  responsiblePerson: string;
  responsibleAddress: string;
}

interface LegalInfoFormProps {
  legalInfo: LegalInfo;
  onLegalInfoChange: (legalInfo: LegalInfo) => void;
}

/**
 * Legal information form component for EU compliance
 * @param props - Component props
 * @param props.legalInfo - Current legal information
 * @param props.onLegalInfoChange - Callback for legal info changes
 * @returns Legal info form component
 */
export function LegalInfoForm({
  legalInfo,
  onLegalInfoChange,
}: LegalInfoFormProps) {
  const handleInputChange = (field: keyof LegalInfo, value: string) => {
    onLegalInfoChange({
      ...legalInfo,
      [field]: value,
    });
  };

  return (
    <Card>
      <CardHeader className="flex gap-3">
        <div className="flex flex-col">
          <p className="text-xl font-bold">Legal Information</p>
          <p className="text-small text-default-500">
            Configure your legal information for Imprint and Privacy Policy
            pages (EU compliance)
          </p>
        </div>
      </CardHeader>
      <Divider />
      <CardBody className="gap-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            isRequired
            label="Full Name"
            placeholder="John Doe"
            value={legalInfo.fullName}
            onValueChange={(value) => handleInputChange("fullName", value)}
          />
          <Input
            isRequired
            label="Email Address"
            placeholder="john.doe@example.com"
            type="email"
            value={legalInfo.email}
            onValueChange={(value) => handleInputChange("email", value)}
          />
          <Input
            isRequired
            label="Street Address"
            placeholder="123 Main Street"
            value={legalInfo.streetAddress}
            onValueChange={(value) => handleInputChange("streetAddress", value)}
          />
          <Input
            description="Optional if email is provided"
            label="Phone Number"
            placeholder="+1-555-123-4567"
            value={legalInfo.phone}
            onValueChange={(value) => handleInputChange("phone", value)}
          />
          <Input
            isRequired
            label="ZIP Code"
            placeholder="12345"
            value={legalInfo.zipCode}
            onValueChange={(value) => handleInputChange("zipCode", value)}
          />
          <Input
            isRequired
            label="City"
            placeholder="New York"
            value={legalInfo.city}
            onValueChange={(value) => handleInputChange("city", value)}
          />
          <Input
            isRequired
            label="Country"
            placeholder="United States"
            value={legalInfo.country}
            onValueChange={(value) => handleInputChange("country", value)}
          />
          <Input
            description="Only required for businesses in EU"
            label="VAT ID"
            placeholder="DE123456789 (if applicable)"
            value={legalInfo.vatId}
            onValueChange={(value) => handleInputChange("vatId", value)}
          />
        </div>

        <Divider className="my-2" />

        <div className="space-y-4">
          <p className="text-small font-medium text-default-600">
            Content Responsibility (German law § 55 Abs. 2 RStV)
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              description="Person responsible for content"
              label="Responsible Person"
              placeholder="John Doe"
              value={legalInfo.responsiblePerson}
              onValueChange={(value) =>
                handleInputChange("responsiblePerson", value)
              }
            />
            <Input
              description="Address of responsible person"
              label="Responsible Person Address"
              placeholder="123 Main Street, New York, NY 12345"
              value={legalInfo.responsibleAddress}
              onValueChange={(value) =>
                handleInputChange("responsibleAddress", value)
              }
            />
          </div>
        </div>

        <div className="bg-primary-50 dark:bg-primary-900/20 border-l-4 border-primary p-4 rounded-r-lg">
          <p className="text-sm">
            <strong>Note:</strong> Fill in all required fields to automatically
            remove warning banners from your Imprint and Privacy Policy pages.
            This information is required for EU legal compliance.
          </p>
        </div>
      </CardBody>
    </Card>
  );
}
