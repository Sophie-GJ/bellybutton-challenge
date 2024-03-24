const url = "https://2u-data-curriculum-team.s3.amazonaws.com/dataviz-classroom/v1.1/14-Interactive-Web-Visualizations/02-Homework/samples.json";

// define variables that wil be used
let globalData = null;
let names = null;
let sample_values = null;
let otu_ids = null;
let otu_labels = null;
let metadata = null;

// get JSON and console log it
d3.json(url).then(function(data) {
    console.log(data);
    globalData = data;

    //Use D3 to access the dropdown menu
    let dropdownMenu = d3.select("#selDataset");

    // Add to the dropdown
    globalData.names.forEach((id) => {

        // Log the id values
        console.log(id);

        dropdownMenu.append("option")
            .text(id)
            .property("value", id);
        });

    // Attach event listener to the dropdown menu
    dropdownMenu.on("change", function() {
        let selectedValue = d3.select(this).property("value");
        optionChanges(selectedValue);
        });

    //initialize
    init();    
});

// Initialize the dashboard
function init(value = globalData.names[0]) {
    getSample(value);
    buildMetadata(value);
    buildBarChart(value);
    buildBubbleChart(value);
};

// Retrieve sample
function getSample(sample) {
let dataSample = globalData.samples;
console.log(sample)
let chosenSample = sampleData.filter(x => x.id == sample);

otu_ids = chosenSample[0].otu_ids;
otu_labels = chosenSample[0].otu_labels;
sample_values = chosenSample[0].sample_values;
}

// Create a function that populates metadata
function buildMetadata(sample) {
let dataSample = globalData.samples;
let chosenSample = dataSample.filter(x => x.id == sample);
console.log(chosenSample);

// Clear out metadata
d3.select("#sample-metadata").html("");

// Use Object.entries to add each key/value pair to the panel
Object.entries(chosenSample[0]).forEach(([key, value]) => {

    // Log the individual key/value pairs as they are being appended to the panel
    console.log(key,value);
        
    d3.select("#sample-metadata").append("h5").text(`${key}: ${value}`);
});
};

// bar chart
function buildBarChart(sample) {

    
    let yticks = otu_ids.slice(0,10).map(id => `OTU ${id}`).reverse();
    let xticks = sample_values.slice(0,10).reverse();
    let labels = otu_labels.slice(0,10).reverse();

    
    let trace = [{
        x: xticks,
        y: yticks,
        text: labels,
        type: "bar",
        orientation: "h"
    }];

    
    let layout = {
        title: "Top 10 OTUs Present"
    };

    // Plotly bar chart
    Plotly.newPlot("bar", trace, layout)
};

// bubble chart
function buildBubbleChart(sample) {

    let trace1 = [{
        x: otu_ids,
        y: sample_values,
        text: otu_labels,
        mode: "markers",
        marker: {
            size: sample_values,
            color: otu_ids,
            colorscale: "Earth",
            showscale: true,
        }
    }];

    let layout = {
        title: "Bacteria Per Sample",
        hovermode: "closest",
        xaxis: {title: "OTU ID"},
        yaxis: {title: "Occurences"},
    };

    // Plotly bubble chart
    Plotly.newPlot("bubble", trace1, layout)
};

// update dash at sample change
function optionChanges(value) {
    console.log(value);
    init(value);
};