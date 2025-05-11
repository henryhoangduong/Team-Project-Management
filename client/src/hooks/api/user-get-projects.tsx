import { getProjectsInWorkspaceQueryFn } from "@/lib/api";
import { AllProjectPayloadType } from "@/types/api.type";
import { keepPreviousData, useQuery } from "@tanstack/react-query";

const userGetProjectsInWorkspaceQuery = ({workspaceId, pageNumber, pageSize,skip=false}:AllProjectPayloadType) => {
    const query = useQuery({
        queryKey: ["allprojects", workspaceId, pageNumber, pageSize],
        queryFn: () => getProjectsInWorkspaceQueryFn(workspaceId, pageSize, pageNumber ),
        staleTime: Infinity,
        placeholderData: skip ? undefined : keepPreviousData,
        enabled:!skip
    })
    return query;
}
export default userGetProjectsInWorkspaceQuery