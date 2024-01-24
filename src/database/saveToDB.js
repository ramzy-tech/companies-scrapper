const { excuteQuery, connection } = require("./dbConn");
const fs = require("fs");
const path = require("path");

(async () => {
  // Create a readable stream from the JSON file
  const jsonData = fs.readFileSync(
    path.join(__dirname, "..", "data.json"),
    "utf8"
  );
  const data = JSON.parse(jsonData);

  // Filter unique records based on the 'name' property
  const uniqueRecords = [];
  const recordNamesSet = new Set();

  data.forEach((record) => {
    if (!recordNamesSet.has(record.name)) {
      uniqueRecords.push(record);
      recordNamesSet.add(record.name);
    }
  });
  try {
    // Insert unique records into the database
    for (const record of uniqueRecords) {
      const searchArr = ["web", "mobile", "erp", "blockchain", "ui/ux"];
      const servicesArr = searchArr.map((serviceDbName) =>
        record.services.some((service) =>
          service.toLowerCase().includes(serviceDbName)
        )
      );

      const newLinksObj = {};
      Object.keys(record.links).forEach((link) => {
        newLinksObj[link] = record.links[link].replace(/\/+$/, "");
      });

      await excuteQuery({
        query: `INSERT INTO companies (name, logo, rating, tagline, reviews, minProjectSize, hourlyRate, employees, location, website, profile, linkedin, facebook, twitter, instagram, web, mobile, erp, blockchain, \`ui/ux\`) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);`,
        values: [
          record.name,
          record.logo,
          record.rating,
          record.tagline,
          record.reviews,
          record.minProjectSize,
          record.hourlyRate,
          record.employees,
          record.location,
          newLinksObj.website ? new URL(newLinksObj.website).origin : null,
          newLinksObj.profile,
          newLinksObj.linkedin ?? null,
          newLinksObj.facebook ?? null,
          newLinksObj.twitter ?? null,
          newLinksObj.instagram ?? null,
          servicesArr[0] ? "1" : "0",
          servicesArr[1] ? "1" : "0",
          servicesArr[2] ? "1" : "0",
          servicesArr[3] ? "1" : "0",
          servicesArr[4] ? "1" : "0",
        ],
      });
    }
    // Close the database connection after insertions are done
    connection.end((err) => {
      if (err) {
        console.error("Error closing the database connection: " + err.message);
      } else {
        console.log("Database connection closed.");
      }
    });
  } catch (error) {
    console.log(error.message);
  }
})();
