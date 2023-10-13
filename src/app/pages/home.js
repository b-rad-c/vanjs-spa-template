import vanLogo from "/vanjs.svg";
import van from "vanjs-core";

const { section, div, br, h1, img } = van.tags

const homePage = () => {

  console.log("function Intro");

  return () =>
    section(
      h1("Welcome to this demo app. It is powered by VanJS, routed by Universal-Router."),
      br(),
      div(
        { style: "text-align:center;" },
        img({ src: vanLogo, alt: "VanJS", style: "height:100px;width:100px;" })
      )
    );
};

export default homePage;
