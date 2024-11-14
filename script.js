// script.js

// Define a Line class
class Line {
  constructor(y1, y2) {
    this.k = y2 - y1;
    this.b = y1;
  }

  intersection(line) {
    const x = (line.b - this.b) / (this.k - line.k);
    const y = this.k * x + this.b;
    return { x, y };
  }

  evaluate(x) {
    return this.k * x + this.b;
  }
}

document.addEventListener("DOMContentLoaded", function () {
  const plotDiv = document.getElementById("plot");
  const altInputs = {
    A: {
      X: document.getElementById("altAX"),
      Y: document.getElementById("altAY"),
    },
    B: {
      X: document.getElementById("altBX"),
      Y: document.getElementById("altBY"),
    },
    C: {
      X: document.getElementById("altCX"),
      Y: document.getElementById("altCY"),
    },
  };

  const updateBtn = document.getElementById("updateBtn");
  const resultsDiv = document.getElementById("results"); // Get the results div

  let line_A, line_B, line_C;

  function updateChart() {
    const alternatives = {
      A: [parseFloat(altInputs.A.X.value), parseFloat(altInputs.A.Y.value)],
      B: [parseFloat(altInputs.B.X.value), parseFloat(altInputs.B.Y.value)],
      C: [parseFloat(altInputs.C.X.value), parseFloat(altInputs.C.Y.value)],
    };

    line_A = new Line(alternatives["A"][0], alternatives["A"][1]);
    line_B = new Line(alternatives["B"][0], alternatives["B"][1]);
    line_C = new Line(alternatives["C"][0], alternatives["C"][1]);

    const X = Array.from({ length: 10 }, (_, i) => i / 10);

    // Calculate the maximum Y value among alternatives
    const maxAltY = 3 + Math.max(line_A.evaluate(1), line_B.evaluate(1), line_C.evaluate(1), line_A.evaluate(0), line_B.evaluate(0), line_C.evaluate(0));

    // Set the vertical line coordinates to be slightly higher
    const verticalLineY = [0, maxAltY + 0.1]; // You can adjust the 0.1 value to your preference

    const plotData = [
      {
        x: X,
        y: X.map((x) => line_A.evaluate(x)),
        type: "scatter",
        name: "A",
        line: { color: document.getElementById("altColorA").value }, // Get the color input value
      },
      {
        x: X,
        y: X.map((x) => line_B.evaluate(x)),
        type: "scatter",
        name: "B",
        line: { color: document.getElementById("altColorB").value }, // Get the color input value
      },
      {
        x: X,
        y: X.map((x) => line_C.evaluate(x)),
        type: "scatter",
        name: "C",
        line: { color: document.getElementById("altColorC").value }, // Get the color input value
      },
      {
        x: [0, 0], // X-coordinate of the vertical line
        y: verticalLineY, // Y-coordinate of the vertical line
        type: "line", // This is a line trace
        line: { color: "black" }, // Color of the vertical line
        name: "N1",
      },
      {
        x: [1, 1], // X-coordinate of the vertical line
        y: verticalLineY, // Y-coordinate of the vertical line
        type: "line", // This is a line trace
        line: { color: "black" }, // Color of the vertical line
        name: "N2",
      },
    ];

    const layout = {
      title: "Аналіз чутливості",
      xaxis: {
        title: "",
      },
      yaxis: {
        title: "",
      },
    };

    Plotly.newPlot(plotDiv, plotData, layout);

    const intersections = [0, 1];

    intersections.push(line_A.intersection(line_B).x);
    intersections.push(line_A.intersection(line_C).x);
    intersections.push(line_B.intersection(line_C).x);

    intersections.sort((a, b) => a - b);

    let resultsHTML = '';

    for (let i = 1; i < intersections.length; i++) {
      resultsHTML += `На інтервалі (${intersections[i - 1].toFixed(4)}, ${intersections[i].toFixed(4)}), найкращою альтернативою є варіант ${getBestAlternative(intersections[i - 1], intersections[i])}<br>`;
    }

    resultsDiv.innerHTML = resultsHTML; // Update the content of the results div
  }

  updateBtn.addEventListener("click", updateChart);

  // Function to get the best alternative for an interval
  function getBestAlternative(start, end) {
    let bestInterval = null; // Initialize as null
  
    const interval = (end + start) / 2;
    const alternatives = {
      A: line_A.evaluate(interval),
      B: line_B.evaluate(interval),
      C: line_C.evaluate(interval),
    };
  
    for (const alt in alternatives) {
      if (bestInterval === null || alternatives[alt] > alternatives[bestInterval]) {
        bestInterval = alt;
      }
    }
  
    return bestInterval ? bestInterval : "No best alternative"; // Provide a fallback message if no best alternative is found
  }   

  // Initial chart update
  updateChart();
});
