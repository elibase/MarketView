// Sample data as an array of objects
const sampleDataList = [
    {
        keyword: "AMZN",
        link: "https://www.bloomberg.com/news/articles/2026-03-12/amazon-plans-to-shift-annual-prime-day-sale-to-june-from-july/",
        title: "Amazon Plans to Shift Annual Prime Day Sale to June From July",
        publisher: "Bloomberg",
        publishDate: "March 12, 2026"
    },
    {
        keyword: "AMZN",
        link: "https://www.cnet.com/tech/services-and-software/amazon-to-increase-the-price-of-ad-free-prime-video-streaming/",
        title: "Amazon to Increase the Price of Ad-Free Prime Video Streaming",
        publisher: "CNET",
        publishDate: "March 13, 2026"
    }
];

// Function to add the data to the table
function addDataToTable(data) {
    // Get the table body element by its ID
    const tableBody = document.getElementById('articleTableBody');
    while (tableBody.hasChildNodes()) {
        tableBody.removeChild(tableBody.firstChild);
    }

    // Iterate over each object in the data array
    data.forEach(item => {
        // Create a new table row (<tr>)
        const row = document.createElement('tr');

        // Iterate over the values of the current object
        Object.keys(item).forEach(key => {
            // Create a new table cell (<td>)
            const cell = document.createElement('td');
            const value = item[key];

            if (key === 'link') {
                const ahref = document.createElement('a');
                ahref.href = item.link;
                ahref.textContent = item.title;
                cell.appendChild(ahref);
                row.appendChild(cell);
                return;
            } else if (key === 'title') {
                return;
            }


            // Set the text content of the cell to the data value
            cell.textContent = value;

            // Append the cell to the row
            row.appendChild(cell);
        });

        const buttonCell = document.createElement('td');
        const actionButton = document.createElement("button"); // Create the button element (<button>)
        actionButton.innerText = "Analysis"; // Button text
        actionButton.className = "btn"; // Add a class for styling/event handling
        /*
        actionButton.onclick = function () {
            // Define the action the button performs, e.g., an alert
            alert("Button clicked for row: " + newRow.rowIndex);
        };
        */

        // Append the button to the button cell
        buttonCell.appendChild(actionButton);

        row.appendChild(buttonCell);

        // Append the completed row to the table body
        tableBody.appendChild(row);
    });
}



document.addEventListener('DOMContentLoaded', (event) => {

    // Call the function to populate the table when the script runs
    //addDataToTable(sampleDataList);

    // Populate table when Gather Articles button is clicked
    const gatherArticlesButton = document.getElementById('gatherArticlesButton');
    gatherArticlesButton.addEventListener('click', () => {
        addDataToTable(sampleDataList);
    });

    // Get the table element by its ID
    document.getElementById("articleTable").addEventListener("click", function (e) {
        if (e.target.classList.contains("btn")) {
            const row = e.target.closest("tr"); // Finds the closest parent <tr>
            console.log("Row clicked:", row.rowIndex);
        }
    });

});