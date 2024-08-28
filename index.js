import express from 'express';
import bodyParser from 'body-parser';
import { connection, studData } from './schema.js';

const app = express();
const port = 3000;
connection();

// Set the view engine to ejs
app.set('view engine', 'ejs');

// Middleware to parse incoming request bodies
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Route to serve the HTML file with student data
app.get('/', async (req, res) => {
    try {
        const students = await studData.find();
        console.log(students)
        res.render('index', { students });
    } catch (err) {
        console.log("Error fetching student data:", err.message);
        res.status(500).send("Error fetching student data");
    }
});

// Route to handle form submissions
app.post('/submit', (req, res) => {
    const { id, name, mobile, address, city, hobbie, gender } = req.body;
    const insertDoc = new studData({
        id: id,
        name: name,
        mobile: mobile,
        address: address,
        city: city,
        hobbie: hobbie,
        gender: gender
    });

    insertDoc.save()
        .then(() => {
            res.send(`
                <script>
                    alert("Data submitted successfully!");
                    window.location.href = "/";
                </script>
            `);
        })
        .catch(() => {
            res.send(`
                <script>
                    alert("Error submitting data!");
                    window.location.href = "/";
                </script>
            `);
        });
});

// Route to display the update form
app.get('/update/:id', async (req, res) => {
    const studentId = req.params.id;
    try {
        const student = await studData.findById(studentId);
        if (student) {
            res.render('update', { student });
        } else {
            res.status(404).send("Student not found");
        }
    } catch (err) {
        console.log("Error fetching student data:", err.message);
        res.status(500).send("Error fetching student data");
    }
});

// Route to handle update form submissions
app.post('/update/:id', async (req, res) => {
    const studentId = req.params.id;
    const { name, mobile, address, city, hobbie, gender } = req.body;
    try {
        await studData.findByIdAndUpdate(studentId, {
            name: name,
            mobile: mobile,
            address: address,
            city: city,
            hobbie: hobbie,
            gender: gender  
        });
        res.send(`
            <script>
                alert("Data updated successfully!");
                window.location.href = "/";
            </script>
        `);
    } catch (err) {
        console.log("Error updating student data:", err.message);
        res.status(500).send("Error updating student data");
    }
});

// Route to handle delete requests
app.post('/delete/:id', async (req, res) => {
    const studentId = req.params.id;
    try {
        await studData.findByIdAndDelete(studentId);
        res.send(`
            <script>
                alert("Data deleted successfully!");
                window.location.href = "/";
            </script>
        `);
    } catch (err) {
        console.log("Error deleting student data:", err.message);
        res.status(500).send("Error deleting student data");
    }
});

// Start the server
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
