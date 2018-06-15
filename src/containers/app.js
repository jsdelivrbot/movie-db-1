import React from "react";
import SearchBar from "../components/search-bar";
import VideoList from "./video-list";
import VideoDetail from "../components/video-details";
import Video from "../components/video";
import axios from "axios";

/*
Useful constants for API
*/
const API_END_POINT = "https://api.themoviedb.org/3/";
const SEARCH_URL = "search/movie?language=fr&include_adult=false";
const POPULAR_MOVIES_URL =
  "discover/movie?language=fr&sort_by=popularity.desc&include_adult=false&append_to_response=images";
const API_KEY = "api_key=4be036249e60cb50f0fbafd6949f692b";

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      movies: {},
      currentMovie: {},
      intervalBeforeRequest: 1000,
      lockRequest: false
    };
  }

  /*
  Here we perform the Ajax request.
*/
  componentWillMount() {
    this.initMovies();
  }

  initMovies() {
    axios.get(`${API_END_POINT}${POPULAR_MOVIES_URL}&${API_KEY}`).then(
      function(response) {
        this.setState(
          {
            movies: response.data.results.slice(1, 6),
            currentMovie: response.data.results[0]
          },
          function() {
            this.applyVideoToCurrentMovie();
          }
        );
      }.bind(this)
    );
  }

  applyVideoToCurrentMovie() {
    axios
      .get(
        `${API_END_POINT}movie/${
          this.state.currentMovie.id
        }?${API_KEY}&append_to_response=videos&include_adult=false`
      )
      .then(
        function(response) {
          const youtubeKey = response.data.videos.results[0].key;
          let newCurrentMovieState = this.state.currentMovie;
          newCurrentMovieState.videoId = youtubeKey;
          this.setState({ currentMovie: newCurrentMovieState });
        }.bind(this)
      );
  }

  setRecommandations() {
    axios
      .get(
        `${API_END_POINT}movie/${
          this.state.currentMovie.id
        }/recommendations?${API_KEY}&append_to_response=videos&include_adult=false`
      )
      .then(
        function(response) {
          this.setState({ movies: response.data.results.slice(0, 5) });
        }.bind(this)
      );
  }

  onClickListItem(movie) {
    this.setState(
      {
        currentMovie: movie
      },
      function() {
        this.applyVideoToCurrentMovie();
        this.setRecommandations();
      }
    );
  }

  onClickSearch(searchText) {
    if (searchText) {
      axios
        .get(`${API_END_POINT}${SEARCH_URL}&${API_KEY}&query=${searchText}`)
        .then(
          function(response) {
            if (response.data && response.data.results[0]) {
              // Don't update state if searched movie is same as current one
              if (response.data.results[0].id != this.state.currentMovie.id) {
                this.setState(
                  { currentMovie: response.data.results[0] },
                  () => {
                    this.applyVideoToCurrentMovie();
                    this.setRecommandations();
                  }
                );
              }
            }
          }.bind(this)
        );
    }
  }

  render() {
    const renderVideoList = () => {
      if (this.state.movies.length >= 5) {
        return (
          <VideoList
            movies={this.state.movies}
            callback={this.onClickListItem.bind(this)}
          />
        );
      }
    };

    return (
      <div>
        <div className="search-bar">
          <SearchBar callback={this.onClickSearch.bind(this)} />
        </div>
        <div className="row">
          <div className="col-md-8">
            <Video videoId={this.state.currentMovie.videoId} />

            <VideoDetail
              title={this.state.currentMovie.title}
              description={this.state.currentMovie.overview}
            />
          </div>
          <div className="col-md-4">{renderVideoList()}</div>
        </div>
      </div>
    );
  }
}

export default App;
