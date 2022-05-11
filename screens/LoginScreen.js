import React, {Component} from "react";
import {Text, View} from 'react-native';

export default class LoginScreen extends Component {
    onSignIn = googleUser => {
        console.log('Google Auth Response', googleUser);

        var unsubscibe = firebase.auth().onAuthStateChanged((firebaseUser) =>{
            if(!this.isUserEqual(googleUser.firebaseUser)){
                var credential = firebase.auth.GoogleAuthProvider.credential(
                    googleUser.idToken,
                    googleUser.accessToken
                );

                firebase
                .auth()
                .signInWithGoogleCredential(credential)
                .then(function(result){
                    if(result.additionalUserInfo.isNewUser){
                        firebase
                         .database()
                         .ref("/user/"+result.user.uid)
                         .set({
                             gmail:result.user.email,
                             profile_picture:result.additionalUserInfo.profile.picture,
                             Locale:result.additionalUserInfo.profile.Locale,
                             first_name:result.additionalUserInfo.profile.given_name,
                             Last_name:result.additionalUserInfo.profile.family_name,
                         })
                         .then(function(snapshot){

                         })
                    }
                })
                .catch((error) =>{
                    var errorCode = error.code;
                    var errorMessage = error.message;

                    var email = error.email;

                    var credential = error.credential;
                });
            }else {
                console.log("User already signed-in firebase");
            }
        });
    }
  signInWithGoogleAsync = async () => {
    try {
      const result = await Google.logInAsync({
        behaviour: "web",
        androidClientId:
          "984652296881-ep98edanemrhkjln0gf00doi89glctbd.apps.googleusercontent.com",
        iosClientId:
          "984652296881-ep98edanemrhkjln0gf00doi89glctbd.apps.googleusercontent.com",
        scopes: ["profile", "email"]
      });

      if (result.type === "success") {
        this.onSignIn(result);
        return result.accessToken;
      } else {
        return { cancelled: true };
      }
    } catch (e) {
      console.log(e.message);
      return { error: true };
    }
  };
    
    render(){
        return(
            <View style = {{
                flex:1,
                justifyContent:"center",
                alignItems:"center"
            }}>
                <Button
                    title = "Sign in With Google"
                    onPress={()=>this.signInWithGoogleAsync()}>
                </Button>
            </View>
        )
    }
}