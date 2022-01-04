import {Box} from "@chakra-ui/layout";
import {useParams} from "react-router-dom";

const ApiDetail = ()=>{
    const params = useParams<"category"|"id"|"settings">()
    return <Box>

    </Box>
}

export default ApiDetail
