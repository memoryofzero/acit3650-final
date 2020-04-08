import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Text, View } from 'react-native';
import MapView from 'react-native-maps';
import MapViewDirections from 'react-native-maps-directions';
import { Avatar, Button, Card, Title, Paragraph, Searchbar } from 'react-native-paper';
import * as Permissions from 'expo';

export default class Map extends Component {

  constructor() {
    super();
    this.state = {
      search:'',
      results: []
      position: 'N/A'
      locationPermission: 'N/A'
    }
  }

  _getLocationPermissions = async() => {
    let {status} = await Permissions.askAsync(Permissions.LOCATION);
    if (status !== 'granted') {
      this.setState({
        locationPermission: false,
      });
    } else {
      this.setState({
        locationPermission: true,
      })
    }
  };

  getResults(query) {
    this.setState({results: []})
  }

  componentDidMount() {
    this._getLocationPermissions();
    navigator.geolocation.getCurrentPosition((position) => {
      let coordinates = position.coords.latitude+','+position.coords.longitude;
      this.setState({
        position: coordinates
      })
    }, (error) => alert(JSON.stringify(error)));
  }

  render() {
    return (
      <View style={styles.container}>
        <Searchbar
          placeholder='Search'
          onChangeText={search => this.setState({search})}
          onSubmitEditing={event => this.getResults(event.nativeEvent.text)}
          value={this.state.search}
        />
        <MapView 
          region={this.state.region}
          style={styles.map}
          ref={ref => {this.map = ref;}}>
        </MapView>
        <View style={styles.bottom}>
          <FlatList
            horizontal={true}
            data={this.state.results}
            renderItem={this.renderItem}
            keyExtractor={item => item.name}
          />
        </View>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    alignItems: 'center',
  },
  map: {
    ...StyleSheet.absoluteFillObject,
  },
  bottom: {
    justifyContent: 'flex-end',
    marginBottom: 36,
  }
});
