"use client"
import { useRouter } from "next/navigation";


interface HomePageTabProps{
    text: string;
    notify: boolean;
    pageRedirect: string;
}


export default function HomePageTab({text, notify, pageRedirect}: HomePageTabProps) {

    const router = useRouter()

    return(
        <div className= {`flex rounded-2xl relative w-40 h-20 items-center justify-center border-2 bg-slate-400 ${notify? 'border-green-400': 'border-white'}`} onClick={() => router.push(pageRedirect)}>
            { notify && 
            <div className="absolute -right-2 -top-2 bg-green-500 border-2 border-green-400     rounded-full h-6 w-6"></div>
            }
            {text}
        </div>
    )
}