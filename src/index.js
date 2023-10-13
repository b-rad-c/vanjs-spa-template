import navbar from "./app/navbar";
import van from "vanjs-core";

const { div } = van.tags;

const Navbar = navbar();

const App = () =>
  div(
    Navbar(""),
    div({ id: "layout", class: "layout" })
  );

document.body.replaceChildren(App());
