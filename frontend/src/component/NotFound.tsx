import {Box, Button, Center, chakra, Stack} from "@chakra-ui/react";
import {useNavigate} from "react-router-dom";
import {CloseIcon} from "@chakra-ui/icons";

const NotFound = ()=>{

    const nav = useNavigate();

    return <Box w={"100%"} h={"100vh"}>
        <Center h={"100vh"}>
            <Stack>
                <CloseIcon w={44} h={44}/>
                <chakra.p pt={10}>ページが見つかりません</chakra.p>
                <Box w="100%" pt={5}>
                    <Button w="100%" onClick={()=>{
                        nav(-1)
                    }}>
                        戻る
                    </Button>
                </Box>
            </Stack>
        </Center>
    </Box>
}
export default NotFound
