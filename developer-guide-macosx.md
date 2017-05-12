# Development Environment Setup and Configuration

**Skip any of the step(s) if the required configuration is already in place.**

Refer to the  [Ionic Getting Started guide](https://ionicframework.com/docs/v1/getting-started/) for more info.

1. Download and install JDK 8 from [here](http://www.oracle.com/technetwork/java/javase/downloads/index.html).

2. Download and install GIT from [here](https://git-scm.com/downloads).

3. Download and install Node.js version 6.X LTS from [here](https://nodejs.org/en/download/).

4. Install the Cordova and Ionic command-line tools in Terminal
```
$ sudo npm install -g cordova@6.5.0
$ sudo npm install -g ionic@2.2.3
```

5. Install required tools - Android
  - Refer to the Apache Cordova for Android guide  [here](http://cordova.apache.org/docs/en/latest/guide/platforms/android/index.html):
    - Follow the guide to download and install Android Studio and the environment.
    - After installation, run the Android Studio once which will initiate the Setup Wizard to download and install the necessary SDK and packages.
      - Use "Standard" setup type.
      - Take note of the Android SDK installation folder, e.g. `/Users/XXX/Library/Android/sdk`.
    - Set the required OS environment variables:
      - JAVA_HOME: Local JDK installation.
      - ANDROID_HOME: e.g. `/Users/XXX/Library/Android/sdk`
      - PATH: append `$ANDROID_HOME/tools, $ANDROID_HOME/tools/bin, $ANDROID_HOME/platform-tools`.
    - Create an Android Virtual Device (AVD)
      - Refer to the guide [here](https://developer.android.com/studio/run/managing-avds.html):
        - Using the Android Studio, create a dummy project first in order to to be able to access the `Android Studio > Tools > Android > AVD Manager`.

6. `TODO:` Install required tools - iOS
  - Refer to Apache Cordova for iOS guide [here](http://cordova.apache.org/docs/en/latest/guide/platforms/ios/index.html).



# Import Current Project into Local Repository

1. Open a Terminal.

2. Change current active directory to parent folder of the new project (replace [Folder Name] with the intended folder name):
```
$ cd [Folder Name]
```

3. Clone the GitHub project to local directory (replace [Branch Name] with the intended branch name):
```
$ git clone --branch [Branch Name] https://github.com/fourmisolutions/epaper.git
```

4. Change current activate directory to newly created project folder:
```
$ cd epaper
```

5. Configure the project dependencies into new project folder (this will create the "node_modules" folder):
```
$ npm install
```

6. Configure the platform and plugins into new project folder (this will create the "platform" and "plugins" folders):
```
$ ionic state reset
```
*Trouble-shooting: Possible Error #2*

7. Copy the required resources into "platforms" folder:
```
$ ionic resources
```

8. Build the project for android:
```
$ ionic build android
```
*Trouble-shooting: Possible Error #3*

9. Launch and view the application on a browser:
```
$ ionic serve
```

10. Launch and view the application on an android emulator or connected android phone:
```
$ ionic run android
```


# Trouble-shooting

## Possible Error #1:

```
Failed to install 'cordova-plugin-console':CordovaError: Could not find gradle wrapper within Android SDK. Might need to update your Android SDK.
Looked here: /Users/XXX/Library/Android/sdk/tools/templates/gradle/wrapper
```
- Solution: Refer to solution by "DaCookie" [here](https://forum.ionicframework.com/t/error-could-not-find-gradle-wrapper-within-android-sdk-might-need-to-update-yo-ur-android-sdk/22056/9).


## Possible Error #2:

```
Restoring Plugins

...
cordova plugin add phonegap-plugin-push  --variable SENDER_ID=167400319609
Caught exception:
 undefined

Mind letting us know? https://github.com/driftyco/ionic-cli/issues
```

- Solution:
  1. Open the project file "package.json".

  2. Locate and remove the following line from file "package.json":

    ```
    "phonegap-plugin-push  --variable SENDER_ID=167400319609",
    ```

  3. Execute the following commands to see the actual error messages:

    ```
    $ ionic state reset
    ```
    ```
    $ ionic plugin add phonegap-plugin-push --variable SENDER_ID="54566305933"
    ```
    Error messages:
    ```
    Fetching plugin "phonegap-plugin-push@1.10.3" via npm

    Installing "phonegap-plugin-push" for android
    ...

    BUILD SUCCESSFUL
    ...

    Installing "phonegap-plugin-push" for ios

    Failed to install 'phonegap-plugin-push':undefined

    Error: CocoaPods was not found. Please install version 1.0.1 or greater from https://cocoapods.org/
    ```
    - To develop and test for android only, the plug-in is added successfully.
    - `TODO:` To develop and test for ios, please proceed to install CocoaPods as per the error message and retry.


## Possible Error #3:

```
...
Running command: /Users/XXX/git/epaper/hooks/after_prepare/copy_resource_files.js /Users/XXX/git/epaper

Error: spawn EACCES
...
```

  - Solution:
    - Refer to solution [here](https://forum.ionicframework.com/t/failure-while-building-the-project-environment/40376/5).

    - Execute the following command to assign the required execution right to the JS file:

      ```
      $ chmod +x hooks/after_prepare/copy_resource_files.js
      ```
