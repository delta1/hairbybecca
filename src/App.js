import React, { Component } from "react";
import "./App.css";

const video = props => {
  return (
    <div key={props.id} className="item-container">
      <video autoPlay muted loop src={props.media_url} className="item" />
    </div>
  );
};

const image = props => {
  return (
    <div key={"img-" + props.id} className="item-container">
      <a href={props.permalink} target="_blank" rel="noopener noreferrer">
        <img
          key={props.id}
          className="item"
          src={props.media_url}
          alt={props.caption}
          onError={e => console.log("img err", e)}
        />
      </a>
    </div>
  );
};
/*
hearts
      <a href={props.permalink} target="_blank">
      <img src="/heart.svg" alt="Love" className="heart" width="40" height="40" />
      <span className="count">{props.like_count}</span>
      </a>
      */

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      items: [],
      loading: true,
      error: false
    };
  }

  componentDidMount() {
    fetch(
      "https://graph.facebook.com/v3.0/17841400062889374/media?fields=permalink%2Cmedia_type%2Cmedia_url%2Ccaption%2Clike_count&limit=60&access_token=EAAGkUCSMmfYBADE3B6QKRKHup9S1lf3NSiZBqyPyiTZAWipvMNExrDcjZCgLgkWe2eg0LVSeOxkoOf0jHrhtuRkl0DsT0nAV8ZAdteL3tdJ8Q9NkXjfEolgjdxefE45c0qHtEz0XZCPw6Wp0JoM0YzDZCzFuYlwZB0ZD"
    )
      .then(r => r.json())
      .then(r => {
        //console.log('r', r);
        return r.data.filter(item => /#hairbybecca/i.test(item.caption));
      })
      .then(items => {
        //console.log('items', items);
        this.setState({ items, loading: false, error: false });
      })
      .catch(e => {
        console.error(e);
        this.setState({ error: true });
      });
  }

  render() {
    if (this.state.error)
      return <p>Oops! Unable to load the images. Please refresh!</p>;
    return this.state.loading ? (
      <p>
        <img src="/loading.svg" alt="loading..." />
      </p>
    ) : (
      <div>
        {this.state.items.map(item => {
          switch (item.media_type) {
            case "VIDEO":
              return video(item);
            default:
              return image(item);
          }
        })}
      </div>
    );
  }
}

export default App;
