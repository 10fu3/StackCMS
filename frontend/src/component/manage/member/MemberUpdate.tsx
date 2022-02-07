import {Box, Center} from "@chakra-ui/layout";
import {Button, chakra, Checkbox, Flex, Input, Spacer} from "@chakra-ui/react";
import {Link, useNavigate, useParams} from "react-router-dom";
import {ArrowBackIcon} from "@chakra-ui/icons";
import React, {useEffect, useState} from "react";
import {useSelector} from "react-redux";
import {getRoles} from "../../../store/roles";
import {UpdateUserEntity, User} from "../../../model/model";
import {getUsers, setUsers} from "../../../store/users";
import {getProfile} from "../../../store/auth";
import {CMSApi} from "../../../api/cms";
import store from "../../../store";

const ProfileUpdatePage = ()=>{

    const nav = useNavigate()

    const params = useParams<"id">()

    const users = useSelector(getUsers)

    let profile = useSelector(getProfile)

    const [updateData,setUpdateData] = useState<UpdateUserEntity>({
        mail: "", nick_name: "", password: "", role: []
    })

    useEffect(()=>{
        const u = users.filter(u=>u.user_id === params.id)
        let user:User = u.length === 1 ? u[0] : users.filter(u=>u.user_id === profile?.user_id)[0]
        setUpdateData({
            mail: user.mail,
            nick_name: user.nick_name,
            password: undefined,
            role: user.roles.map(i=>i.id)
        })
    },[])

    const handleChange = (category:string,value:string) =>{
        let d:{[key:string]:string} = {}
        d[category] = value
        setUpdateData(Object.assign({...updateData},d))
    }

    const handleApply = ()=>{
        (async ()=>{
            await CMSApi.User.update(params.id ? params.id : "",updateData)
            store.dispatch(setUsers())
            nav(-1)
        })()
    }

    return <Box w={"100%"} h={"100%"} bgColor={"#f7faff"}>
        <Center pl={5} pr={5} w={"100%"} h={"64px"} bgColor={"#f7faff"}>
            <Flex w={"100%"}>
                <Center>
                    <Link to={`/manage/member`}>
                        <ArrowBackIcon/>
                    </Link>
                </Center>
                <Center pl={4}>
                    <chakra.p fontWeight="bold">プロフィール / 編集</chakra.p>
                </Center>
                <Spacer/>
                <Box pr={2}>
                    <Button onClick={handleApply} colorScheme="green">
                        適用
                    </Button>
                </Box>
            </Flex>
        </Center>
        <Box w={"100%"} h={"1px"} bgColor={"#e2e2e2"}/>
        <Box w={"100%"} pl={2} pr={2} h={"calc(100vh - 65px)"} bgColor={"#f0f9ff"} overflow="auto">
            <Box p={5}>
                <Box bgColor="white" borderWidth="1px" borderRadius="3px" p={5}>
                    <Box bgColor="white" p={5} m={5} borderWidth="1px" borderRadius="3px" >
                        <chakra.p fontWeight="bold" fontSize="20px">プロフィール</chakra.p>
                        <Box pt={5}>
                            <Box p={3}>
                                <Box p={2} borderWidth={1}>
                                    <Flex m={2}>
                                        <chakra.p fontWeight="bold">ニックネーム</chakra.p> :
                                    </Flex>
                                    <Box p={2}>
                                        <Input onChange={(e)=>{handleChange("nick_name",e.target.value)}} value={updateData.nick_name}/>
                                    </Box>
                                </Box>
                                <Box mt={2} p={2} borderWidth={1}>
                                    <Flex m={2}>
                                        <chakra.p fontWeight="bold">メールアドレス</chakra.p> :
                                    </Flex>
                                    <Box p={2}>
                                        <Input onChange={(e)=>{handleChange("mail",e.target.value)}} value={updateData.mail}/>
                                    </Box>
                                </Box>
                                <Box mt={2} p={2} borderWidth={1}>
                                    <Flex m={2}>
                                        <chakra.p value={updateData.password} fontWeight="bold">パスワード</chakra.p> :
                                    </Flex>
                                    <Box p={2}>
                                        <Input value={updateData.password} onChange={(e)=>{handleChange("password",e.target.value)}}/>
                                    </Box>
                                </Box>
                                <Box mt={2} p={2} borderWidth={1}>
                                    <Flex m={2}>
                                        <chakra.p fontWeight="bold">所属ロール</chakra.p> :
                                    </Flex>
                                    <Box p={2}>
                                        {
                                            useSelector(getRoles).map(i=>{
                                                return <Box p={2}>
                                                    <Flex>
                                                        <Checkbox onChange={()=>{
                                                            setUpdateData(updateData.role.includes(i.id) ?
                                                                Object.assign({...updateData},{role:updateData.role.filter(j=>j !== i.id)}) :
                                                                Object.assign({...updateData},{role:[...updateData.role,i.id]})
                                                            )
                                                        }} isChecked={(()=>{
                                                            console.log("A")
                                                            return updateData.role.includes(i.id)
                                                        })()}/>
                                                        <p>{i.name}</p>
                                                    </Flex>
                                                </Box>
                                            })
                                        }
                                    </Box>
                                </Box>
                            </Box>
                        </Box>
                    </Box>
                </Box>
            </Box>
        </Box>
    </Box>
}

export default ProfileUpdatePage
