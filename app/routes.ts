import { type RouteConfig, index, route } from "@react-router/dev/routes";

export default [
    index("routes/home.tsx"),
    route("/auth/login", "routes/auth/login.tsx"),

    route("/auth/register", "routes/auth/register.tsx"),
    route("app", "routes/app/layout.tsx", [
        route("dashboard", "routes/app/panel/dashboard.tsx"),
        route("profile", "routes/app/panel/profile.tsx"),
    ])




] satisfies RouteConfig;
