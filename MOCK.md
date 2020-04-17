# Event mocking for dev & QA

In order to be able to complete all OK/KO cases of all flows for testing and development, we expose a way to mock events that require interaction with a real device. When running with the env variable `MOCK` you'll have access to `mockDeviceEvent` which receives one or more events that will be emitted to the subscribed observers triggering the associated actions.

### Dev
Simply open the console, `mockDeviceEvent` is available as a global window variable. Pass the snippet below or any event of your liking to that method.

### QA
As it's done in the `onboarding.spec.js` file, we need to get access to that method via a call to `const mockeDeviceEvent = getMockDeviceEvent(app)` afterward the functionality of the method is the same as for dev with the exception of having to `await` the result to not break the tests.

## What is this useful for?
It allows us to interact with all parts of the application without the need for a real device or real accounts. 

## Snippets per-flow
These are a series of snippets that allow you to reach the OK and KO ends of a device interaction for each of the flows. For the KOs, we can essentially use the name of any error and it will throw it, depending on the flow ones make more sense than others.

### Successfully opening an app

```js
mockDeviceEvent({ type: "opened" })
```

### Device allow events

```js
 mockDeviceEvent({ type: "device-permission-requested", wording: "Allow manager" })
```

```js
 mockDeviceEvent({ type: "device-permission-granted" })
```

### Genuine Check / Manager termination

(note it's not an array) We could make other profiles for devices available and fix the sizes of the apps returned by `mockListAppsResult` to test things like the storage breakdown in the manager. **Note** for devs in the console you will be able to run this snippet only because we've exposed the dependencies as globals when in mock.

Refer to the signature of `mockListAppsResult` to see the doors it opens. But a tldr is the first parameter are the apps available in the catalog, the second is the list of installed apps.

```js
 mockDeviceEvent(
    { type: "listingApps", deviceInfo: deviceInfo155 },  
    {  
      type: "result",  
      result: mockListAppsResult("Bitcoin", "Bitcoin", deviceInfo155),  
    }
  )
   ```

#### Error samples

```
mockDeviceEvent({ type: "error", error: { name: "DisconnectedDevice" } })

mockDeviceEvent({ type: "error", error: { name: "GenuineCheckFailed" } })

mockDeviceEvent({ type: "error", error: { name: "WrongDeviceForAccount" } })

mockDeviceEvent({ type: "error", error: { name: "UserRefusedOnDevice" } })
```
