import "./index.css";
import createVanSpa from "./spa";

console.log('context.js')

const routes = [
  {
    path: "/",
    name: "home",
    title: "VanJS Example | Home",
    callable: async () => import('./app/pages/home')
  },
  {
    path: "/context",
    name: "context",
    title: "VanJS Example | Context",
    callable: async () => import('./app/pages/context')
  },
  {
    path: "/agreement",
    name: "agreement",
    title: "VanJS Example | Agreement",
    callable: async () => import('./app/pages/agreement')
  },
  {
    path: "/user/:userId",
    name: "user",
    title: "VanJS Example | User",
    callable: async () => import('./app/pages/user')
  },
  {
    path: "/users",
    name: "users",
    title: "VanJS Example | Users",
    callable: async () => import('./app/pages/users')
  },
  {
    path: "(.*)",
    name: "notFound",
    title: "VanJS Example | Not Found",
    callable: async () => import('./app/pages/notFound')
  },
];

const defaultContext = {agreement: false}

const context = createVanSpa(routes, defaultContext)
export default context
