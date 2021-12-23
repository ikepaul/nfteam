import React, { useContext, useEffect, useState } from "react";
import { UserContext } from "./components/UserContext";
import { useNavigate } from "react-router-dom";
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
  Identity,
  Select,
  Index,
  Create,
  Lambda,
  Collection,
  Join,
  Call,
  Var,
  Function: Fn,
} = faunadb.query;

function Profile() {
  const navigate = useNavigate();
  const { user, setUser } = useContext(UserContext);
  const [username, setUsername] = useState("Loading...");
  const [email, setEmail] = useState("Loading...");
  const [posts, setPosts] = useState();

  useEffect(() => {
    if (!user) {
      const localUser = localStorage.getItem("user");
      if (localUser) {
        const foundUser = localUser;
        setUser(foundUser);
      } else {
        navigate("/", { replace: true });
      }
    } else {
      var client = new faunadb.Client({
        secret: user,
        domain: "db.eu.fauna.com",
        scheme: "https",
      });
      client.query(Select(["data"], Get(Identity()))).then(returns => {
        setUsername(returns.username);
        setEmail(returns.email);
        client
          .query(Map(returns.posts, Lambda("X", Get(Var("X")))))
          .then(posts => {
            setPosts(posts);
            console.log(posts);
          });
      });
    }
  }, [user]);

  const mapPosts = posts => {
    return posts.map(post => (
      <div className="post" key={post.ref.value.id}>
        <h3>{post.data.title}</h3>
        <img src={post.data.image} />
        <div>{post.data.content}</div>
      </div>
    ));
  };

  return (
    <div id="profile">
      <Navbar />
      <div>Hello {username}!</div>
      <div>Email: {email}</div>
      <div id="myposts">{posts ? mapPosts(posts) : "Loading..."}</div>
    </div>
  );
}

export default Profile;
