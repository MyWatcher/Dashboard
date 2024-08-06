import { useUser } from "assets/UserInformation/UserContext";

const useFilteredRoutes = (routes) => {
    const {user } = useUser();
    const isLoggedIn = user.firstName !== "";

    const filteredRoutes = routes.filter(route => {
        if ((route.key === "sign-in" || route.key === "sign-up") && isLoggedIn) {
            return false;
        }
        return true;
    })
    return filteredRoutes;
}

export default useFilteredRoutes;