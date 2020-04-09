import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { ImageBackground, StyleSheet, Text, View, Image, Alert } from 'react-native';
import * as Google from "expo-google-app-auth";
import * as Facebook from 'expo-facebook';
import { Button } from 'react-native-paper';


const google_config = {
  // Kevin's android and ios client id's
  androidClientId: "328874978995-2lapjgofl201415ft9uri774rh98vedd.apps.googleusercontent.com",
  iosClientId: "328874978995-9973qhi84grtd824po6uc0o99ke4lh6k.apps.googleusercontent.com",
  scopes: ["profile", "email"],
}

export default class Login extends Component {

  constructor(props) {
    super(props);
    this.state = {
      signedIn: false,
      name: "",
      email: "",
      photoUrl: "",
      accessToken: "",
    }
  }
  signIn = async () => {
    try {
      const result = await Google.logInAsync( google_config )
      if (result.type === "success") {
        console.log(result.user);
        this.setState({
          signedIn: true,
          name: result.user.name,
          photoUrl: result.user.photoUrl,
          email: result.user.email,
          accessToken: result.accessToken,
        })
      } else {
        console.log("cancelled")
      }
    } catch ( e ) {
      console.log("error", e)
    }
  }
  signOut = async () => {
    if (this.state.signedIn) {
      console.log("signing out")
      /* Log-Out */
      let accessToken = this.state.accessToken
      await Google.logOutAsync({ accessToken, ...google_config }).then(() => {
        this.setState({
          signedIn: false,
          name: "",
          email: "",
          photoUrl: "",
          accessToken: "",
        })
        this.props.navigation.navigate('Home')

      });
    }
  }
  fb_signIn = async () => {
    try {
      await Facebook.initializeAsync(
           '1146369092376154',
        );

        const result = await Facebook.logInWithReadPermissionsAsync(
          { permissions: ['public_profile'] }
        );

        if (result.type === 'success') {
          console.log(result)
          await fetch(`https://graph.facebook.com/me?fields=id,namepicture,email&access_token=${result.token}`).then(
            response => {
              this.props.navigation.navigate('NotUber')
            });
        } else {
        console.log("cancelled")
      }
    } catch ( e ) {
      console.log("error", e)
    }
  }

  render() {
    const { navigation } = this.props;

    return (
      <View style={styles.container}>

      {this.state.signedIn && 
        <View><Text style={styles.text}>This user is logged in</Text>
        <Text style={styles.text}>{this.state.name}</Text>
        <Image style={styles.image} source={{uri:this.state.photoUrl}}/></View>
      }
      
      {this.state.signedIn 
          && <View>
            <Button mode="contained" onPress={() => this.props.navigation.navigate('NotUber')}>Go to Map</Button>
        <Button mode="contained" onPress={()=>{
          Alert.alert(
            'Sign Out',
            'Are you sure you want to log out?',
            [
              {text: 'Cancel, keep me logged in', onPress: () => console.log('Cancel Pressed'), style: 'cancel'},
              {text: 'Sign me out!', onPress: this.signOut},
            ],
            { cancelable: true }
          )
        }}>Sign Out</Button></View>

          || <View>
            <ImageBackground source={{uri: "https://www.printelf.com/designer/images/bcard/1088x638/background/000-22.jpg"}} style={{width:500,height:1000,justifyContent:"center",alignItems:"center"}}>
              <Button onPress={this.signIn} mode="contained">Sign In with Google</Button>
              <Button onPress={this.fb_signIn} mode="contained">Sign In with Facebook</Button>
            </ImageBackground>
        </View>
      }
      
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  header: {
    fontSize: 25
  },
  text: {
    color: 'darkgray',
  },
  image: {
    marginTop: 15,
    width: 150,
    height: 150,
    borderColor: "rgba(0,0,0,0.2)",
    borderWidth: 3,
    borderRadius: 150
  },
    textInput: {
        height: 80,
        fontSize:24,
        width: '90%',
        borderColor: '#9b9b9b',
        borderBottomWidth: 4,
        marginTop: 8,
        marginVertical: 15
      }
  
})
