import van from "vanjs-core";
import Router from 'minimal-router'
const { a } = van.tags;

console.log('spa.js')

function createVanSpa(routes, defaultNavState) {

    const currentPage = van.state("")

    const isCurrentPage = (pageName) => van.derive(() => currentPage.val === pageName)

    // router
    const router = new Router();

    routes.forEach(route => {
        router.add(route.name, route.path, function({params, query}) {
            console.log("VanSpa.router.action to " + route.name + ' cur: ' + currentPage.val)

            currentPage.val = route.name
            if (route.title) window.document.title = route.title

            route.callable()
                .then((page) => layout.replaceChildren(page.default(params, query)()))
                .catch((error) => console.error('error changing page', error))
        });
    })

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
        router.dispatch(event.target.location.pathname)
    };

    window.onload = (event) => {
        console.log("window.onload", event.target.location.pathname, window.history.state)
        setNavState(window.history.state)
        router.dispatch(event.target.location.pathname)
    }

    // navigation functions
    const navigate = (pathname) => {
        console.log("VanSpa.navigate", pathname)
        history.pushState(getNavState(), "", pathname);
        router.dispatch(pathname)
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
                href: router.formatUrl(name, props.params, props.query),
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
