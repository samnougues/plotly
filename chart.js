function init() {
  // Grab a reference to the dropdown select element
  var selector = d3.select("#selDataset");
  // Use the list of sample names to populate the select options
  d3.json("samples.json").then((data) => {
    var sampleNames = data.names;
    sampleNames.forEach((sample) => {
      selector
        .append("option")
        .text(sample)
        .property("value", sample);
    });

    // Use the first sample from the list to build the initial plots
    var firstSample = sampleNames[0];
    buildCharts(firstSample);
    buildMetadata(firstSample);
  });
}

// Initialize the dashboard
init();

function optionChanged(newSample) {
  // Fetch new data each time a new sample is selected
  buildMetadata(newSample);
  buildCharts(newSample);
}

// Demographics Panel 
function buildMetadata(sample) {
  d3.json("samples.json").then((data) => {
    var metadata = data.metadata;
    // Filter the data for the object with the desired sample number
    var resultArray = metadata.filter(sampleObj => sampleObj.id == sample);
    var result = resultArray[0];
    // Use d3 to select the panel with id of `#sample-metadata`
    var PANEL = d3.select("#sample-metadata");

    // Use `.html("") to clear any existing metadata
    PANEL.html("");

    // Use `Object.entries` to add each key and value pair to the panel
    // Hint: Inside the loop, you will need to use d3 to append new
    // tags for each key-value in the metadata.
    Object.entries(result).forEach(([key, value]) => {
      PANEL.append("h6").text(`${key.toUpperCase()}: ${value}`);
    });
  });
}

// ### DELIVERABLE 1 ###

// Create the buildCharts function.
function buildCharts(sample) {
  // Use d3.json to load and retrieve the samples.json file 
  d3.json("samples.json").then((data) => {
      // Create a variable that holds the samples array. 
      var samples = data.samples;
      // Create a variable that filters the samples for the object with the desired sample number.
      var resultArray = samples.filter(sampleObj => sampleObj.id == sample);

      // Create a variable that filters the metadata array for the object with the desired sample number.
      var metaData = data.metadata;
      var metaArray = metaData.filter(sampleObj => sampleObj.id == sample);

      // Create a variable that holds the first sample in the array.
      var firstResult = resultArray[0];

      // Create a variable that holds the first sample in the metadata array.
      var metaResult = metaArray[0];

      // Create variables that hold the otu_ids, otu_labels, and sample_values.
      var PANEL = d3.select("#sample-metadata");
      var otuIds = firstResult.otu_ids;
      var otuLabels = firstResult.otu_labels;
      var sampleValues = firstResult.sample_values;

      // Create a variable that holds the washing frequency.
      var washFreq = metaResult.wfreq;

      // Create the yticks for the bar chart.
      var yticks = otuIds.slice(0,10).map(otuID => `OTU ${otuID}`).reverse();

      // Create the trace for the bar chart. 
      var barData = [{
        x: sampleValues.slice(0,10).reverse(),
        y: yticks,
        text: otuLabels.slice(0,10).reverse(),
        type: "bar",
        orientation: "h"
      }];

    // Create the layout for the bar chart. 
    var barLayout = {
      width: 500,
      height: 500,
      title: "Top 10 Bacteria Cultures",
      font: {color:"black"},
      automargin: true
    };
    // Use Plotly to plot the data with the layout. 
      Plotly.newPlot("barChart", barData, barLayout);

    // ### DELIVERABLE 2 ###

    // Create the trace for the bubble chart.
    var bubbleData = [{
      x: otuIds,
      y: sampleValues,
      text: otuLabels,
      mode: "markers",
      marker: {
        size: sampleValues,
        color: otuIds,
        colorscale: "Portland"   
      }
    }];

    // Create the layout for the bubble chart.
    var bubbleLayout = {
      title: "Bacteria Samples Per Culture",
      xaxis: {title:"OTU ID"},
      automargin: true,
      //margin: {t: 50},
      hovermode: "closest"
    };

    // Use Plotly to plot the data with the layout.
    Plotly.newPlot("bubbleChart", bubbleData, bubbleLayout); 

    // ### DELIVERABLE 3 ###

    // Create the trace for the gauge chart.
    var gaugeData = [{
      domain: {x:[0,1], y:[0,1]},
      value: washFreq,
      title: {text: "<b> Belly Button Washing Frequency</b> <br> # of Scrubs per Week"},
      type: "indicator",
      mode: "gauge+number",
      gauge: {
        axis: {range: [null, 10], tickwidth: 2, tickcolor: "black"},
        bar: {color: "black"},
        steps: [
          {range: [0, 2], color: "green"},
          {range: [2, 4], color: "orange"},
          {range: [4, 6], color: "yellow"},
          {range: [6, 8], color: "blue"},
          {range: [8, 10], color: "red"}],
        threshold: {value: washFreq,}
      }}];

    // Create the layout for the gauge chart.
    var gaugeLayout = { 
      width: 500, 
      height: 500,
      font: {color: "black"}
    };

    // Use Plotly to plot the gauge data and layout.
    Plotly.newPlot("gaugeChart", gaugeData, gaugeLayout);
  })};