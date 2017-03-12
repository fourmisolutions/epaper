# epaper

ionic plugin add phonegap-plugin-push --variable SENDER_ID="54566305933"

ionic plugin add cordova-plugin-network-information

If contain error like this, follow this step - http://stackoverflow.com/questions/33475178/cordova-fails-to-build-on-android-gcm-dependency
* What went wrong:
A problem occurred configuring root project 'android'.
> Could not resolve all dependencies for configuration ':_debugCompile'.
   > Could not find any version that matches com.google.android.gms:play-service
s-gcm:9.8+.
     Versions that do not match:
         9.6.1
         9.6.0
         9.4.0
         9.2.1
         9.2.0
         + 7 more
         
ionic platform update android

http://ionicframework.com/docs/ionic-cli-faq/#cordova-directory

java 8

android 7 (API - 24)

http://stackoverflow.com/questions/30203266/cordova-build-release-android-always-picks-the-highest-api-level

E:\workspace\training\epaper>ionic plugin list
cordova-plugin-compat 1.1.0 "Compat"
cordova-plugin-console 1.0.6 "Console"
cordova-plugin-device 1.1.5 "Device"
cordova-plugin-file 4.3.2 "File"
cordova-plugin-network-information 1.3.1 "Network Information"
cordova-plugin-splashscreen 4.0.2 "Splashscreen"
cordova-plugin-statusbar 2.2.2 "StatusBar"
cordova-plugin-whitelist 1.3.2 "Whitelist"
ionic-plugin-keyboard 2.2.1 "Keyboard"
org.apache.cordova.plugin.cache 1.0.5 "Clear Cache"
phonegap-plugin-push 1.10.0 "PushPlugin"