import { Box, Button, CircularProgress, Fade, FormControl, LinearProgress, TextField, Typography } from "@mui/material";
import React, { useState, useEffect } from "react";
 import { ErrorOutlineOutlined } from "@mui/icons-material";
import { Eye, EyeClosed } from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";
import { useValidations, type FormErrors } from "@/utils/validation";
import { postRequest } from "@/Service/Apiservice";
import { toast } from "react-toastify";
import { themes } from "@/Themes";
import taskconciergeLogo from '../../../assets/images/taskconciegeLogo.svg'


const NewPassword:React.FC = () => {


      const navigate = useNavigate();
    const location = useLocation();
    const { emailaddress } = location.state || {};
    const email = emailaddress;

    // ✅ UPGRADED: Use hook (like signup!)
    const { validatePassword, validateConfirmPassword, getPasswordStrength } = useValidations();

    const [loading, setLoading] = useState(false);
    const [Password, setPassword] = useState("");
    const [ConfirmPassword, setConfirmPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [errors, setErrors] = useState<FormErrors>({ password: "", confirmPassword: "" });
    const [passwordStrength, setPasswordStrength] = useState({ score: 0, label: "", color: "" });
   

    useEffect(() => {
        const strength = getPasswordStrength(Password);
        setPasswordStrength(strength);

        const passwordValidation = validatePassword(Password);
        setErrors((prev) => ({
            ...prev,
            password: passwordValidation.isValid ? "" : passwordValidation.message
        }));

        if (ConfirmPassword) {
            const confirmValidation = validateConfirmPassword(Password, ConfirmPassword);
            setErrors((prev) => ({
                ...prev,
                confirmPassword: confirmValidation.isValid ? "" : confirmValidation.message
            }));
        }
    }, [Password, ConfirmPassword, validatePassword, validateConfirmPassword, getPasswordStrength]);

    const handleConfirmPasswordChange = (value: string) => {
        setConfirmPassword(value);
        const validation = validateConfirmPassword(Password, value);
        setErrors((prev) => ({
            ...prev,
            confirmPassword: validation.isValid ? "" : validation.message
        }));
    };

    const handleResetPassword = () => {
        const passwordValidation = validatePassword(Password);
        const confirmValidation = validateConfirmPassword(Password, ConfirmPassword);

        if (!passwordValidation.isValid || !confirmValidation.isValid) {
            setErrors({
                password: passwordValidation.isValid ? "" : passwordValidation.message,
                confirmPassword: confirmValidation.isValid ? "" : confirmValidation.message,
            });
            return;
        }

        setLoading(true);

        const payload = { email, password: Password, password_confirmation: ConfirmPassword };

       postRequest('auth/reset-password',payload)
            .then(() => {

                navigate("/");
                toast.success("Password has been reset Successfully")
                window.location.reload()
            })
            .catch((error: any) => {
                console.log(error)
                setLoading(false);
                
            })
            .finally(() => {
                setLoading(false);
            });
    };


  return (
    <>

        <div className='w-[100%] h-[98vh] flex items-center justify-center'>


  <Box sx={{ width: { xs: "100%", md: "50%" },padding:"2%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <Box sx={{ width: "100%", height: "auto", display: "flex",alignItems:"center", flexDirection: "column", gap: "3rem" }}>
                   

                    <Box sx={{width:"100%",display:"flex",alignItems:"center",justifyContent:"center"}}>    <Box component={'img'} src={taskconciergeLogo} sx={{width:"40%"}} /></Box>

                        <Box 
                        className="shadow rounded-2xl"
                        sx={{ width: "80%",border:"2px solid var(--color-light)", padding: { xs: "6%", md: "9%" },}} 
                        
                        >
                            <FormControl sx={{ width: "100%" }}>
                                <Box sx={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                                    <Typography sx={themes.largeHeading}>{"Wrap It Up"}</Typography>
                                    <Typography sx={themes.lightFont}>{"Enter your new password below and make sure it’s strong and secure."}</Typography>
                                </Box>

                                <Box sx={{ paddingTop: "2rem", width: "100%", display: "flex", flexDirection: "column", gap: "2rem" }}>
                                    {/* Password Field */}
                                    <Box position="relative" display="flex" flexDirection="column">
                                        <TextField
                                            label={`New Password`}
                                            variant="standard"
                                            value={Password}
                                            onChange={(e) => {
                                                const noSpaces = e.target.value.replace(/\s/g, "");
                                                setPassword(noSpaces);
                                            }}
                                            onBlur={() => {
                                                const trimmed = Password.trim();
                                                if (trimmed !== Password) {
                                                    setPassword(trimmed);
                                                }
                                            }}
                                            onPaste={(e) => {
                                                const pastedText = e.clipboardData.getData("text");
                                                if (/\s/.test(pastedText)) {
                                                    e.preventDefault();
                                                }
                                            }}
                                            type={showPassword ? "text" : "password"}
                                            placeholder="*******"
                                            error={!!errors.password}
                                            InputProps={{ disableUnderline: true }}
                                            InputLabelProps={{ sx: themes.inputFeildActions.inActive }}
                                            sx={themes.inputFeildActions.active}
                                        />

                                        {/* Password Strength */}
                                        {Password && (
                                            <Box sx={{ mt: 1 }}>
                                                <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 0.5 }}>
                                                    <Typography variant="caption" sx={{ fontSize: "11px" }}>
                                                        {"Password Strength"}:
                                                    </Typography>
                                                    <Typography variant="caption" sx={{ fontSize: "11px", fontWeight: "bold", color: passwordStrength.color }}>
                                                        {passwordStrength.label}
                                                    </Typography>
                                                </Box>
                                                <LinearProgress
                                                    variant="determinate"
                                                    value={(passwordStrength.score / 6) * 100}
                                                    sx={{
                                                        height: 4,
                                                        borderRadius: 2,
                                                        backgroundColor: "#e0e0e0",
                                                        "& .MuiLinearProgress-bar": { backgroundColor: passwordStrength.color },
                                                    }}
                                                />
                                            </Box>
                                        )}

                                        {/* ✅ FIX: Eye position (matches signup) */}
                                        <Box sx={{
                                            position: "absolute",
                                            left: "94%",
                                            top: Password ? "35%" : "56%",
                                            cursor: "pointer"
                                        }} onClick={() => setShowPassword(!showPassword)}>
                                            {!showPassword ? <EyeClosed style={{ color: "var(--color-light)", width: "90%" }} /> : <Eye style={{ color: "var(--color-purple)", width: "90%" }} />}
                                        </Box>

                                        <Fade in={!!errors.password} timeout={100}>
                                            <Typography sx={{
                                                position: "absolute",
                                                bottom: Password ? "-21px" : "-20px",
                                                left: "0",
                                                fontWeight: 400,
                                                color: "red",
                                                fontSize: "12px"
                                            }}>
                                                <span style={{ display: "flex", gap: 4 }}>
                                                    <ErrorOutlineOutlined sx={{ fontSize: 18 }} />
                                                    {errors.password}
                                                </span>
                                            </Typography>
                                        </Fade>
                                    </Box>

                                    {/* Confirm Password Field */}
                                    <Box position="relative" display="flex" flexDirection="column">
                                        <TextField
                                            label={`Confirm Password`}
                                            variant="standard"
                                            value={ConfirmPassword}
                                            onChange={(e) => handleConfirmPasswordChange(e.target.value)}
                                            type={showConfirmPassword ? "text" : "password"}
                                            placeholder="*******"
                                            error={!!errors.confirmPassword}
                                            InputProps={{ disableUnderline: true }}
                                            InputLabelProps={{ sx: themes.inputFeildActions.inActive }}
                                            sx={themes.inputFeildActions.active}
                                        />

                                        <Box sx={{
                                            position: "absolute",
                                            left: "94%",
                                            top: "56%",
                                            cursor: "pointer"
                                        }} onClick={() => setShowConfirmPassword(!showConfirmPassword)}>
                                            {!showConfirmPassword ? <EyeClosed style={{ color: "var(--color-light)", width: "90%" }} /> : <Eye style={{ color: "var(--color-purple)", width: "90%" }} />}
                                        </Box>

                                        <Fade in={!!errors.confirmPassword} timeout={100}>
                                            <Typography sx={{
                                                position: "absolute",
                                                bottom: "-21px",
                                                left: "0",
                                                fontWeight: 400,
                                                color: "red",
                                                fontSize: "12px"
                                            }}>
                                                <span style={{ display: "flex", gap: 4 }}>
                                                    <ErrorOutlineOutlined sx={{ fontSize: 18 }} />
                                                    {errors.confirmPassword}
                                                </span>
                                            </Typography>
                                        </Fade>
                                    </Box>
                                </Box>

                                <Box display="flex" flexDirection="column" gap="2rem" paddingTop="3.5rem">
                                    <Button
                                        style={{ ...themes.ButtonStyle, width: "100%", textTransform: "none" }}
                                        onClick={handleResetPassword}
                                        disabled={loading}
                                    >
                                        {loading ? <CircularProgress sx={{ color: "white" }} size={30.4} /> : 'Proceed'}
                                    </Button>
                                </Box>

                               
                            </FormControl>
                        </Box>
                        </Box>
                        </Box>
                        
                        </div>

    </>
  )
}

export default NewPassword