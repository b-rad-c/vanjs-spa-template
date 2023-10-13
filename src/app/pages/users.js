import van from "vanjs-core";
import { navLink } from "../routes.js";

const { section, div, br, h1, ul, li } = van.tags

const userDB = [
  {first: "John", middle: "R", last: "Doe", age: 42},
  {first: "Jane", middle: "P", last: "Doe", age: 47},
  {first: "Pilar", middle: "Maria", last: "Mendoza", age: 42}
]

const userListItem = (user, userId) => 
  li(
    navLink({name: "user", params: {userId: userId}, class: ""}, `${user.first} ${user.last}`)
  )

const usersPage = () => {

  console.log("function userPage");

  return () =>
    section(
      h1("Users"),
      br(),
      div({class: "centered-container", style: "width: 42%;"},
        ul(
          userDB.map((user, userId) => userListItem(user, userId))
        )
      )
    );
};

export default usersPage;
export { userDB }
