const WEATHER_PROXY_HANDLER = {
  get: function(target, name) {
    return Reflect.get(target, name);
  },

  set: function(target, name, value) {
   // const newVal = (value * 1.8 + 32).toFixed(2) + 'F.';
   value = value + '°C';
   Reflect.set(target, name, value);
   return true; // throws Error if not returned: trap returned falsis..
  }
};

export { WEATHER_PROXY_HANDLER };