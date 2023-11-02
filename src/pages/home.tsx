import { SimpleNavBar } from "@/layouts/NavBar/SimpleNavBar";
import { fetchNotifications } from "@/services/notificationsService";
import { useNotificationStore } from "@/store/notificationsStore";
import { useUserInfoStore } from "@/store/userStoreInfo";
import { useRouter } from "next/router";
import { ReactNode, useEffect, useState } from "react";
import { INotificationData } from "@/interfaces/notifications/iNotificationData";
import Modal from "@/components/Modal";
import { validateReportFromWeek } from "@/services/reports/reportService";
import { useSession } from "next-auth/react";
import { handleLoginGoogle } from "@/services/loginService";
import Swal from "sweetalert2";
import { PageLoadLayout } from "@/layouts/PageLoadLayout";
import { Stairs } from "@/assets/icons/Stairs";
import { ListMagnifyingGlass } from "@/assets/icons/ListMagnifyingGlass";
import { FilePlus, House, Users } from "phosphor-react";
import { tv } from "tailwind-variants";

export default function home() {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState<boolean>(true)
    const { userInfo, setUserInfo } = useUserInfoStore();
    const [mustShowDialog, setMustShowDialog] = useState(false)
    const [reportIdOfCurrentWeek, setReportIdOfCurrentWeek] = useState<number>(0);
    const { data, status } = useSession();

    useEffect(() => {
        async function setData() {

            if (status !== "authenticated" || !data || !data.user) {
                return router.push("/login");
            }

            const { name, email, image } = data.user;

            if (!name || !email || !image)
                return;

            const loginData = await handleLoginGoogle(name, email, image);

            if (!loginData.success) {
                Swal.fire("Oops!", "Não foi possível realizar o login.");
                return;
            }

            setUserInfo({
                alreadyRegistered: loginData.data.alreadyRegistered,
                id: loginData.data.id,
                email: loginData.data.email,
                name: loginData.data.name,
                username: loginData.data.username,
                description: loginData.data.description,
                imageURL: loginData.data.imageURL,
            });

            if (!loginData.data.alreadyRegistered) {
                return router.push("/finish-signup");
            }

            setIsLoading(false);

        }

        setData();
    }, [data, status]);


    async function alreadyExistsReportsOnCurrentWeek() {

        const response = await validateReportFromWeek(userInfo.id)

        if (!response.success) return false;

        if (response.data) {
            setReportIdOfCurrentWeek(response.data);
            setMustShowDialog(true);
            return true;
        }

        return false;
    }

    async function handleAddReport() {
        if (!await alreadyExistsReportsOnCurrentWeek())
            return router.push("report/new")
    }

    return (
        <PageLoadLayout isLoading={isLoading}>
            <SimpleNavBar IconPage={House} title="Home" />
            <div className="flex flex-col justify-center items-center text-center h-full">
                <div>
                    <h1 className="text-4xl font-medium text-GRAY_DARK dark:text-DARK_TEXT">
                        Weekly Report
                    </h1>
                    <h3 className="text-GRAY_SECONDARY dark:text-DARK_TEXT_SECONDARY">
                        A next step to your progress.
                    </h3>
                </div>

                <div className="mt-10 flex gap-1">
                    <IconButton
                        IconButton={<FilePlus weight="regular" color="#5C8A74" size={24} />}
                        name="Add"
                        method={handleAddReport}
                    />
                    <IconButton
                        IconButton={<ListMagnifyingGlass strokeWidth={1.5} color="#5C8A74" size={28} />}
                        name="List"
                        method={() => router.push("list-reports")}
                    />
                    <IconButton
                        IconButton={<Users size={28} className="" />}
                        name="Friends"
                        method={() => router.push("user/friends")}
                        newModule
                    />
                </div>
                <Modal
                    isOpen={mustShowDialog}
                    onClose={() => { setMustShowDialog(false) }}
                    title={""}
                    confirmText={"Yes"}
                    cancelText={"Cancel"}
                    handleSaveButton={() => router.push("/report/" + reportIdOfCurrentWeek)}
                    hideDelete
                >
                    <div className="flex flex-col w-full items-center">
                        <Stairs size={56} color="#5C8A74" />
                        <h2 className="text-xl font-bold mt-10">Editar Meta</h2>
                        <p className="mt-2">Você já possui um Report essa semana, deseja visualiza-lo?</p>
                    </div>
                </Modal>
            </div>

            <span className="text-GRAY_DARK dark:text-DARK_TEXT w-full text-end">v 0.1.6</span>

        </PageLoadLayout>
    );
}

type props = {
    name: string;
    method: () => void;
    IconButton: ReactNode;
    newModule?: boolean;
};

function IconButton({ name, method, IconButton, newModule }: props) {
    const [isHovering, setIsHovering] = useState<boolean>(false)

    const hoverSpan = tv({
        base: "w-full h-1 animate-pulse rounded-lg",
        variants: {
            newModule: {
                true: "bg-SECONDARY_DEFAULT",
                false: "bg-PRIMARY_DEFAULT"
            }
        }
    })

    const iconStyle = tv({
        base: "",
        variants: {
            isHovering: {
                true: "text-SECONDARY_DEFAULT",
                false: "text-PRIMARY_DEFAULT"
            }
        }
    })

    return (
        <div>
            <div className="">
                {
                    newModule ?
                        <div className="group top-5 relative flex left-14">
                            <button className="bg-SECONDARY_DEFAULT p-[6px] animate-pulse rounded-full text-sm text-white shadow-sm" />
                            <span className="absolute top-5 scale-0 transition-all rounded bg-SECONDARY_DEFAULT p-2 text-xs text-white group-hover:scale-100">✨ New Feature!</span>
                        </div>
                        :
                        <div className="pt-[12px]" />
                }
                <button
                    className="rounded-xl
                                border-aanimate-spin text-GRAY
                                w-20 h-28 py-2 flex flex-col
                                text-center items-center
                                gap-2 justify-center"
                    onMouseEnter={() => setIsHovering(true)}
                    onMouseLeave={() => setIsHovering(false)}
                    onClick={method}>
                    <div className={newModule ? iconStyle({ isHovering: isHovering ? true : false }) : ""}>
                        {IconButton}
                    </div>
                    <p className="text-neutral-800 dark:text-neutral-200 font-medium">{name}</p>
                    <span className={hoverSpan({ newModule: newModule ? true : false })}
                        style={{ backgroundColor: !isHovering ? "transparent" : "" }} />
                </button>
            </div>
        </div>
    );
}
