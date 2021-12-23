import React from "react";
import Input from "./components/Input";
import Joi from "joi";
import * as yup from "yup";
import Button from "./components/Button";
import faunadb, { Login } from "faunadb";
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
  Call,
  Function: Fn,
} = faunadb.query;

function equalTo(ref, msg) {
  console.log(ref, msg);
  return this.test({
    name: "equalTo",
    exclusive: false,
    message: msg || "${path} must be the same as ${reference}",
    params: {
      reference: ref.path,
    },
    test: function (value) {
      return value === this.resolve(ref);
    },
  });
}

class Register extends React.Component {
  static contextType = UserContext;
  state = {
    data: {
      username: "",
      email: "",
      disabled: true,
      password: "",
      repeat_password: "",
    },
    redir: false,
    errors: { username: [], email: [], password: [], repeat_password: [] },
  };

  componentDidMount() {
    yup.addMethod(yup.string, "equalTo", equalTo);

    this.schema = yup.object().shape({
      username: yup
        .string()
        .matches(
          "^[a-zA-Z0-9_]*$",
          "Username must only be the symbols A-Z and 0-9"
        )
        .min(3)
        .max(30)
        .required(),
      email: yup.string().email().required(),
      password: yup
        .string()
        .matches("^[a-zA-Z0-9_]*$")
        .min(8)
        .max(30)
        .required(),
      repeat_password: yup.string().equalTo(yup.ref("password")),
    });
  }
  checkButtonDisability = () => {
    const data = this.state.data;
    delete data.disabled;
    let disable = false;

    if (
      this.state.errors.username[0] ||
      this.state.errors.email[0] ||
      this.state.errors.password[0] ||
      this.state.errors.repeat_password[0]
    ) {
      disable = true;
    }

    this.schema
      .validate(this.state.data, { abortEarly: true })
      .catch(error => {
        disable = true;
      })
      .then(() => {
        data.disabled = disable;
        this.setState({ data });
      });
  };

  updateUsername = e => {
    const data = { ...this.state.data };
    const username = e.target.value;
    data.username = username;
    this.setState({ data }, this.validateUsername);
  };

  validateUsername = () => {
    const errors = this.state.errors;
    const username = this.state.data.username;
    errors.username = [];
    this.schema
      .validateAt("username", { username }, { abortEarly: false, strict: true })
      .catch(error => {
        errors.username = error.errors;
      });
    const client = new faunadb.Client({
      secret: "fnAEaWbgzoAAwyZTDq94vnfSjZm27pfo9meEZH29",
      domain: "db.eu.fauna.com",
      scheme: "https",
    });

    const query = Exists(Match(Index("users_by_username"), username));
    client.query(query).then(answer => {
      if (answer) {
        errors.username.push("User with that username already exists");
      }
      this.setState({ errors });
      this.checkButtonDisability();
    });
  };

  updateEmail = e => {
    const data = { ...this.state.data };
    const email = e.target.value;
    data.email = email;
    this.setState({ data }, this.validateEmail);
  };

  validateEmail = () => {
    const errors = this.state.errors;
    const email = this.state.data.email;
    errors.email = [];
    this.schema
      .validateAt("email", { email }, { abortEarly: false, strict: true })
      .catch(error => {
        errors.email = error.errors;
      });
    const client = new faunadb.Client({
      secret: "fnAEaWbgzoAAwyZTDq94vnfSjZm27pfo9meEZH29",
      domain: "db.eu.fauna.com",
      scheme: "https",
    });

    const query = Exists(Match(Index("users_by_email"), email));
    client.query(query).then(answer => {
      if (answer) {
        errors.email.push("User with that email already exists");
      }
      this.setState({ errors });
      this.checkButtonDisability();
    });
  };

  updatePassword = e => {
    const data = { ...this.state.data };
    const password = e.target.value;
    const errors = this.state.errors;
    errors.password = [];
    data.password = password;
    this.schema
      .validateAt("password", { password }, { abortEarly: false, strict: true })
      .catch(error => {
        errors.password = error.errors;
        this.setState({ errors }, this.checkButtonDisability);
      });

    this.setState({ data }, this.checkButtonDisability);
  };

  updateRepeat = e => {
    const data = { ...this.state.data };
    const repeat_password = e.target.value;
    const password = this.state.data.password;
    const errors = this.state.errors;
    errors.repeat_password = [];
    data.repeat_password = repeat_password;
    this.schema
      .validateAt(
        "repeat_password",
        { password, repeat_password },
        { abortEarly: true, strict: true }
      )
      .catch(error => {
        errors.repeat_password = error.errors;
        this.setState({ errors }, this.checkButtonDisability);
      });
    this.setState({ data }, this.checkButtonDisability);
  };

  mapErrors = (errors, name) => {
    return (
      <div className="field-validation-error" role="alert">
        {errors.map(error => (
          <div key={error}>{error[0].toUpperCase() + error.slice(1)}</div>
        ))}
      </div>
    );
  };

  formSubmit = e => {
    e.preventDefault();
    console.log("Hello");
    const { username, password, email } = this.state.data;
    const client = new faunadb.Client({
      secret: "fnAEaWbgzoAAwyZTDq94vnfSjZm27pfo9meEZH29",
      domain: "db.eu.fauna.com",
      scheme: "https",
    });
    // FQL functions

    let query = Create(Collection("users"), {
      credentials: { password },
      data: {
        username,
        email,
      },
    });
    try {
      client.query(query).then(() => {
        query = Login(Match(Index("users_by_username"), username), {
          password,
        });
        client.query(query).then(response => {
          const { user, setUser } = this.context;
          setUser(response.secret);
          localStorage.setItem("user", response.secret);
          this.setState({ redir: true });
        });
      });
    } catch (err) {
      console.log(err);
    }

    //Send query via client
  };

  render() {
    const { redir } = this.state;
    return (
      <div id="register_account">
        {redir && <Navigate replace={true} to={"/"} />}
        <h1>Register An Account!</h1>
        <form>
          <Input
            value={this.state.data.username}
            label="Username"
            onChange={this.updateUsername}
          />
          <br />
          {this.state.errors.username.length > 0 &&
            this.mapErrors(this.state.errors.username, "Username")}
          <br />
          <Input
            autoComplete="off"
            value={this.state.data.email}
            label="Email"
            onChange={this.updateEmail}
          />
          <br />
          {this.state.errors.email.length > 0 &&
            this.mapErrors(this.state.errors.email, "Email")}
          <br />
          <Input
            type="password"
            value={this.state.data.password}
            label="Password"
            onChange={this.updatePassword}
          />
          <br />
          {this.state.errors.password.length > 0 &&
            this.mapErrors(this.state.errors.password, "Password")}
          <br />
          <Input
            type="password"
            value={this.state.data.repeat_password}
            label="Repeat Password"
            onChange={this.updateRepeat}
          />
          <br />
          {this.state.errors.repeat_password.length > 0 && (
            <div className="field-validation-error" role="alert">
              Passwords have to match
            </div>
          )}
          <br />
          <Button
            disabled={this.state.data.disabled}
            label="Create the account"
            handleClick={this.formSubmit}
          />
          <br />
          <Link to={"/login"}>Login</Link>
        </form>
      </div>
    );
  }
}

export default Register;
