import {Box, Center, HStack, Text} from "@chakra-ui/layout";
import {Flex, Heading, SimpleGrid, Wrap, WrapItem,chakra} from "@chakra-ui/react";
import React from "react";
import {Link, useParams,Outlet} from "react-router-dom";
import {useSelector} from "react-redux";
import {getDisplay, ListContent, ListItem} from "../store/displayData";

const ContentListItem:React.FC<{parentId:string,item:ListContent}> = (props) => {
    return <>
        {
            props.item ? <Box bg="white" w={"100%"} flexDirection="column" borderRadius={9} overflow="hidden" boxShadow="0 3px 6px -2px #000a3c33">
                <Link to={'/'+props.parentId+'/'+props.item.id}>
                    <a>
                        <Box>
                            <Box mb={"80px"}>
                                <Heading pl={4} pr={4} pt={4} fontSize="xl" marginTop="2">
                                    {props.item.title}
                                </Heading>
                            </Box>
                        </Box>
                    </a>
                </Link>
            </Box> : <></>
        }
    </>
};

const ContentsList:React.FC = ()=>{

    const data:{[id:string]:ListItem} = useSelector(getDisplay)

    const params = useParams<"category"|"id"|"settings">()

    if(data && params && params.category && !params.id){
        const category = params.category ? params.category : ""
        return <Box style={{backgroundColor:"#f0f9ff",height:"100%",width:"100%",padding:"60px 40px"}}>
            {
                <div style={{width:"100%",maxWidth:"1120px",letterSpacing:0.2}}>
                    <Box>
                        <Text fontSize="3xl">
                            {
                                data[category].title
                            }
                        </Text>
                    </Box>
                    <Wrap p={{ base: 4, md: 10 }}>
                        {
                            data[category].item.map((e,i)=>{
                                return e ? <WrapItem minWidth={"250px"} maxWidth={"30%"} width={"100%"}>
                                    <ContentListItem item={e} parentId={category} key={'list-'+i} {...e}/>
                                </WrapItem> : <></>
                            })
                        }
                    </Wrap>
                </div>
            }
        </Box>
    }
    return <Outlet/>
}
export default ContentsList
