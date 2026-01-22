import { postRequest } from "@/Service/Apiservice";
import { themes } from "@/Themes";
import { Box, Button, CircularProgress, FormControl, TextField, Typography } from "@mui/material";
import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import taskconciergeLogo from '../../../assets/images/taskconciegeLogo.svg'



const ResetPassOTP: React.FC = () => {

    const location = useLocation()
    const { emailaddress } = location.state || {}
    console.log(emailaddress, ":email")

    const navigate = useNavigate()
    const [loading, setLoading] = useState(false);
    const [resendEmailTimer, setResendEmailTimer] = useState<number>(0)

    const [otp, setOtp] = useState('')


    useEffect(() => {
        let interval: any;
        if (resendEmailTimer > 0) {
            interval = setInterval(() => {
                setResendEmailTimer((prev: any) => prev - 1)
            }, 1000)
            return () => clearInterval(interval)
        }
    }, [resendEmailTimer])


    const handleResendOTP = () => {
        setResendEmailTimer(60)
        const payload = {
            email: emailaddress
        }
        postRequest('auth/resend-email-otp', payload)
            .then(() => {
                toast.success('An Otp has sent to your mail')
            })
            .catch((err) => {
                console.log(err);

                setLoading(false)

            })
    }

    const handleProceedOtp = () => {
        setLoading(true)
        const payload = {
            email: emailaddress,
            otp: otp

        }


        postRequest('auth/verify-reset-otp', payload)
            .then(() => {

                navigate('/setNewpassword', { state: { emailaddress: emailaddress } })



            })
            .catch((err) => {
                console.log("err :", err)

            })
            .finally(() => {
                setLoading(false)
            })

    }



    return (
        <>


            <div className='w-[100%] h-[98vh] flex items-center justify-center'>

                <Box sx={{ width: { xs: "100%", md: "50%" }, padding: "2%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <Box sx={{ width: "100%", height: "auto", display: "flex", alignItems: "center", flexDirection: "column", gap: "3rem" }}>

                        <Box sx={{ width: "100%", display: "flex", alignItems: "center", justifyContent: "center" }}>    <Box component={'img'} src={taskconciergeLogo} sx={{ width: "40%" }} /></Box>

                        <Box
                            className="shadow rounded-2xl"
                            sx={{ width: "80%", border: "2px solid var(--color-light)", padding: { xs: "6%", md: "9%" }, }}
                        >


                            <FormControl sx={{ width: "100%" }}>
                                <Box sx={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                                    <Typography sx={themes.largeHeading}>Almost There!</Typography>
                                    <Typography sx={themes.lightFont}>A verification code has been sent to your email. Enter it below to proceed.</Typography>
                                </Box>
                                <Box
                                    sx={{
                                        paddingTop: "2rem",
                                        width: "100%",
                                        display: "flex",
                                        flexDirection: "column",
                                        gap: "2rem",
                                    }}
                                >
                                    <TextField
                                        label={`Enter OTP`}
                                        variant="standard"
                                        onWheel={(e: any) => e.target.blur()}
                                        type="number"
                                        value={otp}
                                        onChange={(e) => setOtp(e.target.value)}
                                        InputProps={{
                                            disableUnderline: true,
                                        }}
                                        InputLabelProps={{
                                            sx: themes.inputFeildActions.inActive,
                                        }}
                                        sx={{
                                            ...themes.inputFeildActions.active, '& input::-webkit-outer-spin-button, & input::-webkit-inner-spin-button': {
                                                WebkitAppearance: "none",
                                                margin: 0
                                            }
                                        }}
                                    />

                                </Box>

                                <Box display={"flex"} flexDirection={"column"} gap={"2rem"} padding={'2rem 0% 0% 0%'}>

                                    <Button
                                        style={{
                                            ...themes.ButtonStyle,
                                            width: "100%",
                                            textTransform: "none",
                                        }}
                                        onClick={handleProceedOtp}
                                        disabled={loading}
                                    >
                                        {loading ? <CircularProgress sx={{ color: "white" }} size={30.4} /> : "Proceed"}
                                    </Button>
                                </Box>

                                <Typography
                                    sx={{
                                        ...themes.lightFont,
                                        color: "var(--color-black)",
                                        display: "flex",
                                        justifyContent: "center",
                                        paddingTop: "2rem"
                                    }}
                                >
                                    Didn't receive the email?
                                    <p
                                        onClick={handleResendOTP}
                                        style={{
                                            textDecoration: "none",
                                            color: resendEmailTimer > 0 ? 'gray' : "var(--color-purple)",
                                            marginLeft: "5px",
                                            cursor: resendEmailTimer > 0 ? "not-allowed" : "pointer",

                                        }}

                                    >
                                        {resendEmailTimer > 0 ? `Resend in ${resendEmailTimer}` : "Resend Code"}
                                    </p>
                                </Typography>

                            </FormControl>
                        </Box>
                    </Box>

                </Box>
            </div>
        </>
    )
}

export default ResetPassOTP