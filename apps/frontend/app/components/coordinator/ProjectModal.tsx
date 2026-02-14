"use client";

import { Modal } from "../ui/Modal";
import { Input } from "../ui/Input";
import { Button } from "../ui/Button";
import { useState } from "react";

interface ProjectModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: { name: string; contact: string }) => void;
}

export const ProjectModal = ({
  isOpen,
  onClose,
  onSubmit,
}: ProjectModalProps) => {
  const [formData, setFormData] = useState({
    name: "",
    contact: "",
  });
  const [errors, setErrors] = useState({
    name: "",
    contact: "",
  });

  const handleChange = (field: "name" | "contact", value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }));
    }
  };

  const validateForm = () => {
    const newErrors = {
      name: "",
      contact: "",
    };
    let isValid = true;

    if (!formData.name.trim()) {
      newErrors.name = "Project name is required";
      isValid = false;
    }

    if (!formData.contact.trim()) {
      newErrors.contact = "Contact information is required";
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = () => {
    if (validateForm()) {
      onSubmit(formData);
      // Reset form
      setFormData({ name: "", contact: "" });
      setErrors({ name: "", contact: "" });
    }
  };

  const handleClose = () => {
    // Reset form on close
    setFormData({ name: "", contact: "" });
    setErrors({ name: "", contact: "" });
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title="Create New Project"
      description="Add a new project to manage your ceremonies"
    >
      <div className="flex flex-col gap-4">
        <Input
          label="Project Name"
          placeholder="e.g., ZK Rollup Project"
          value={formData.name}
          onChange={(e) => handleChange("name", e.target.value)}
          error={errors.name}
        />

        <Input
          label="Contact Information"
          placeholder="e.g., discord: username#1234, email: contact@example.com"
          value={formData.contact}
          onChange={(e) => handleChange("contact", e.target.value)}
          error={errors.contact}
          helperText="Provide your preferred contact method (Discord, email, Telegram, etc.)"
        />

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
            Create Project
          </Button>
        </div>
      </div>
    </Modal>
  );
};
