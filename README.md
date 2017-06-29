# epaper

# fresh build
ionic resources
ionic state restore
ionic build android


ionic plugin add phonegap-plugin-push --variable SENDER_ID="54566305933"

ionic plugin add cordova-plugin-network-information

ionic plugin add https://github.com/fourmisolutions/cordova-comscore-plugin

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

edit package.json for additional plugins

ionic state restore (to reinstall platforms/plugins)
ionic run android


install android sdk
install java
install gradle



http://stackoverflow.com/questions/20755044/how-to-install-cocoa-pods

For testing using the command `ionic serve`, please change the constant value `useProxy` in the file `www/js/constants.js` from `false` to `true`.
