/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React, { Component } from 'react';
import {
  Platform,
  StyleSheet,
  Text,
  TextInput,
  Image,
  Button,
  FlatList,
  Dimensions,
  ScrollView,
  View
} from 'react-native';
import SocketIOClient from 'socket.io-client';


// const url = 'http://10.63.89.232:4001';
const url = 'http://nodechatserver123.herokuapp.com/'

class Header extends Component<Props>{
  constructor(props){
    super(props)
    this.state = {
      header:'React Native Chat'
    }
  }
  render(){
    const {message} = this.props;
    return (
      <View style={styles.header}>
        <View>
          <Image
              style={styles.imageHeader}
              source={require('./logo.png')}
            />

        </View>
        <Text color='#fff' style={styles.textHeader}>{message}</Text>
      </View>
    )
  }
}

class MessageBar extends Component<Props> {
  render(){
    const {position,user,time,message} = this.props;
    return(
      <View
        style={
          position===1?
          styles.personalBubble
          :
          styles.friendBubble
        }
        >
          <View style={position===1?styles.bubble:styles.bubblefriend}>
            <Text style={position===1?styles.userBubble:styles.userBubbleFriend}>{user}</Text>
            <Text style={position===1?styles.messageBubble:styles.messageBubbleFriend}>{message}</Text>
            <Text style={position===1?styles.timeBubble:styles.timeBubbleFriend}>{time}</Text>
          </View>
      </View>
    )
  }
}


type Props = {};
export default class App extends Component<Props> {
  constructor(props){
    super(props);
    this.socket = SocketIOClient(url);
    this.state = {
      user: '',
      logged: 0,
      chatList:[],
      message:'',
    }
    this.handleLogin = this.handleLogin.bind(this);
    this.handleOnChangeInput = this.handleOnChangeInput.bind(this);
    this.handleMessage = this.handleMessage.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleMessageEvent = this.handleMessageEvent.bind(this);
    this.send = this.send.bind(this);
    this.readSetState = this.readSetState.bind(this);
  }
  componentDidMount(){
    this.handleMessageEvent();
  }

  handleMessageEvent(){
      this.socket.on('message',(msg)=> {
        this.readSetState(msg);
      });
  }

  readSetState(msg){
    this.state.chatList.push(msg);
    this.setState(this.state);
  }

  handleLogin(e){
    this.setState({
      logged:1,
    });
  }
  handleOnChangeInput(e){
    this.setState({
      user:e.nativeEvent.text,
    });
  }
  handleSubmit(){
    var time = new Date();
    var msg ={
      user:this.state.user,
      message:this.state.message,
      time:time.getHours()+":"+time.getMinutes(),
    }
    this.send("message",msg)
    this.setState({message:''})
  }
  handleMessage(e){
    this.setState({
      message:e.nativeEvent.text,
    });
  }

  send(params,msg) {
    this.socket.emit(params,msg);
  }
  render() {
    let Messages = this.state.chatList.map((item,i) =>{
      return(
        <MessageBar
          key={i}
          user={item.user}
          message={item.message}
          time={item.time}
          position={item.user===this.state.user?1:0}
        />
      )
    });
    return this.state.logged === 0?
    (
      <View style={styles.container}>
        <Header
          message="Welcome to React Native Chat"
        />
        <View style={styles.loginView}>
          <TextInput
            onChange={(e)=>this.handleOnChangeInput(e)}
            placeholder="Username"
            style={styles.textName}
          />
          <Button
            title="Sign In"
            color="#FDD835"
            onPress={(e)=>this.handleLogin(e)}
          />
        </View>
      </View>
    ):
    (
      <View style={styles.container}>
        <Header
          message={"Welcome "+this.state.user}
        />

        <ScrollView  style={styles.messageBar}>
            {Messages}
        </ScrollView>

        {/* <FlatList
          style={styles.messageBar}
          data={this.state.chatList}
          renderItem={({item,}) =>
            <MessageBar
              user={item.user}
              message={item.message}
              time={item.time}
              position={item.user===this.state.user?1:0}
            />
          }
          keyExtractor={(item, index) => String(index)}
        /> */}

        <View style={styles.messageDiv}>
          <TextInput
            style={styles.messageBox}
            value={this.state.message}
            underlineColorAndroid='transparent'
            onChange={(e)=>this.handleMessage(e)}
          />
          <View
            style={styles.messageSend}
            >
            <Button
              title="Send"
              color="#FDD835"
              onPress={this.handleSubmit}
            />
          </View>
        </View>
      </View>
    )
  }
}



const win = Dimensions.get('window');

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5FCFF',
  },
  textName: {
    textAlign:"center",
    borderBottomColor: '#000',
    borderBottomWidth:  StyleSheet.hairlineWidth,
    marginBottom:10,
  },
  loginView:{
    marginTop:100,
    width : win.width*4/5,
    marginLeft: win.width/10,
  },
  header: {
    backgroundColor: '#222',
    padding: 20,
    width: win.width,
    alignItems: 'center',
  },
  imageHeader:{
    width:100,
    height:100,
  },
  textHeader:{
    color: '#fff',
  },
  messageDiv:{
    backgroundColor: '#000',
    padding: 3,
    position: 'absolute',
    bottom: 0,
    width: win.width,
    flexDirection:'row'
  },
  messageSend:{
    width: win.width /5,
    borderRadius:5,
  },
  messageBox:{
    width:win.width *4/5-1,
    backgroundColor:'#fff',
    padding:0,
    borderRadius:5,
  },
  personalBubble:{
    margin:5,
    display:'flex',
    flexDirection:'row-reverse',
  },
  friendBubble:{
    margin:5,
    display:'flex',
    flexDirection:'row',
  },
  bubble:{
    padding:10,
    maxWidth:win.width*7/10,
    backgroundColor:'#ECEFF1',
    borderRadius:5,
  },
  bubblefriend:{
    padding:10,
    maxWidth:win.width*7/10,
    backgroundColor:'#81C784',
    borderRadius:5,
  },
  userBubble:{
    fontWeight:'bold',
    textAlign:'right',
  },
  messageBubble:{
    // textAlign:'right',
  },
  timeBubble:{
    textAlign:'right',
    fontSize:10,
  },
  userBubbleFriend:{
    fontWeight:'bold',
  },
  messageBubbleFriend:{
  },
  timeBubbleFriend:{
    fontSize:10,
  },
  messageBar:{
    width:win.width,
    marginBottom:50,
    flex:1,
  }
});
