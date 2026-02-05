import { Button } from "@/components/ui/button"
import {
  Card,
  CardAction,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import taskconciergeLogo from '../../../assets/images/taskconciegeLogo.svg'
import { useNavigate } from "react-router-dom"
import { useState } from "react"
import { LoginPost } from "@/Service/AuthService"
import { toast } from "react-toastify"
import {  Eye, EyeClosed } from "lucide-react"
import LightPillar from '@/components/LightPillar'
import { Box, Typography } from "@mui/material"


export default function Login() {

  const [Email, setEmail] = useState('')
  const [Password, setPassword] = useState('')
  const [Loader,setLoader]=useState(false)
  const [eye,setEye]=useState(false)



  const handleLogin=()=>{
    setLoader(true)
    const payload={
      email:Email,
      password:Password

    }
    LoginPost(payload)
    .then((res)=>{
      localStorage.setItem('accessToken',res.data.token)
      toast.success('welcome back ...!')
      navigate('/Dashboard')
    })
    .catch(()=>{
      toast.error('Invalid Credentials')
    })
    .finally(()=>setLoader(false))


  }

    const navigate=useNavigate()

    return (
      <>
      <div style={{ width: '100%', height: '100%', position: 'absolute',zIndex:0}} className="absolute">
  <LightPillar
    topColor="#5227FF"
    bottomColor="#FF9FFC"
    className="absolute w-[100%]"
    intensity={0.9}
    rotationSpeed={0.3}
    interactive={false}
    glowAmount={0.0010}
    pillarWidth={3.9}
    pillarHeight={0.15}
    noiseIntensity={0.5}
    pillarRotation={60}
  />
</div>
    <div className="w-full h-screen flex justify-center items-center flex-col gap-3 bg-black p-4" style={{zIndex:10}}  >
      
       
    <Card 
    className="
    w-full max-w-sm
    bg-white/20           
    backdrop-blur-xl       
    backdrop-saturate-150   
    border border-white/25  
    shadow-2xl              
    rounded-2xl            
    text-white             
    overflow-hidden
    transition-all duration-300
    hover:bg-white/15       
    hover:shadow-3xl
    hover:scale-[1.02]
  "
    
    style={{zIndex:20}}>
       <Box className="flex justify-center items-center"> 
         <Box component={'img'} src={taskconciergeLogo} className="w-40 h-10" alt="" /></Box>
       
      <CardHeader>
        <CardTitle>Login to your account</CardTitle>
        <CardAction>
        </CardAction>
      </CardHeader>
      <CardContent>
        <form>
          <div className="flex flex-col gap-6">
            <div className="grid gap-2">
              <Label htmlFor="email">Email</Label>
              <Input
              onChange={(e)=>setEmail(e.target.value)}
                id="email"
                type="email"
                placeholder="m@example.com"
                required
              />
            </div>
            <div className="grid gap-2">
              <div className="flex items-center">
                <Label htmlFor="password">Password</Label>
                <a
                  href="/forgetPassword/mail"
                  className="ml-auto inline-block text-sm underline-offset-4 hover:underline"
                >
                  Forgot your password?
                </a>
              </div>
          <div
          className="relative">    <Input id="password" type={!eye?"password":"text"} onChange={(e)=>setPassword(e.target.value)} value={Password} required />
          {eye?<Eye onClick={()=>setEye(!eye)} className="size-5 hover:text-[var(--color-purple)] cursor-pointer absolute right-[1%] top-[27%]"/>:
          <EyeClosed onClick={()=>setEye(!eye)} className="size-5 hover:text-[var(--color-purple)] cursor-pointer absolute right-[1%] top-[27%]"/>}

          </div>
            </div>
          </div>
        </form>
      </CardContent>
      <CardFooter className="flex-col gap-2">
        <Button onClick={handleLogin}  type="submit"  className="w-full text-[var(--color-white)]  hover:bg-[var(--color-purple)] cursor-pointer hover:text-white">
         {Loader? "Loading...":" Login"}
        </Button>

      </CardFooter>
    </Card>
      <Typography className="text-white">Powered by Genx thofa technologies</Typography>
    </div>
    </>
  )
}
