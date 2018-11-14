const express = require("express"),
    path = require("path"),
    port = process.env.PORT || 8081,
    app = express(),
    compression = require("compression");

app.use(compression());

app.use(express.static(path.join(__dirname, "dist/")));

app.get("*", function(req, res) {
    res.sendFile("index.html", { root: path.join(__dirname, "dist/") });
});

app.listen(port, function() {
    console.log("Callback function");
});

// console.log(`Production Server Running: 199.116.235.142:${port}`);
