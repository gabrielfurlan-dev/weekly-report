import { useRouter } from "next/router";
import { useEffect, useState } from "react";

export default function Index() {
    const router = useRouter()

    useEffect(() => {
        async function fetchData() {
            router.push('/login')
        }
        fetchData();
    }, []);
};
