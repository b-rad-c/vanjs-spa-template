import "./index.css";
import van from "vanjs-core";

const defaultContext = {agreement: false}

const context = van.state(defaultContext)

const getNavState = () => context.val
const setNavState = (newState) => {
  if(newState === null) {
    context.val = defaultContext
  }else{
    context.val = newState
  }
}

export default context;
export { getNavState, setNavState }
