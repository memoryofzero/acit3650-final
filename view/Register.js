import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { StyleSheet, TextInput, Text, View, Image, Button, Alert } from 'react-native';
import firebase from 'react-native-firebase';

export default class Register extends Component {

	constructor(props) {
		super(props);
		this.state={
			signedIn: false,
			email: "",
			password: "",
			verify_password: "",
			err_message: "",

		}
	}

	componentDidMount() {
	  firebase.auth().onAuthStateChanged(user => {
	    this.props.navigation.navigate(user ? 'NotUber' : 'Register')
	  })
	}

	  signUp = () => {
	    firebase
	      .auth() .createUserWithEmailAndPassword(this.state.email, this.state.password)
	      .then(() => this.props.navigation.navigate('NotUber'))
	      .catch(error => this.setState({ errorMessage: error.message }))
	  }

	render() {
		const { navigation }=this.props;

		return (
			<View style={styles.container}>
			<Text style={styles.registerTitle}>
				Register for an account
			</Text>
			<TextInput
			style={styles.textInput}
			label='Email address'
			placeholder='kevin@example.com'
			autoCapitalize='none'
		  	onChangeText={email => this.setState({ email })}
			value={this.state.email}
			/>
			<TextInput
			style={styles.textInput}
			secureTextEntry
			placeholder='Password'
			secureTextEntry={true}
			autoCapitalize='none'
			onChangeText={password => this.setState({ password })}
			value={this.state.password}
			/>
			<TextInput
			style={styles.textInput}
			secureTextEntry
			placeholder='Verify Password'
			secureTextEntry={true}
			autoCapitalize='none'
			onChangeText={verify_password => this.setState({ verify_password })}
			value={this.state.verify_password}
			/>
			{
				true ?
				<Text>is true</Text> :
				<Text>is false</Text>
			}
      <View>
        <Button title="Sign Up" color="#e93766" onPress={this.signUp}/></View>
			</View>
			)}
	}

const styles=StyleSheet.create({
	registerTitle: {
	    fontSize:36,
	    color:"bbb",

	},
	container: {
	  flex: 1,
	  justifyContent: 'center',
	  alignItems: 'center'
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
