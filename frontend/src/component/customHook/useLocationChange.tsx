//https://koredana.info/blog/reactjs-client-routing-change-event/
//[React Router] ページ遷移時に処理するカスタムフックを作ってみよう

import { useEffect, useRef } from 'react'

// ※ React Router v6
import { Location, useLocation } from 'react-router-dom'

const useLocationChange = (callback: (location: Location) => void) => {
    const refCallback = useRef<undefined | ((location: Location) => void)>()
    const location = useLocation()

    useEffect(() => {
        refCallback.current = callback
    }, [callback])

    // ロケーションに変更があったときに処理実行
    useEffect(() => {
        if (refCallback.current) {
            refCallback.current(location)
        }
    }, [location])
}

export default useLocationChange
