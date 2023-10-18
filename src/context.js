import "./index.css";
import van from "vanjs-core";
import createVanSpa from "./spa";

console.log('context.js')

const routes = [
  {
    path: "/",
    name: "home",
    title: "VanJS Example | Home"
  },
  {
    path: "/context",
    name: "context",
    title: "VanJS Example | Context"
  },
  {
    path: "/agreement",
    name: "agreement",
    title: "VanJS Example | Agreement"
  },
  {
    path: "/user/:userId",
    name: "user",
    title: "VanJS Example | User"
  },
  {
    path: "/users",
    name: "users",
    title: "VanJS Example | Users"
  },
  {
    path: "(.*)",
    name: "notFound",
    title: "VanJS Example | Not Found"
  },
];

const defaultContext = {agreement: false}

const context = createVanSpa(routes, defaultContext)
export default context
