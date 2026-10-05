import React, {Component} from 'react';
import {Route, Switch} from 'react-router-dom';
import SiteWrapper from '../container/template/Wrapper/Wrapper';
import ContentWrapper from '../container/template/ContentWrapper/ContentWrapper';
import Home from '../container/pages/Home/Home';
import GlobalProvider from '../context/Context';
import Post from '../container/pages/Post/Post';
import RootRouter from './RootRouter';
import AnimeList from '../container/pages/AnimeList/AnimeList';
import PlayerPage from '../container/pages/PlayerPage/PlayerPage';

class Router extends Component {
  render(){
    return(
        <Switch>
          <Route path='/' component={Home} exact />
          <Route path='/anime/:id/:title' component={Post} exact />
          <Route path='/anime-list/' component={AnimeList} exact />
          <Route path='/anime/:id/:title/:play_id/:play_title' component={PlayerPage} exact />
        </Switch>
    );
  }
}

export default RootRouter(GlobalProvider(SiteWrapper(ContentWrapper(Router))));