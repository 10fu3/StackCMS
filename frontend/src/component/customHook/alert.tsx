import {
    AlertDialog,
    AlertDialogBody,
    AlertDialogContent,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogOverlay, Button
} from "@chakra-ui/react";
import {Box} from "@chakra-ui/layout";
import React, {useRef} from "react";

export interface AlertInterface{
    title:string,
    body:string,
    isOpen:boolean,
    onOkClick:()=>void,
    onClose:()=>void
}

const Alert:React.FC<AlertInterface> = (props)=>{

    const cancelRef = useRef<HTMLButtonElement>(null)

    return <AlertDialog
        isOpen={props.isOpen}
        leastDestructiveRef={cancelRef}
        isCentered
        onClose={props.onClose}
    >
        <AlertDialogOverlay>
            <AlertDialogContent>
                <AlertDialogHeader fontSize='lg' fontWeight='bold'>
                    {
                        props.title
                    }
                </AlertDialogHeader>

                <AlertDialogBody>
                    {
                        props.body
                    }
                </AlertDialogBody>

                <AlertDialogFooter>
                    <Button ref={cancelRef} onClick={props.onOkClick}>
                        OK
                    </Button>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialogOverlay>
    </AlertDialog>
}
export default Alert
