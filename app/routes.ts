import { type RouteConfig, index, route } from "@react-router/dev/routes";

export default [
    index("routes/home.tsx"),
    route("/auth/login", "routes/auth/login.tsx"),
    route("/auth/register", "routes/auth/register.tsx"),
    route("/app/dashboard", "routes/app/dashboard.tsx"),

] satisfies RouteConfig;
