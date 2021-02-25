/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import React, {PureComponent, Component} from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  Image,
  Dimensions
} from 'react-native';

import { RNCamera } from 'react-native-camera';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import Orientation from 'react-native-orientation-locker';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = { 
      photo: null, 
      textBlocks: null,
      everprove: false,
      flashMode: RNCamera.Constants.FlashMode.on,
      cameraType: RNCamera.Constants.Type.back,
      autoFocus: RNCamera.Constants.AutoFocus.on,
      focusPoint: { x : 0.5, y : 0.5 },
      dimensions: undefined,
      rotate: '0deg',
    };
  } 

  _onOrientationDidChange = (orientation) => {
    switch (orientation) {
      case 'PORTRAIT':       
        this.setState({rotate: '0deg'});
      break;    
      case 'LANDSCAPE-RIGHT':       
        this.setState({rotate: '270deg'});
      break;    
      case 'LANDSCAPE-LEFT':       
        this.setState({rotate: '90deg'});
      break;    
      case 'PORTRAIT-UPSIDEDOWN':       
        this.setState({rotate: '180deg'});
      break;    
      case 'UNKNOWN':       
        this.setState({rotate: '0deg'});
      break;    
    }
  }


  componentDidMount() {
    Orientation.addDeviceOrientationListener(this._onOrientationDidChange);
  }

  componentWillUnmount() {
    Orientation.removeDeviceOrientationListener(this._onOrientationDidChange);
  }

  takePicture = async () => {
    if (this.camera) {
      const options = { quality: 1, base64: true, orientation: "portrait" };
      const data = await this.camera.takePictureAsync(options);
      this.setState({ photo: data });
    } 
  };

  toggleFlash = async () => {
    switch (this.state.flashMode) {
      case RNCamera.Constants.FlashMode.off:
        this.setState({flashMode : RNCamera.Constants.FlashMode.on});
      break;
      case RNCamera.Constants.FlashMode.on:
        this.setState({flashMode : RNCamera.Constants.FlashMode.torch});
      break;
      case RNCamera.Constants.FlashMode.torch:
        this.setState({flashMode : RNCamera.Constants.FlashMode.auto});
      break;
      case RNCamera.Constants.FlashMode.auto:
        this.setState({flashMode : RNCamera.Constants.FlashMode.off});
      break;
    }
  };

  toggleCameraType = async () => {
    if( this.state.cameraType == RNCamera.Constants.Type.back ) {
      this.setState({cameraType : RNCamera.Constants.Type.front});
    } else {
      this.setState({cameraType : RNCamera.Constants.Type.back});
    }
  };

  toggleAutoFocus = async () => {
    if( this.state.autoFocus == RNCamera.Constants.AutoFocus.on ) {
      this.setState({autoFocus : RNCamera.Constants.AutoFocus.off});
    } else {
      this.setState({autoFocus : RNCamera.Constants.AutoFocus.on});
    }
  };

  setFocusPoint = async (point) => {
    const width = ( this.state.dimensions ? this.state.dimensions.width : Dimensions.get('window').width );
    const height = ( this.state.dimensions ? this.state.dimensions.height : Dimensions.get('window').height );  

    let x0 = point.x / width;
    let y0 = point.y / height;
    
    let x = y0;
    let y = -x0 + 1;

    if( height <= width ) {
      x = point.x / height;
      y = point.y / width;
    }
    this.setState({ focusPoint: {x: x, y: y} });
  };

  analyzeText = async (blocks) => {
    if( Array.isArray(blocks) ) {
      blocks.forEach(element => {
        //console.log(element.value);
        let text = element.value.toLowerCase();
        console.log(text);
        if( text.indexOf("everprove") > -1 )
        {
          console.log('detect');
          if( ! this.state.everprove )
          {
            this.setState({ everprove: true });
            
            setTimeout(function(alma){ alma.setState({ everprove: false }); }, 5000, this);
          }
        }
      });
    }
  };
  
  onLayout = event => {
    let {width, height} = event.nativeEvent.layout
    this.setState({dimensions: {width, height}});
  }

  render() {
    let flashIcon = 'flash';

    switch (this.state.flashMode) {
      case RNCamera.Constants.FlashMode.off:
        flashIcon = 'flash-off';
      break;
      case RNCamera.Constants.FlashMode.on:
        flashIcon = 'flash';
      break;
      case RNCamera.Constants.FlashMode.torch:
        flashIcon = 'flashlight';
      break;
      case RNCamera.Constants.FlashMode.auto:
        flashIcon = 'flash-auto';
      break;
    }

    let typeIcon = 'camera-rear';

    switch (this.state.cameraType) {
      case RNCamera.Constants.Type.back:
        typeIcon = 'camera-rear';
      break;
      case RNCamera.Constants.Type.front:
        flashIcon = 'flash-alert';
        typeIcon = 'camera-front';
      break;
    }

    let focusIcon = 'focus-auto';
    let focusIconColor = 'white';

    switch (this.state.autoFocus) {
      case RNCamera.Constants.AutoFocus.on:
        focusIconColor = 'rgba(255,255,255,0.9)';
      break;
      case RNCamera.Constants.AutoFocus.off:
        focusIconColor = 'rgba(255,255,255,0.2)';
      break;
    }

    const width = ( this.state.dimensions ? this.state.dimensions.width : Dimensions.get('window').width );
    const height = ( this.state.dimensions ? this.state.dimensions.height : Dimensions.get('window').height );  

    return (
    <>
      <View style={styles.container}>
        { this.state.photo &&
          <> 
            <Image style={[styles.preview, {
                width: width, 
                height: height,
                //transform: [{rotate: ( width > height ? '90deg' : '0deg' ) }]
              }]}
              source={this.state.photo} />
            <View style={{ flex: 0, flexDirection: 'row', justifyContent: 'center' }}>
              <TouchableOpacity onPress={() => {this.setState({photo: null});}} style={styles.capture}>
                <Text style={{ fontSize: 14, color: 'white' }}> BACK </Text>
              </TouchableOpacity>
            </View>
          </>
        }
        { !this.state.photo &&
          <> 
            { this.state.everprove && 
            <View style={{ 
              backgroundColor: "rgba(0,0,0,0.8)", 
              position: "absolute", 
              zIndex: 10, 
              width: Dimensions.get('window').width,
              height: Dimensions.get('window').height,
              justifyContent: 'center',
              alignItems: 'center' 
            }}>
              <Text style={{
                color: "white", 
                fontSize: 20,
                textAlign: 'center'
              }}>{"WOW, Everprove.\n\nEverprove is cool and you are AWESOME!"}</Text>
            </View> }
            <TouchableOpacity onPress={() => this.toggleCameraType()} style={[
              styles.capture,{
                position: 'absolute',
                right: 0,
                top: 0,
                zIndex: 5,
                paddingHorizontal:3,
                paddingVertical: 3,
                backgroundColor: "rgba(0,0,0,0.2)" 
              }]}>
                <Icon name={typeIcon} size={30} color="white" style={{transform: [{rotate: this.state.rotate}]}}/>
                {/*<Text style={{ fontSize: 14 }}> SNAP </Text> */}
            </TouchableOpacity>
            <RNCamera
              ref={ref => {
                this.camera = ref;
              }}
              onLayout={this.onLayout}
              style={[styles.preview, {
              }]}
              type={this.state.cameraType}
              flashMode={this.state.flashMode}
              autoFocus={this.state.autoFocus}
              autoFocusPointOfInterest={this.state.focusPoint}
              androidCameraPermissionOptions={{
                title: 'Permission to use camera',
                message: 'We need your permission to use your camera',
                buttonPositive: 'Ok',
                buttonNegative: 'Cancel',
              }}
              androidRecordAudioPermissionOptions={{
                title: 'Permission to use audio recording',
                message: 'We need your permission to use your audio',
                buttonPositive: 'Ok',
                buttonNegative: 'Cancel',
              }}
              onTap={point => this.setFocusPoint(point)}
              onDoubleTap={point => {this.setFocusPoint(point);this.takePicture();}}
//              onFacesDetected={() => {console.log('face')}}
//              onTextRecognized={(textBlocks) => this.analyzeText(textBlocks.textBlocks)}
            />
            <View style={{ flex: 0, flexDirection: 'row', justifyContent: 'center' }}>
              <TouchableOpacity onPress={() => this.toggleFlash()} style={styles.capture}>
                <Icon name={flashIcon} size={30} color="white" style={{transform: [{rotate: this.state.rotate}]}}/>
                {/*<Text style={{ fontSize: 14 }}> SNAP </Text> */}
              </TouchableOpacity>
              <TouchableOpacity onPress={() => this.takePicture()} style={styles.capture}>
                <Icon name="camera-iris" size={60} color="white"/>
                {/*<Text style={{ fontSize: 14 }}> SNAP </Text> */}
              </TouchableOpacity>
              <TouchableOpacity onPress={() => this.toggleAutoFocus()} style={styles.capture}>
                <Icon name={focusIcon} size={30} color={focusIconColor} style={{transform: [{rotate: this.state.rotate}]}}/>
                {/*<Text style={{ fontSize: 14 }}> SNAP </Text> */}
              </TouchableOpacity>
            </View>
          </>
        }
      </View>
    </>
  );
}
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    backgroundColor: 'black',
    color: "white"
  },
  preview: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  capture: {
    flex: 0,
    backgroundColor: 'rgba(0,0,0,0)',
    borderRadius: 5,
    padding: 15,
    paddingHorizontal: 20,
    alignSelf: 'center',
    margin: 20,
  },
});

export default App;
