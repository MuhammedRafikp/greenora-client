import { apiClient } from "./api";

export const getCollectorData = async () => {
    try {
        const response = await apiClient.get("/user-service/collector/profile");
        return response.data;
    } catch (error) {
        console.error("Error fetching user profile:", error);
        throw error;
    }
}

export const updateCollectorData = async (collectorData: FormData) => {
    try {
        const response = await apiClient.put("/user-service/collector/update-profile", collectorData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        }
        );
        return response.data;
    } catch (error) {
        console.error("Error updating user profile:", error);
        throw error;
    }
}