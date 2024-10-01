const express = require('express');
const bodyParser = require('body-parser');
const mysql = require('mysql');
const mustacheExpress = require('mustache-express');

const app = express();
const port = 3000;

app.engine('html', mustacheExpress());
app.set('view engine', 'html');
app.set('views', './');
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('images'));

var database = mysql.createConnection({
    host: 'localhost',
    user: 'shanath',
    password: 'midterm',
    database: 'HDB'
})

function renderHTML(template, res) {
    return function (error, results, fields) {
        if (error)
            throw error;
        res.render(template, { data: results });
    }
}

app.get('/', function (req, res) {
    res.render('index')
})

app.get('/yearly', function (req, res) {
    const query_Q1 = `SELECT YEAR(sale_info.date_sold) AS sale_year,
                      MIN(sales.price) AS lowest_sale_price,
                      MAX(sales.price) AS highest_sale_price
                      FROM sale_info 
                      JOIN sales ON sale_info.sale_info_id = sales.sale_id
                      GROUP BY sale_year;`;    

    database.query(query_Q1, (error, results) => {
        if (error) {
            return res.status(500).send("Database query failed");
        }

        // Format the sale prices with commas
        const formattedResults = results.map(row => ({
            sale_year: row.sale_year,
            lowest_sale_price: row.lowest_sale_price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ","),
            highest_sale_price: row.highest_sale_price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ","),
        }));

        // Render the HTML with formatted data
        res.render('yearly', { data: formattedResults });
    });
});


app.get('/town', function (req, res) {
    query_Q2 = `SELECT location.town, MIN(price) AS lowest, MAX(price) as highest,
                ROUND(AVG(price),0) as average,
                ROUND(STDDEV(price),0) as standard_deviation
                FROM sales
                JOIN sale_info AS sf ON sales.sale_id=sf.sale_info_id
                JOIN location ON sf.location_id=location.location_id
                GROUP BY location.town;`

    
                database.query(query_Q2, (error, results) => {
                    if (error) {
                        return res.status(500).send("Database query failed");
                    }
            
                    // Format the sale prices with commas
                    const formattedResults = results.map(row => ({
                        town: row.town,
                        lowest: row.lowest.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ","),
                        highest: row.highest.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ","),
                        average: row.average.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ","),
                        standard_deviation:row.standard_deviation.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                    }));
            
                    // Render the HTML with formatted data
                    res.render('town', { data: formattedResults });
                });
})

app.get('/common', function (req, res) {
    query_Q3 = `SELECT unit_type.flat_type AS room , unit_model.flat_model AS model,
    COUNT(*) AS combination_count
    FROM sale_info AS sf
    JOIN unit_type ON sf.flat_type_id = unit_type.flat_type_id
    JOIN unit_model ON sf.model_id = unit_model.model_id
    GROUP BY unit_type.flat_type, unit_model.flat_model
    ORDER BY combination_count DESC LIMIT 5;`
    
    database.query(query_Q3, renderHTML('common', res));
})

app.get('/lease', function (req, res) {
    query_Q4 = `WITH LeaseInfluence AS (
    SELECT lease_left AS lease, SUM(price) AS total_sum,
    ROUND(AVG(price),0) as average
    FROM sales JOIN sale_info as sf
    ON sales.sale_id = sf.sale_info_id
    WHERE lease_left IN (94,80,78,65,50,45)
    GROUP BY lease_left
    ORDER BY lease_left DESC
    )
    SELECT lease, total_sum, average FROM LeaseInfluence;`

    database.query(query_Q4, (error, results) => {
        if (error) {
            return res.status(500).send("Database query failed");
        }

        // Format the sale prices with commas
        const formattedResults = results.map(row => ({
            lease: row.lease,
            total_sum: row.total_sum.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ","),
            average: row.average.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ","),
        }));

        // Render the HTML with formatted data
        res.render('lease', { data: formattedResults });
    });
})

app.listen(port, function () {
    console.log('Listening on http://localhost:' + port + '.'); 
})
