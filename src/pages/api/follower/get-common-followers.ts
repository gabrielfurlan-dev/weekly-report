import { getCommonFollowersFunction } from "@/repositories/Followers";
import { NextApiRequest, NextApiResponse } from "next";

export default async function getCommonFollowers(
    req: NextApiRequest,
    res: NextApiResponse
) {
    if (req.method !== "GET") {
        return res.status(405).send({
            message: "Only GET methods are allowed",
        });
    }

    try {

        const userId = req.query.userId as string;
        const userIdToCompare = req.query.userIdToCompare as string;

        const commonFollowers = await getCommonFollowersFunction(userId, userIdToCompare);

        return res.status(200).json({
            success: true,
            data: commonFollowers,
            message: "Successfully follower obtained!",
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            data: null,
            message: "Error while getting followers.",
            error: String(error),
        });
    }
}
