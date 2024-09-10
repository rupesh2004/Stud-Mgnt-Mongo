import express from 'express';
import bodyParser from 'body-parser';
import { connection, studData, contactData } from './schema.js';

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
        const totalStudents = await studData.countDocuments();
        const maleStudents = await studData.countDocuments({gender : "Male"})
        const feMaleStudents = await studData.countDocuments({gender : "Female"})

        res.render('index',{totalStudents, maleStudents, feMaleStudents});
    } catch (err) {
        console.log("Error fetching student data:", err.message);
        res.status(500).send("Error fetching student data");
    }
});

app.get('/students',async (req,res) => {
    try {
        const students = await studData.find();
        console.log(students)
        res.render('students', { students }); 
    } catch (err) {
        console.error("Error retrieving students:", err);
        res.status(500).send('Server Error');
    }
});

app.post('/submitContact',async (req,res) => {
    const {name, email, message} = req.body;
    const insertData  = new contactData({
        name: name,
        email: email,
        message: message
    })

    insertData.save()
    .then(()=>{
        res.send(`
            <script>
                alert("Message Sent Successfully!");
                window.location.href = "/contact";
            </script>
        `);
    })
    .catch((err)=>{
        console.log(err.message)

        res.send(`
            <script>
                alert("Failed to send message!");
                window.location.href = "/contact";
            </script>
        `);
    })
});
app.get('/adminLogin',async (req,res) => {
    try {
        res.render('adminLogin'); 
    } catch (err) {
        console.error("Error retrieving students:", err);
        res.status(500).send('Server Error');
    }
});

app.get('/viewStudents', async (req, res) => {
    try {
        const students = await studData.find(); // Fetch all students from the database
        res.render('viewStudents', { students }); // Render the viewStudents.ejs with the students data
    } catch (err) {
        console.error("Error retrieving students:", err);
        res.status(500).send('Server Error');
    }
});

// Route to handle admin login and render the viewStudents page after login
app.post('/viewStudents', async (req, res) => {
    const { username, password } = req.body;
    if (username === "rupesh" && password === "rupesh@123") {
        try {
            const students = await studData.find();
            res.render('viewStudents', { students });
        } catch (err) {
            console.error("Error retrieving students:", err);
            res.status(500).send('Server Error');
        }
    } else {
        res.send(`
            <script>
                alert("Invalid Credentials");
                window.location.href = "/adminLogin";
            </script>
        `);
    }
});


app.get('/contact',(req,res)=>{
    res.render('contact')
})



app.get('/view/:id', async (req, res) => {
    try {
        const studentId = req.params.id;
        const student = await studData.findById(studentId);

        if (!student) {
            return res.status(404).send('Student not found');
        }

        res.render('viewStud', { student: student }); // Renders the viewStudent.ejs page
    } catch (err) {
        console.error(err);
        res.status(500).send('Server Error');
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
                    window.location.href = "/students";
                </script>
            `);
        })
        .catch(() => {
            res.send(`
                <script>
                    alert("Error submitting data!");
                    window.location.href = "/students";
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
                window.location.href = "/viewStudents";
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
                window.location.href = "/viewStudents";
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
