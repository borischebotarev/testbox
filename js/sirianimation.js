var instance = new SiriWave({
  container: document.getElementById("siri-container"),
  width: 300,
  height: 120,
  style: 'ios9',
  autostart: false,
  cover: true,
  curveDefinition: [
    {
      color: "255, 255, 255",
      supportLine: true,
    },
    {
      color: "0, 195, 202",
    },
    {
      color: "37, 189, 173",
    },
    {
      color: "255, 154, 138",
    }

  ]
});
