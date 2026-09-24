// Field labels and choices are transcribed from the supplied clinic questionnaire.
// Clinical calculation fields are included as optional values for clinic review.
window.FORM_DEFINITION = [
  { title: "Client information", description: "A few details to help us prepare for your consultation.", fields: [
    { id: "full_name", label: "Full name", type: "text", required: true },
    { id: "form_date", label: "Today's date", type: "date", defaultValue: "today", required: true },
    { id: "birth_date_age", label: "Date of birth / age", type: "text" },
    { id: "gender", label: "Gender", type: "radio", options: ["Male", "Female"] },
    { id: "weight_kg", label: "Weight", type: "number", unit: "kg" },
    { id: "height_cm", label: "Height", type: "number", unit: "cm" },
    { id: "bmi", label: "BMI", type: "number" }, { id: "abw_kg", label: "ABW", type: "number", unit: "kg" },
    { id: "ibw_kg", label: "IBW", type: "number", unit: "kg" }, { id: "bee", label: "BEE", type: "number" },
    { id: "total_calories", label: "Total calories", type: "number", unit: "kcal" },
    { id: "protein_needs", label: "Protein needs", type: "number", unit: "g" },
    { id: "waist_cm", label: "WC", type: "number", unit: "cm" },
    { id: "recent_weight_change", label: "Recent weight change", type: "radio", options: ["No significant change", "Weight loss", "Weight gain"] },
    { id: "weight_change_amount", label: "Approximately how much?", type: "number", unit: "kg" },
    { id: "weight_change_period", label: "Over what period?", type: "text" },
  ]},
  { title: "Biochemical information", description: "Optional results, if available.", fields: [
    ...["HCT", "CR", "TG", "HDL", "HB", "NA", "CHOL", "FBG", "BUN", "K+", "LDL", "HBA1C", "Others"].map((x,i)=>({id:`biochem_${i}`,label:x,type:"text"}))
  ]},
  { title: "Health and activity", fields: [
    { id: "medical_history", label: "Past medical history", type: "checkboxes", options: ["Diabetes", "HTN", "Dyslipidemia", "Kidney Disease", "Heart Disease", "Thyroid disease", "Cancer", "Liver Disease", "Other"] },
    { id: "medical_history_other", label: "Other medical history", type: "text" },
    { id: "bmi_category", label: "BMI category", type: "checkboxes", options: ["Normal", "Underweight", "Overweight", "Obese", "Morbidly obese"] },
    { id: "activity_level", label: "Activity level", type: "textarea" },
    { id: "diet_order", label: "Diet order", type: "textarea" },
    { id: "pes", label: "PES", type: "textarea" },
    { id: "primary_goal", label: "What is your primary goal?", type: "textarea" },
    { id: "previous_program", label: "Have you previously followed a diet or nutrition program?", type: "radio", options: ["No", "Yes"] },
    { id: "previous_program_experience", label: "If yes, please tell me briefly about your experience", type: "textarea" },
    { id: "allergies", label: "Allergy / food intolerance", type: "textarea" },
    { id: "medications", label: "Medications / supplements", type: "textarea" },
  ]},
  { title: "Your daily nutrition", fields: [
    { id: "breakfast", label: "Breakfast — time & foods", type: "textarea" }, { id: "morning_snack", label: "Morning snack", type: "textarea" },
    { id: "lunch", label: "Lunch — time & foods", type: "textarea" }, { id: "afternoon_snack", label: "Afternoon snack", type: "textarea" },
    { id: "dinner", label: "Dinner — time & foods", type: "textarea" }, { id: "evening_snacks", label: "Evening snacks", type: "textarea" },
    { id: "beverages", label: "Beverages", type: "textarea" },
    { id: "meals_per_day", label: "How many meals do you typically eat per day?", type: "radio", options: ["1", "2", "3", "4", "5+"] },
    { id: "eating_out", label: "How often do you eat outside or order food?", type: "radio", options: ["Rarely", "1–2 times/week", "3–5 times/week", "Almost daily"] },
  ]},
  { title: "Sleep and stress", fields: [
    { id: "sleep_hours", label: "Average sleep", type: "number", unit: "hours/night" },
    { id: "sleep_quality", label: "Sleep quality", type: "radio", options: ["Very poor", "Poor", "Fair", "Good", "Very good"] },
    { id: "stress_level", label: "Current stress level", type: "radio", options: ["Low", "Moderate", "High", "Very high"] },
    { id: "stress_eating", label: "Does stress affect your eating?", type: "radio", options: ["No", "Sometimes", "Often"] },
    { id: "eat_without_hunger", label: "Do you frequently eat when you are not physically hungry?", type: "radio", options: ["Never", "Occasionally", "Often"] },
    { id: "cravings", label: "Do you experience strong food cravings?", type: "radio", options: ["No", "Yes"] },
    { id: "common_cravings", label: "Common cravings", type: "textarea" },
    { id: "craving_times", label: "When do cravings usually occur?", type: "checkboxes", options: ["Morning", "Afternoon", "Evening", "Late night", "During stress", "Other"] },
    { id: "craving_times_other", label: "Other craving times", type: "text" },
    { id: "portion_control", label: "Do you feel you have difficulty controlling portions?", type: "radio", options: ["No", "Sometimes", "Often"] },
    { id: "skip_meals", label: "Do you regularly skip meals?", type: "radio", options: ["No", "Sometimes", "Often"] },
    { id: "meal_preparer", label: "Who usually prepares your meals?", type: "radio", options: ["Myself", "Partner / Family", "Household help", "Restaurant / Takeaway", "Other"] },
    { id: "meal_preparer_other", label: "Other meal preparer", type: "text" },
    { id: "cook_home", label: "How often do you cook at home?", type: "radio", options: ["Rarely", "1–2 times/week", "3–5 times/week", "Almost daily"] },
    { id: "prep_time", label: "How much time can you realistically dedicate to meal preparation?", type: "radio", options: ["Very little", "15–30 minutes", "30–60 minutes", "More than 1 hour"] },
  ]},
  { title: "Confidentiality and privacy", description: "Your privacy is important to Dietitian Rawan Chamseddine. The information collected through this questionnaire is intended to support your nutrition consultation and the development of an individualized nutrition program. Your personal and health information will be treated as confidential and handled with appropriate care. Please only provide information relevant to your consultation. Where applicable, information may need to be shared with another healthcare professional involved in your care with your knowledge and/or consent, particularly when coordination of care is clinically appropriate. By submitting this form, you acknowledge that the information you provide is accurate to the best of your knowledge and understand that nutrition guidance is not a substitute for medical diagnosis or treatment.", fields: [
    { id: "privacy_acknowledged", label: "I have read and understood the above information.", type: "checkbox", required: true },
    { id: "client_name_confirmation", label: "Client name", type: "text", required: true },
    { id: "signature_confirmation", label: "Signature / electronic confirmation (type your full name)", type: "text", required: true },
  ]}
];

