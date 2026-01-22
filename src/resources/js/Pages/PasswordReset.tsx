import { Box, Button, CircularProgress, Fade, FormControl, TextField, Typography } from "@mui/material";
import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { themes } from "@/Themes";
import { getRequest, postRequest } from "@/Service/Apiservice";
import taskconciergeLogo from '../../../assets/images/taskconciegeLogo.svg'
import { useValidations} from "@/utils/validation";

const PasswordReset:React.FC = () => {


     const navigate = useNavigate()

    const [email, setEmail] = useState('')
    const [errors, setErrors] = useState({ email: "" });
    const [_touched, setTouched] = useState({ email: false });
    const [loader, setLoader] = useState<boolean>(false)
   

    const{validateEmail}=useValidations()

    // Check if user is already logged in
    useEffect(() => {
        const checkAuthStatus = async () => {
            const token = localStorage.getItem('accessToken');
            if (token) {
                try {
                    const response = await getRequest(`/user/profile/detailed`);
                    if (response.data) {
                        
                        navigate('/Dashboard');
                    }
                } catch (error) {
                    localStorage.removeItem('accessToken');
                }
            }
        };
        checkAuthStatus();
    }, [navigate]);

    const validateFieldRealTime = (fieldName: string, value: string) => {
        const result = validateEmail(value);
        setErrors((prev:any) => ({
            ...prev,
            [fieldName]: result.isValid ? "" : result.message
        }));
    };

    const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setEmail(value);
         validateFieldRealTime("email", value);
    };

    // Handle field blur
    const handleFieldBlur = () => {
        setTouched(prev => ({ ...prev, email: true }));
         validateFieldRealTime("email", email);
    };

   const handleForgetPassProceed = async () => {
    setTouched({ email: true });
    validateFieldRealTime("email", email); // Re-validate to ensure latest errors

    if (!errors.email && email.trim()) { // Check if no error after validation
        setLoader(true);
        try {
            await postRequest('/auth/forgot-password', { email });
            navigate('/EnterOtp', { state: { emailaddress: email } });
        } catch (err) {
            console.log('error>>>>', err);
        } finally {
            setLoader(false);
        }
    }
};



  return (
    <>
    <div className='w-[100%] h-[98vh] flex items-center justify-center'>
          <>
             

                <Box sx={{ width: { xs: "100%", md: "50%" },padding:"2%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <Box sx={{ width: "100%", height: "auto", display: "flex",alignItems:"center", flexDirection: "column", gap: "3rem" }}>
                   

                    <Box sx={{width:"100%",display:"flex",alignItems:"center",justifyContent:"center"}}>    <Box component={'img'} src={taskconciergeLogo} sx={{width:"40%"}} /></Box>

                        <Box 
                        className="shadow rounded-2xl"
                        sx={{ width: "80%",border:"2px solid var(--color-light)", padding: { xs: "6%", md: "9%" },}} 
                        
                        >
                            <FormControl sx={{ width: "100%" }}>
                                <Box sx={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                                    <Typography sx={themes.largeHeading}>{'No Worries'}</Typography>
                                    <Typography sx={themes.lightFont}>Just enter your email and we’ll help you set a new password.</Typography>
                                </Box>

                                <Box sx={{ paddingTop: "2rem", width: "100%", display: "flex", flexDirection: "column", gap: "2rem" }}>
                                    {/* ✅ UPGRADED: Matches SIGNUP styling */}
                                    <Box position="relative" display="flex" flexDirection="column">
                                        <TextField
                                            label={`${"Email"}`}
                                            variant="standard"
                                            value={email}
                                            onChange={handleEmailChange}
                                            onBlur={handleFieldBlur}
                                            error={!!errors.email}
                                            InputProps={{ disableUnderline: true }}
                                            InputLabelProps={{ sx: themes.inputFeildActions.inActive }}
                                            sx={themes.inputFeildActions.active}
                                        />
                                        {/* ✅ FIX: Red icon style (matches signup) */}
                                        <Fade in={!!errors.email} timeout={100}>
                                            <Typography sx={{ 
                                                position: "absolute", 
                                                bottom: "-18px", 
                                                left: "0", 
                                                fontWeight: 400, 
                                                color: "red", 
                                                fontSize: "12px" 
                                            }}>
                                                <span style={{ display: "flex", gap: 4 }}>
                                                    {/* <Error style={{ fontSize: 18 }} />  */}
                                                    {errors.email}
                                                </span>
                                            </Typography>
                                        </Fade>
                                    </Box>
                                </Box>

                                <Box display="flex" flexDirection="column" gap="2rem" padding="2rem 0% 0% 0%">
                                    <Button style={{ ...themes.ButtonStyle, width: "100%", textTransform: "none" }} onClick={handleForgetPassProceed} disabled={loader}>
                                        {loader ? <CircularProgress size={30.4} sx={{ color: "white" }} /> :"Proceed"}
                                    </Button>

                                    <Typography sx={{ ...themes.lightFont, color: "var(--color-black)", display: "flex", justifyContent: "center" }}>
                                        Remember your password?
                                        <Link to={'/'} style={{ textDecoration: "none", color: "var(--color-purple)", marginLeft: "5px", fontWeight: 600 }}>
                                            Login here
                                        </Link>
                                    </Typography>
                                </Box>

                              
                            </FormControl>
                        </Box>
                    </Box>
                </Box>
            </>

    </div>

    </>
  )
}

export default PasswordReset