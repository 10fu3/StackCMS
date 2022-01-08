import {Box, Center, Input, chakra, Button} from "@chakra-ui/react"
import {useDispatch} from "react-redux";
import {useState} from "react";
import {setLogin} from "../store/auth";

const LoginPage = ()=>{

    const dispatch = useDispatch();

    const [mail,setMail] = useState('');
    const [password,setPassword] = useState('');

    const submit = () => {
        dispatch(setLogin(mail,password))
        setMail('')
        setPassword('')
    };

    return <Box bgColor="#f0f9ff" w="100%" h="100vh">
        <Center h="100vh">
            <Box bgColor="white" borderWidth='1px' borderRadius='lg' p={5} h={"400px"} width={["100%","400px"]}>
                <Box>
                    <chakra.p w={"100%"} textAlign="center" pt="20px" pb="40px" fontSize={24}>ログイン</chakra.p>
                </Box>
                <Box pt="10px" pb="10px">
                    <chakra.p pb="10px">メールアドレス</chakra.p>
                    <Input value={mail} onChange={(e)=>{setMail(e.target.value)}} placeholder='sample@example.com' size='lg' />
                </Box>
                <Box pt="10px" pb="10px">
                    <chakra.p pb="10px">パスワード</chakra.p>
                    <Input value={password} onChange={(e)=>{setPassword(e.target.value)}} type="password" placeholder='**** ****' size='lg' />
                </Box>
                <Box pt="10px" >
                    <Button onClick={()=>{submit()}} colorScheme='teal' size='lg' w={"100%"}>
                        ログイン
                    </Button>
                </Box>
            </Box>
        </Center>
    </Box>
}

export default LoginPage
