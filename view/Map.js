import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Text, View, StyleSheet, FlatList, Dimensions } from 'react-native';
import MapView, { Marker, ProviderPropType, AnimatedRegion } from 'react-native-maps';
import MapViewDirections from 'react-native-maps-directions';
import Carousel from 'react-native-snap-carousel';
import { Avatar, Button, Card, Title, Paragraph, Searchbar } from 'react-native-paper';
import * as Permissions from 'expo';
import carImage from '../assets/car.png';

export default class Map extends Component {

  constructor() {
    super();
    this.state = {
      search:'',
      results: [],
      position: 'N/A',
      region: {},
      locationPermission: 'N/A',
      origin: '',
      destination: '',
      carCardVisible: false,
      selectedCar: null,
      carImage: '',
      carName: '',
      carCoords: '',
      car1Coords: {latitude: 0, longitude: 0},
      car2Coords: {latitude: 0, longitude: 0},
      car3Coords: {latitude: 0, longitude: 0},
      routeVisible: false,
    }
    this.onRegionChange = this.onRegionChange.bind(this);
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

  renderItem = ({item}) => {
    return (
      <Card styles={styles.card}>
        <Card.Cover source={{uri:`https://maps.googleapis.com/maps/api/place/photo?maxwidth=800&photoreference=${item.hasOwnProperty('photos') ? item.photos[0].photo_reference : '' }&key=${key.apiKey}`}}/>
        <Card.Content>
          <Title>{item.name}</Title>
          <Paragraph>{item.vicinity}</Paragraph>
        </Card.Content>
        <Card.Actions>
          <Button onPress={() => this.cancelSearch()}>Cancel</Button>
          <Button onPress={() => {
            let latlong = item.geometry.location.lat+','+item.geometry.location.lng;
            this.navigateTo(this.state.position, latlong)
          }}>
            Go Here!
          </Button>
        </Card.Actions>
      </Card>
    )
  }

  onRegionChange(region) {
    this.setState({region});
  }

  getResults(query) {
    this.setState({results: []})
    fetch(`https://maps.googleapis.com/maps/api/place/nearbysearch/json?keyword=${query}&radius=25000&key=${key.apiKey}&location=${this.state.position}`)
      .then((res) => res.json())
      .then((json) => {
        let results = json.results;
        this.setState({results});
      })
  };

  selectCar(name, image, coords) {
    let latlong = JSON.stringify(coords.latitude)+','+JSON.stringify(coords.longitude);
    console.log('latlong: ' +latlong)
    this.setState({
      carName: name,
      carImage: image,
      carCoords: latlong,
      carCardVisible: true,
      selectedCar: coords,
    })
  }

  clearCar() {
    this.setState({
      carCardVisible: false,
      selectedCar: '',
    })
  }

  cancelSearch() {
    this.setState({
      results: [],
    })
  }

  navigateTo(origin, destination) {
    this.setState({
      origin,
      destination,
      carCardVisible: false,
      results: [],
    })
    this.setState({routeVisible: true});
    this.searchbar.clear();
  }

  animateCar(coordinates) {
    var promise = Promise.resolve();
    coordinates.forEach((coord) => {
      promise = promise.then(() => {
        this.state.selectedCar.timing(coord).start();
        return new Promise((resolve) => {
          setTimeout(resolve, 1000);
        });
      });
    });

    promise.then(() => {
      this.setState({routeVisible: false});
      this.updatePosition();
    });
  }
  
  updatePosition() {
//    navigator.geolocation.getCurrentPosition((position) => {
//      let coords = position.coords.latitude+','+position.coords.longitude;
//      this.setState({position: coords});
//    })
    this.setState({position: this.state.destination});
  }

  componentDidMount() {
    this._getLocationPermissions();
    navigator.geolocation.getCurrentPosition((position) => {
      let coords = position.coords.latitude+','+position.coords.longitude;
      this.setState({
        position: coords
      })
      let region = {
        latitude: position.coords.latitude,
        latitudeDelta: 0.05,
        longitude: position.coords.longitude,
        longitudeDelta: 0.05,
      };
      this.setState({region})
      let car1Coords = new AnimatedRegion({
        latitude: (this.state.region.latitude+(Math.random()-0.5)*0.025), 
        longitude: (this.state.region.longitude+(Math.random()-0.5)*0.025),
        latitudeDelta: 0,
        longitudeDelta: 0,
      })
      let car2Coords = new AnimatedRegion({
        latitude: (this.state.region.latitude+(Math.random()-0.5)*0.025),
        longitude: (this.state.region.longitude+(Math.random()-0.5)*0.025),
        latitudeDelta: 0,
        longitudeDelta: 0,
      })
      let car3Coords = new AnimatedRegion({
        latitude: (this.state.region.latitude+(Math.random()-0.5)*0.025),
        longitude: (this.state.region.longitude+(Math.random()-0.5)*0.025),
        latitudeDelta: 0,
        longitudeDelta: 0,
      })
      this.setState({car1Coords, car2Coords, car3Coords});

    }, (error) => alert(JSON.stringify(error)));
  };

  render() {
        return (
      <View style={styles.container}>
        <MapView 
          initialRegion={this.state.region}
          onRegionChangeComplete={this.onRegionChange}
          style={styles.map}
          ref={ref => {this.map = ref;}}>
          <Marker.Animated
            ref={ref => {this.marker1 = ref;}}
            coordinate={this.state.car1Coords}
            image={carImage}
            anchor={{x:0.5,y:0.5}}
            onPress={() => this.selectCar('Toyota Corolla 2004', 'https://upload.wikimedia.org/wikipedia/commons/2/2a/2003-2004_Toyota_Corolla_%28ZZE122R%29_Conquest_sedan_01.jpg', this.state.car1Coords)}
          />
          <Marker.Animated
            ref={ref => {this.marker2 = ref;}}
            coordinate={this.state.car2Coords}
            image={carImage}
            anchor={{x:0.5,y:0.5}}
            onPress={() => this.selectCar('Audi R8 2018', 'https://upload.wikimedia.org/wikipedia/commons/d/d2/2018_Audi_R8_Coupe_V10_plus_Front.jpg', this.state.car2Coords)}
          />
          <Marker.Animated
            ref={ref => {this.marker3 = ref;}}
            coordinate={this.state.car3Coords}
            image={carImage}
            anchor={{x:0.5,y:0.5}}
            onPress={() => this.selectCar('BMW X1 2018', 'https://upload.wikimedia.org/wikipedia/commons/4/4c/2018_BMW_X1_sDrive18i_xLine_1.5_Front.jpg', this.state.car3Coords)}
          />
          {
            this.state.routeVisible ? 
              <MapViewDirections
                origin={this.state.origin}
                destination={this.state.destination}
                apikey={key.apiKey}
                strokeWidth={3}
                strokeColor='hotpink'
                onStart={(params) => {
                  console.log(`between ${params.origin} and ${params.destination}`)
                }}
                onReady={result => {
                  this.animateCar(result.coordinates)
                  this.map.fitToCoordinates(result.coordinates, {
                    edgePadding: {
                      right: Dimensions.get('window').width/20,
                      bottom: Dimensions.get('window').height/20,
                      left: Dimensions.get('window').width/20,
                      top: Dimensions.get('window').height/5,
                    }
                  });
                }}
              />
            : null
          }
        </MapView>
        <View>
           <Searchbar style={styles.searchbar}
            placeholder='Search'
            onChangeText={search => this.setState({search})}
            onSubmitEditing={event => this.getResults(event.nativeEvent.text)}
            value={this.state.search}
            ref={ref => {this.searchbar = ref;}}
          />
        </View>

        <View style={styles.bottom}>
          <Carousel
            ref={ref => {this.carousel = ref;}}
            data={this.state.results}
            renderItem={this.renderItem}
            sliderWidth={Dimensions.get('window').width}
            itemWidth={Dimensions.get('window').width-20}
          />
          { 
            this.state.carCardVisible ?
              <Card style={styles.card}>
                <Card.Cover source={{uri: this.state.carImage}}/>
                <Card.Content>
                  <Title>{this.state.carName}</Title>
                </Card.Content>
                <Card.Actions>
                  <Button onPress={() => this.clearCar()}>Cancel</Button>
                  <Button onPress={() => this.navigateTo(this.state.carCoords,this.state.position)}>Ok</Button>
                </Card.Actions>
              </Card>
            : null 
          }
        </View>
      </View>
    )
  }
}

Map.propTypes = {
  provider: ProviderPropType,
};

const key = require('../key.json')

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'space-between',
  },
  map: {
    ...StyleSheet.absoluteFillObject,
  },
  bottom: {
    marginBottom: 10,
  },
  searchbar: {
    margin: 15,
  },
  card: {
    margin: 15,
  }
});
