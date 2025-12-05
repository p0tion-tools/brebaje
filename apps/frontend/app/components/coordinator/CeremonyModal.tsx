"use client";

import { Modal } from "../ui/Modal";
import { Input } from "../ui/Input";
import { Button } from "../ui/Button";
import { useState } from "react";

interface CeremonyModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: {
    description: string;
    type: "PHASE1" | "PHASE2";
    start_date: string;
    end_date: string;
    penalty: number;
    circuitFile: File | null;
  }) => void;
}

export const CeremonyModal = ({
  isOpen,
  onClose,
  onSubmit,
}: CeremonyModalProps) => {
  const [formData, setFormData] = useState({
    description: "",
    type: "PHASE2" as "PHASE1" | "PHASE2",
    start_date: "",
    end_date: "",
    penalty: 0,
    circuitFile: null as File | null,
  });
  const [errors, setErrors] = useState({
    description: "",
    type: "",
    start_date: "",
    end_date: "",
    penalty: "",
    circuitFile: "",
  });

  const handleChange = (
    field: keyof typeof formData,
    value: string | number
  ) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field as keyof typeof errors]) {
      setErrors((prev) => ({ ...prev, [field]: "" }));
    }
  };

  const validateForm = () => {
    const newErrors = {
      description: "",
      type: "",
      start_date: "",
      end_date: "",
      penalty: "",
      circuitFile: "",
    };
    let isValid = true;

    if (!formData.description.trim()) {
      newErrors.description = "Description is required";
      isValid = false;
    }

    if (!formData.start_date) {
      newErrors.start_date = "Start date is required";
      isValid = false;
    }

    if (!formData.end_date) {
      newErrors.end_date = "End date is required";
      isValid = false;
    }

    if (
      formData.start_date &&
      formData.end_date &&
      new Date(formData.start_date) >= new Date(formData.end_date)
    ) {
      newErrors.end_date = "End date must be after start date";
      isValid = false;
    }

    if (formData.penalty < 0) {
      newErrors.penalty = "Penalty must be a positive number";
      isValid = false;
    }

    if (formData.circuitFile && formData.circuitFile.size > 100 * 1024 * 1024) {
      newErrors.circuitFile = "File size must be less than 100MB";
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = () => {
    if (validateForm()) {
      onSubmit(formData);
      // Reset form
      setFormData({
        description: "",
        type: "PHASE2",
        start_date: "",
        end_date: "",
        penalty: 0,
        circuitFile: null,
      });
      setErrors({
        description: "",
        type: "",
        start_date: "",
        end_date: "",
        penalty: "",
        circuitFile: "",
      });
    }
  };

  const handleClose = () => {
    // Reset form on close
    setFormData({
      description: "",
      type: "PHASE2",
      start_date: "",
      end_date: "",
      penalty: 0,
      circuitFile: null,
    });
    setErrors({
      description: "",
      type: "",
      start_date: "",
      end_date: "",
      penalty: "",
      circuitFile: "",
    });
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title="Create New Ceremony"
      description="Setup a new trusted ceremony for your project"
    >
      <div className="flex flex-col gap-4">
        <Input
          label="Description"
          placeholder="e.g., ZK Rollup Phase 2 Trusted Setup"
          value={formData.description}
          onChange={(e) => handleChange("description", e.target.value)}
          error={errors.description}
        />

        <div className="flex flex-col gap-2">
          <label className="text-sm font-medium text-gray-700">Type</label>
          <select
            className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
            value={formData.type}
            onChange={(e) =>
              handleChange("type", e.target.value as "PHASE1" | "PHASE2")
            }
          >
            <option value="PHASE2">Phase 2</option>
            <option value="PHASE1">Phase 1</option>
          </select>
          {errors.type && (
            <p className="text-sm text-red-500 mt-1">{errors.type}</p>
          )}
        </div>

        <Input
          label="Start Date"
          type="datetime-local"
          value={formData.start_date}
          onChange={(e) => handleChange("start_date", e.target.value)}
          error={errors.start_date}
        />

        <Input
          label="End Date"
          type="datetime-local"
          value={formData.end_date}
          onChange={(e) => handleChange("end_date", e.target.value)}
          error={errors.end_date}
        />

        <Input
          label="Penalty (in seconds)"
          type="number"
          placeholder="300"
          value={formData.penalty.toString()}
          onChange={(e) =>
            handleChange("penalty", parseInt(e.target.value) || 0)
          }
          error={errors.penalty}
          helperText="Time penalty for failed contributions"
        />

        <div className="flex flex-col gap-2">
          <label className="text-sm font-medium text-gray-700">
            Circuit File (optional)
          </label>
          <input
            type="file"
            accept=".circom,.r1cs,.wasm,.json,.ptau"
            onChange={(e) => {
              const file = e.target.files?.[0];
              setFormData((prev) => ({ ...prev, circuitFile: file || null }));
              if (errors.circuitFile) {
                setErrors((prev) => ({ ...prev, circuitFile: "" }));
              }
            }}
            className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
          />
          {errors.circuitFile && (
            <p className="text-sm text-red-500 mt-1">{errors.circuitFile}</p>
          )}
          <p className="text-xs text-gray-500">
            Upload circuit files (.circom, .r1cs, .wasm, .json, .ptau) up to
            100MB
          </p>
        </div>

        <div className="flex gap-3 mt-4">
          <Button
            variant="outline-black"
            className="flex-1"
            onClick={handleClose}
          >
            Cancel
          </Button>
          <Button
            variant="black"
            className="flex-1 uppercase"
            onClick={handleSubmit}
          >
            Create Ceremony
          </Button>
        </div>
      </div>
    </Modal>
  );
};
