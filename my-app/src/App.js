import React, { Component } from 'react';
import Pagination from "react-js-pagination";
import './App.css';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      textLoaded: false,
      condition: false,
      text: [],
      error: null,
      isLoaded: false,
      items: [],
      totalPages: 1,
      activePage: 1
    };
  }

  componentDidMount = () => {
    fetch("https://content.guardianapis.com/search?api-key=1f4ab76d-b493-43db-940f-3c63f78ac1a5")
      .then(res => res.json())
      .then(
        (result) => {
          let arr = [];
          for(let i = 0; i < 10; i++){
              fetch(result.response.results[i].apiUrl + "?show-blocks=body&api-key=1f4ab76d-b493-43db-940f-3c63f78ac1a5")
              .then(res => res.json())
              .then(
                (result) => {
                  if((result.response.content.blocks.body[0].bodyTextSummary).length > 400){
                    arr.push((result.response.content.blocks.body[0].bodyTextSummary).slice(0, 400 - 3) + '...');
                  }
                }
              )
          }
          return this.setState({
            isLoaded: true,
            items: result.response.results,
            totalPages: result.response.pages,
            text: arr,
            textLoaded: true
          });
        },
        (error) => {
          return this.setState({
            isLoaded: true,
            error,
            textLoaded: true
          });
        }
      )
  }

  handlePageChange = (pageNumber) => {
    this.setState({activePage: pageNumber});
    fetch("https://content.guardianapis.com/search?page=" + pageNumber + "&api-key=1f4ab76d-b493-43db-940f-3c63f78ac1a5")
    .then(res => res.json())
    .then(
      (result) => {
        let arr = [];
        for(let i = 0; i < 10; i++){
            fetch(result.response.results[i].apiUrl + "?show-blocks=body&api-key=1f4ab76d-b493-43db-940f-3c63f78ac1a5")
            .then(res => res.json())
            .then(
              (result) => {
                if((result.response.content.blocks.body[0].bodyTextSummary).length > 400){
                  arr.push((result.response.content.blocks.body[0].bodyTextSummary).slice(0, 400 - 3) + '...');
                }
              }
            )
        }
        return this.setState({
          isLoaded: true,
          items: result.response.results,
          totalPages: result.response.pages,
          text: arr,
          textLoaded: true
        });
      },
      (error) => {
        return this.setState({
          isLoaded: true,
          textLoaded: true,
          error
        });
      }
    )
  }

  buttonHandleClick = () => {
    this.setState({
      isLoaded: false,
      textLoaded: false
    });
    fetch("https://content.guardianapis.com/search?api-key=1f4ab76d-b493-43db-940f-3c63f78ac1a5")
      .then(res => res.json())
      .then(
        (result) => {
          let arr = [];
          for(let i = 0; i < 10; i++){
              fetch(result.response.results[i].apiUrl + "?show-blocks=body&api-key=1f4ab76d-b493-43db-940f-3c63f78ac1a5")
              .then(res => res.json())
              .then(
                (result) => {
                  if((result.response.content.blocks.body[0].bodyTextSummary).length > 400){
                    arr.push((result.response.content.blocks.body[0].bodyTextSummary).slice(0, 400 - 3) + '...');
                  }
                }
              )
          }
          return this.setState({
            isLoaded: true,
            items: result.response.results,
            totalPages: result.response.pages,
            // text: arr,
            textLoaded: true
          });
        },
        (error) => {
          return this.setState({
            isLoaded: true,
            textLoaded: true,
            error
          });
        }
      )
  }

  render() {
    const { error, isLoaded, items, text, textLoaded} = this.state;
    if (error) {
      return (
        <div>
          <h1>The Guardian News</h1>
          <p><button onClick={this.buttonHandleClick}>Refresh</button></p>
          <p className="errorMessage">Sorry, we cound't find news for you. Try again later.</p>
        </div>
      );
    } else if (!isLoaded || !textLoaded) {
      return (
        <div>
          <h1>The Guardian News</h1>
          <p>Loading...</p>
        </div>
      );
    } else {
      return (
        <div className="container">
          <div className="row">
            <div className="col">
            <h1>The Guardian News</h1>
            <p><button onClick={this.buttonHandleClick}>Refresh</button></p>
            <ul className="newsTable">
              {items.map(item => (
                  <li onClick={this.titleHandleClick} key={item.webTitle}>
                    <h4>{item.webTitle}</h4>
                  </li>
              ))}
            </ul>
            <Pagination
              activePage={this.state.activePage}
              itemsCountPerPage={10}
              totalItemsCount={this.state.totalPages/10}
              pageRangeDisplayed={5}
              onChange={this.handlePageChange}
            />
            </div>
          </div>
        </div>
      );
    }
  }
}

export default App;
