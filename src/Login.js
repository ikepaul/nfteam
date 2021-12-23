import React, { useContext } from "react";
import Input from "./components/Input";
import Joi from "joi";
import * as yup from "yup";
import Button from "./components/Button";
import faunadb from "faunadb";
import { Link, Navigate } from "react-router-dom";
import { UserContext } from "./components/UserContext";
const {
  Documents,
  Map,
  Ref,
  Paginate,
  Get,
  Exists,
  Match,
  Select,
  Index,
  Create,
  Lambda,
  Collection,
  Join,
  Login: FaunaLogin,
  Call,
  Function: Fn,
} = faunadb.query;

class Login extends React.Component {
  static contextType = UserContext;

  state = {
    data: {
      username: "",
      password: "",
    },
    loginFailed: "",
    redir: false,
  };

  updateUsername = e => {
    const data = { ...this.state.data };
    const username = e.target.value;
    data.username = username;
    this.setState({ data });
  };

  updatePassword = e => {
    const data = { ...this.state.data };
    const password = e.target.value;
    data.password = password;
    this.setState({ data });
  };

  formSubmit = e => {
    console.log(this.context);
    e.preventDefault();
    console.log("Trying to log in");
    const { username, password } = this.state.data;
    const client = new faunadb.Client({
      secret: "fnAEaWbgzoAAwyZTDq94vnfSjZm27pfo9meEZH29",
      domain: "db.eu.fauna.com",
      scheme: "https",
    });
    let query = "";
    if (username.indexOf("@") == -1) {
      //Log in using username
      console.log("Logging in using USERNAME");
      query = FaunaLogin(Match(Index("users_by_username"), username), {
        password,
      });
    } else {
      //Log in using email
      console.log("Logging in using EMAIL");
      query = FaunaLogin(Match(Index("users_by_email"), username), {
        password,
      });
    }

    client
      .query(query)
      .then(response => {
        console.log(response);
        const { user, setUser } = this.context;
        setUser(response.secret);
        localStorage.setItem("user", response.secret);
        this.setState({ redir: true });
      })
      .catch(err => {
        this.setState({ loginFailed: "Invalid Login" });
        console.log(err);
      });
  };

  render() {
    const { user } = this.context;
    return (
      <div>
        {this.state.redir ? (
          <Navigate to="/" replace={true} />
        ) : (
          <div id="login_account">
            <h1>Login To An Account! {user}</h1>
            <form>
              {this.state.loginFailed && (
                <div className="field-validation-error" role="alert">
                  {this.state.loginFailed}
                </div>
              )}
              <br />
              <Input
                value={this.state.data.username}
                label="Username"
                onChange={this.updateUsername}
              />
              <br />
              <Input
                type="password"
                value={this.state.data.password}
                label="Password"
                onChange={this.updatePassword}
              />
              <br />
              <Button
                disabled={this.state.data.disabled}
                label="Login"
                handleClick={this.formSubmit}
              />
              <br />
              <Link to="/register">Register</Link>
            </form>
          </div>
        )}
      </div>
    );
  }
}

export default Login;
