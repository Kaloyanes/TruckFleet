export default defineNuxtPlugin((nuxtApp) => {
  const payload = nuxtApp.payload;

  for (const key in ["_errors", "data"]) {
    if (!isReactive(payload[key])) {
      payload[key] = shallowReactive(payload[key]!);
    }
  }

  if (!isReactive(payload.state)) {
    payload.state = reactive(payload.state);
  }
});
