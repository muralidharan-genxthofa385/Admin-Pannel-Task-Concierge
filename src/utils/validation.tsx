
export interface validationResult{
    isValid:boolean|string,
    message:string
}
export interface FormErrors {
  [key: string]: string;
}


export const useValidations=()=>{

  const validateEmail = (email: string): validationResult => {

        if(!email.trim()) return {isValid:false,message:"Please Enter an email"}

    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if(!emailRegex.test(email)) return{isValid:false,message:"Invalid Email"}

        return {isValid:true,message:""}
    }





  const validatePassword = (password: string): validationResult => {
    if (!password.trim()) return { isValid: false, message: "Password field is Required" };
    if (password.length < 8) return { isValid: false, message: "Password Should be minimum 8 characters" };
    if (password.length > 16) return { isValid: false, message: "Password Should be maximum 16 characters" };
    if (!/[A-Z]/.test(password)) return { isValid: false, message: "Password must contain at least one uppercase letter" };
    if (!/[a-z]/.test(password)) return { isValid: false, message: "Password must contain at least one lowercase letter" };
    if (!/\d/.test(password)) return { isValid: false, message: "Password must contain at least one number"};
    if (!/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password))
      return { isValid: false, message: "Password must contain at least one special character"};
    return { isValid: true, message: "" };
  };
  const validateConfirmPassword = (password: string, confirmPassword: string): validationResult => {
    if (!confirmPassword.trim()) return { isValid: false, message: "Please enter your password" };
    if (password !== confirmPassword) return { isValid: false, message: "Passwords do not match"};
    return { isValid: true, message: "" };
  };

    const getPasswordStrength = (password: string) => {
    let score = 0;
    let label = "";
    let color = "";

    if (password.length > 0) score += 1;
    if (password.length >= 8) score += 1;
    if (/[A-Z]/.test(password)) score += 1;
    if (/[a-z]/.test(password)) score += 1;
    if (/\d/.test(password)) score += 1;
    if (/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)) score += 1;

    switch (score) {
      case 0:
        label = "Empty";
        color = "#e0e0e0";
        break;
      case 1:
        label = "Very Weak";
        color = "#ff4757";
        break;
      case 2:
        label = "Weak";
        color = "#ff6348";
        break;
      case 3:
        label = "Fair";
        color = "#ffa502";
        break;
      case 4:
        label = "Good";
        color = "##51da78";
        break;
      case 6:
        label = "Strong";
        color = "#2B9348";
        break;
      default:
        label = "Medium";
        color = "#74b9ff";
    }

    return { score, label, color };
  };

 const validateField = (fieldName: string, value: any, additionalData?: any): validationResult => {
    switch (fieldName) {
      case "email": return validateEmail(value);
      case "password": return validatePassword(value);
      case "confirmPassword": return validateConfirmPassword(additionalData?.password || "", value);
    
    }
    return{
        isValid:true,message:""
    }
  };

  // Full form validation helper
  const validateForm = (formData: Record<string, any>, fieldsToValidate: string[]): FormErrors => {
    const errors: FormErrors = {};
    fieldsToValidate.forEach((field) => {
      const result = validateField(field, formData[field], formData);
      if (!result.isValid) {
        errors[field] = result.message;
      }
    });
    return errors;
  };

    return{
validateEmail,
validateForm,
validateConfirmPassword,
validatePassword,
getPasswordStrength, 
    }
}