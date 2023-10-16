import { IResponseData } from "@/interfaces/iResponseData";

export interface searchUserFilter {
    userId: string,
    name: string,
    filter: "onlyFollowers"| "onlyFollowing" | "none"
}

export async function searchUsers({
    userId,
    name,
    filter
}: searchUserFilter): Promise<IResponseData> {

    try {
        const queryParams = new URLSearchParams({
            userId: userId,
            name: name,
            onlyFollowers: filter
        });

        const response = await fetch(`/api/user/search?${queryParams.toString()}`, {
            method: "GET",
        });

        if (!response.ok) {
            throw new Error("Failed to search users");
        }

        const responseData = await response.json();

        return {
            success: true,
            message: "Users retrieved successfully.",
            data: responseData.data,
        } as IResponseData;
    } catch (error) {
        return {
            success: false,
            message: "Error while retrieving the list of users.",
            data: null,
        } as IResponseData;
    }
}
