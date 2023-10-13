import { navLink } from "./routes.js";
import van from "vanjs-core";
import "../index.css";

console.log("navbar.js")

const { div, nav, hr } = van.tags

const navbar = () => {

  console.log("function Navbar");

  return () =>
    div(
      nav(
        { class: "nav" },
        navLink({name: "home"}, "Home"),
        navLink({name: "users"}, "Users"),
        navLink({name: "context"}, "Context"),
        navLink({name: "agreement"}, "Agreement")
      ),
      hr()
    )
};

export default navbar;
