export const validateIncidentForm = (formData) => {
  const errors = {};
  
  if (!formData.description || formData.description.length < 10) {
    errors.description = "Description must be at least 10 characters.";
  }
  
  if (!formData.incidentType) {
    errors.incidentType = "Please select an incident type.";
  }
  
  if (!formData.location || !formData.location.latitude) {
    errors.location = "Please provide a valid location.";
  }
  
  if (!formData.userConsent) {
    errors.userConsent = "You must consent to sharing data for emergency response.";
  }
  
  return {
    valid: Object.keys(errors).length === 0,
    errors
  };
};
