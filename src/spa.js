import van from "vanjs-core";
import UniversalRouter from "universal-router";
import generateUrls from "universal-router/generateUrls"
const { a } = van.tags;

console.log('spa.js')

function createVanSpa(routes, defaultNavState) {

    const currentPage = van.state("")

    const isCurrentPage = (pageName) => van.derive(() => currentPage.val === pageName)

    async function changePage(moduleName, { route, params }) {
        console.log("VanSpa.changePage to " + route.name + ' cur: ' + currentPage.val)
        currentPage.val = route.name
        if (route.title) window.document.title = route.title
        const { default: page } = await import(`./app/pages/${moduleName}.js`);
        console.log("changed page to " + currentPage.val)
        return page(params);
    }

    const updatedRoutes = routes.map(route => {
        if (!route.hasOwnProperty('action')) route.action = async (ctx) => changePage(route.name, ctx)
        return route
    })

    // router
    const router = new UniversalRouter(updatedRoutes);
    const generateUrl = generateUrls(router)

    // nav state
    const _defaultNavState = typeof defaultNavState === 'undefined' ? null : defaultNavState
    const navState = van.state(_defaultNavState)

    const getNavState = () => navState.val

    const setNavState = (newState) => {
        if(newState === null) {
            navState.val = defaultNavState
        }else{
            navState.val = newState
        }
    }

    // window navigation events
    window.onpopstate = (event) => {
        console.log("VanSpa.popstate:", event.target.location.pathname)
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

    // navigation functions
    const navigate = (pathname) => {
        console.log("VanSpa.navigate", pathname)
        history.pushState(getNavState(), "", pathname);
        router.resolve(pathname).then((page) => {
            layout.replaceChildren(page());
        });
    } 
      
    const handleNav = (event) => {
        event.preventDefault();
        console.log("VanSpa.handleNav", event.target.href)
        navigate(event.target.pathname)
    }

    // nav link component
    function navLink(props, ...children) {
        const { target, name, ...otherProps } = props;

        console.log("VanSpa.navLink", props)

        return a(
            {
                "aria-current": van.derive(() => (isCurrentPage(name).val ? "page" : "")),
                href: generateUrl(name, props.params),
                target: target || "_self",
                role: "link",
                class: otherProps.class || "linkNav",
                onclick: handleNav,
                ...otherProps,
            },
            children
        );
    };

    return {
        currentPage,
        router,
        generateUrl,
        navState,
        getNavState,
        setNavState,
        navigate,
        handleNav,
        isCurrentPage,
        navLink
    }
}

export default createVanSpa
