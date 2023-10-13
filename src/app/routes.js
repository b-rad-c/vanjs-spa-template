import UniversalRouter from "universal-router";
import generateUrls from "universal-router/generateUrls"
import van from "vanjs-core";
import { getNavState, setNavState } from "../context"
const { a } = van.tags

console.log("routes.js")

//
// page state
//

const currentPage = van.state("")

async function changePage(moduleName, { route, params }) {
  console.log("router.name", route)
    currentPage.val = route.name
    if (route.title) window.document.title = route.title
    const { default: page } = await import(`./pages/${moduleName}.js`);
    return page(params);
}

//
// routes
//

const routes = [
  {
    path: "/",
    name: "home",
    title: "VanJS Example | Home",
    action: async (ctx) => changePage("home", ctx),
  },
  {
    path: "/context",
    name: "context",
    title: "VanJS Example | Context",
    action: async (ctx) => changePage("context", ctx),
  },
  {
    path: "/agreement",
    name: "agreement",
    title: "VanJS Example | Agreement",
    action: async (ctx) => changePage("agreement", ctx),
  },
  {
    path: "/user/:userId",
    name: "user",
    title: "VanJS Example | User",
    action: async (ctx) => changePage("user", ctx),
  },
  {
    path: "/users",
    name: "users",
    title: "VanJS Example | Users",
    action: async (ctx) => changePage("users", ctx),
  },
  {
    path: "(.*)",
    name: "notfound",
    title: "VanJS Example | Not Found",
    action: async (ctx) => changePage("notFound", ctx),
  },
];

//
// router
//

const router = new UniversalRouter(routes);
const url = generateUrls(router)


const navigate = (pathname) => {
  console.log("navigate", pathname)
  history.pushState(getNavState(), "", pathname);
  router.resolve(pathname).then((page) => {
    layout.replaceChildren(page());
  });
} 

const handleNav = (e) => {
  e.preventDefault();
  console.log("navbar.handleNav", e.target.href)
  navigate(e.target.pathname)
};

//
// window events
//

window.onpopstate = (event) => {
  console.log("popstate:", event.target.location.pathname)
  router.resolve(event.target.location.pathname).then((page) => {
    layout.replaceChildren(page());
  });
};

window.onload = (event) => {
  console.log("window.onload", event.target.location.pathname, window.history.state)
  setNavState(window.history.state)
  router.resolve(event.target.location.pathname).then((page) => {
    layout.replaceChildren(page());
  });
}

//
// nav link component
//

const isCurrentPage = (pageName) => van.derive(() =>  (currentPage.val === pageName ? "page" : ""))

function navLink(props, ...children) {
  console.log("navLink", props)
  const { target, name, ...otherProps } = props;

  return a(
    {
      "aria-current": isCurrentPage(name),
      href: url(name, props.params),
      target: target || "_self",
      role: "link",
      class: otherProps.class || "linkNav",
      onclick: handleNav,
      ...otherProps,
    },
    children
  );
};

//
// exports
//

export { handleNav, navigate, isCurrentPage, currentPage, navLink }
export default router;
