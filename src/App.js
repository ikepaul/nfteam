import { useContext, useEffect } from "react";
import Button from "./components/Button";
import { UserContext } from "./components/UserContext";
import { Link } from "react-router-dom";
import Navbar from "./components/Navbar";
import faunadb from "faunadb";

// FQL functions
const {
  Documents,
  Map,
  Ref,
  Paginate,
  Get,
  Match,
  Select,
  Index,
  Create,
  Lambda,
  Collection,
  Join,
  Call,
  Function: Fn,
} = faunadb.query;

function App() {
  /* const client = new faunadb.Client({
    secret: "fnAEaVN499AAxYFnDn6Xh4GZ9c3qVw7a-OEhZ-rF",
    domain: "db.eu.fauna.com",
    scheme: "https",
  }); */
  const { user, setUser } = useContext(UserContext);

  useEffect(() => {
    if (!user) {
      const localUser = localStorage.getItem("user");
      if (localUser) {
        const foundUser = localUser;
        setUser(foundUser);
      }
    }
  }, []);

  return (
    <div className="App">
      {user ? (
        <div>
          <Navbar />
          You are signed with key: {user}
        </div>
      ) : (
        <div>
          You aren't logged in! Log in<Link to={"/login"}> here </Link>{" "}
        </div>
      )}
    </div>
  );
}

export default App;
