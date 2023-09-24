import { SimpleButton } from "@/components/Buttons";
import { CompactNavBar } from "@/layouts/NavBar/CompactNavBar";
import PageLayout from "@/layouts/PageLayout";
import { useUserInfoStore } from "@/store/userStoreInfo";
import { useRouter } from "next/router";
import { User } from "phosphor-react";
import { useEffect } from "react";

export default function profile() {
    const router = useRouter();
    const { id } = router.query;
    const { userInfo } = useUserInfoStore();

    useEffect(() => {
        useUserInfoStore.persist.rehydrate();
    }, []);

    return (
        <PageLayout>
            <CompactNavBar
                IconPage={User}
                goBackUrl="/home"
                title="Meu Perfil"
                subTitle="Seus dados e resultados"
            />

            <div className="flex h-[80%] md:h-[50%] items-center justify-center">
                <div className="flex flex-col md:flex-row gap-6 items-center text-center md:text-left">
                    <img
                        src={userInfo.imageURL}
                        alt="Foto do usuário"
                        className="rounded-full w-44 h-44"
                    />
                    <div className="flex flex-col">
                        <p className="text-4xl text-LIGHT_TEXT dark:text-DARK_TEXT">
                            {userInfo.username}
                        </p>
                        <p className="text-xl text-LIGHT_TEXT_SECONDARY dark:text-DARK_TEXT_SECONDARY">
                            {userInfo.email}
                        </p>
                        <p className="max-w-lg mt-4 text-LIGHT_TEXT_SECONDARY dark:text-DARK_TEXT_SECONDARY">
                            {userInfo.description}
                        </p>
                        <SimpleButton onClick={() => { router.push("/update-profile") }}>Editar Perfil</SimpleButton>
                    </div>
                </div>
            </div>
        </PageLayout>
    );
}
