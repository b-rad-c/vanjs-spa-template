import van from "vanjs-core";
import UniversalRouter from "universal-router";
import generateUrls from "universal-router/generateUrls"
const { a } = van.tags;

console.log('spa.js')

const currentPage = van.state("")

const isCurrentPage = (pageName) => van.derive(() => (currentPage.val === pageName))

function createVanSpa(routes, defaultNavState) {

    // const currentPage = van.state("")

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

        console.log("VanSpa.navLink", props, currentPage.val, isCurrentPage(name).val)

        const ariaCurrent = van.derive(() => (isCurrentPage(name).val ? "page" : ""))

        van.derive(() => console.log('VanSpa.navLink | ' + name + ' | is cur: ' + isCurrentPage(name).val + ' | aria ' + ariaCurrent.val + ' |'))

        return a(
            {
                "aria-current": ariaCurrent.val,
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
// export { changePage }

// class VanSpa {

//     constructor(routes, defaultNavState) {
//         this.routes = routes;
//         this.router = new UniversalRouter(routes);
//         this.generateUrl = generateUrls(router)
//         this.currentPage = van.state("")

//         this.defaultNavState = typeof defaultNavState === 'undefined' ? null : defaultNavState
//         this.navState = van.state(this.defaultNavState)

//         window.onpopstate = (event) => {
//             console.log("VanSpa.popstate:", event.target.location.pathname)
//             this.router.resolve(event.target.location.pathname).then((page) => {
//                 layout.replaceChildren(page());
//             });
//         };

//         window.onload = (event) => {
//             console.log("window.onload", event.target.location.pathname, window.history.state)
//             this.setNavState(window.history.state)
//             this.router.resolve(event.target.location.pathname).then((page) => {
//                 layout.replaceChildren(page());
//             });
//         }
        
//     }

//     getNavState() {
//         return this.navState.val
//     }

//     setNavState(newState) {
//         if(newState === null) {
//             this.navState.val = this.defaultNavState
//         }else{
//             this.navState.val = newState
//         }
//     }

//     async changePage(moduleName, { route, params }) {
//         console.log("VanSpa.changePage", route)
//         this.currentPage.val = route.name
//         if (route.title) window.document.title = route.title
//         const { default: page } = await import(`./pages/${moduleName}.js`);
//         return page(params);
//     }

//     navigate(pathname) {
//         console.log("VanSpa.navigate", pathname)
//         history.pushState(getNavState(), "", pathname);
//         this.router.resolve(pathname).then((page) => {
//             layout.replaceChildren(page());
//         });
//     } 
      
//     handleNav(event) {
//         event.preventDefault();
//         console.log("VanSpa.handleNav", event.target.href)
//         this.navigate(event.target.pathname)
//     }

//     isCurrentPage(pageName) {
//         van.derive(() => currentPage.val === pageName)
//     }

//     navLink(props, ...children) {
//         console.log("VanSpa.navLink", props)
//         const { target, name, ...otherProps } = props;

//         return a(
//             {
//                 "aria-current": this.isCurrentPage(name) ? "page" : "",
//                 href: url(name, props.params),
//                 target: target || "_self",
//                 role: "link",
//                 class: otherProps.class || "linkNav",
//                 onclick: handleNav,
//                 ...otherProps,
//             },
//             children
//         );
//     };
// }