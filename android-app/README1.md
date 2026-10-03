## Run the app

From `ReactNative_Without_FrameWork/AwesomeProject`:

```bash
npx react-native run-android
npx react-native run-ios
```

## Build Android AAB

From `ReactNative_Without_FrameWork/AwesomeProject/android`:

```bash
./gradlew clean bundleRelease
```

Generated file:

`app/build/outputs/bundle/release/app-release.aab`

## Play Store signing (important)

Current release config may use debug signing for local testing. For Play Store upload, create and use an upload keystore.

### 1) Create upload keystore

```bash
keytool -genkeypair -v -storetype PKCS12 -keystore my-upload-key.keystore -alias my-key-alias -keyalg RSA -keysize 2048 -validity 10000
```

### 2) Add signing properties

Add these keys in `android/gradle.properties`:

```properties
MYAPP_UPLOAD_STORE_FILE=my-upload-key.keystore
MYAPP_UPLOAD_KEY_ALIAS=my-key-alias
MYAPP_UPLOAD_STORE_PASSWORD=***
MYAPP_UPLOAD_KEY_PASSWORD=***
```

### 3) Use release signing config

Update `android/app/build.gradle` to read these properties for `signingConfigs.release`, and set:

`buildTypes.release.signingConfig signingConfigs.release`

Then build again:

```bash
cd android
./gradlew bundleRelease
```
