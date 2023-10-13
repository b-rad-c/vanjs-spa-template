import van from "vanjs-core";
import context from "../../context"
import { navLink } from "../routes.js";

const { label, input, span, br, section } = van.tags

const agreementPage = () => {

  console.log("Agreement");

  const inputParams = {
    type: "checkbox",
    id: "agreement",
    name: "agreement",
    checked: context.val.agreement,
    onchange: (e) => (context.val.agreement = e.target.checked),
  }

  return () =>
    section(
      label(input(inputParams), "I agree with the terms and conditions"),
      br(),
      span(navLink({"class": "", "name": "context"}, "click here"), " to view agreement status")
    )
};

export default agreementPage;
