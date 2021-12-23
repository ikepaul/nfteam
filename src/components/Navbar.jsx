import React from "react";
import { NavLink } from "react-router-dom";
import { UserContext } from "./UserContext";

class Navbar extends React.Component {
  static contextType = UserContext;

  componentDidMount() {
    const { user, setUser } = this.context;
    if (!user) {
      const localUser = localStorage.getItem("user");
      if (localUser) {
        const foundUser = localUser;
        setUser(foundUser);
      }
    }
  }

  render() {
    const { user, setUser } = this.context;
    const { pageNames } = this.props;
    let pages = [];

    if (pageNames) {
      pages = pageNames;
    } else if (user) {
      pages = ["home", "about", "profile", "logout"];
    } else {
      pages = ["login", "register"];
    }

    return (
      <div className="navbar">
        {pages &&
          pages.map(page => {
            return (
              <NavLink key={page} className="nav-link" to={"/" + page}>
                {page[0].toUpperCase() + page.slice(1)}
              </NavLink>
            );
          })}
      </div>
    );
  }
}

export default Navbar;

/* <Nav.Text
                      key={pageName}
                      active={activePage == pageName ? "active" : ""}
                    >
                      <Link aria-current="page" to={pageName}>
                        {pageName}
                      </Link>
                    </Nav.Text>*/
