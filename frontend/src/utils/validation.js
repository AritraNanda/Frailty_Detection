// This file contains validation functions for form inputs, ensuring data integrity.

export const validateEmployeeId = (id) => {
    const regex = /^[0-9]{1,6}$/; // Assuming employee ID is a numeric value with up to 6 digits
    return regex.test(id);
};

export const validatePatientData = (data) => {
    const { name, age, healthMetrics } = data;
    if (!name || name.trim() === "") {
        return "Name is required.";
    }
    if (age < 0 || age > 120) {
        return "Age must be between 0 and 120.";
    }
    if (!healthMetrics || typeof healthMetrics !== "object") {
        return "Health metrics are required.";
    }
    return null; // No validation errors
};