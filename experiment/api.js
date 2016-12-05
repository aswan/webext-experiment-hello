class API extends ExtensionAPI {
  getAPI(context) {
    return {
      hello: {
        async hello() {
          return "Hello, world!";
        }
      }
    };
  }
}
